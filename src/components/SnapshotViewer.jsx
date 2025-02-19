import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useAccount, useContractRead, useContractWrite, useWaitForTransaction } from 'wagmi';
import { Button, Card, Table, Spinner, Alert } from 'flowbite-react';
import { HiOutlineDownload, HiOutlineCamera } from 'react-icons/hi';
import { toast, Toaster } from 'react-hot-toast';
import { BiX, BiSearch } from 'react-icons/bi';
import MemeTokenABI from '../abi/MemeToken.json';

// Toast configuration
const toastOptions = {
    style: {
        background: '#333',
        color: 'white',
        padding: '12px',
        borderRadius: '8px',
    },
    success: {
        style: {
            background: '#10B981',
        },
    },
    error: {
        style: {
            background: '#EF4444',
        },
    },
    position: 'top-center',
    duration: 3000,
};

const SnapshotViewer = ({ onClose }) => {
    const [inputTokenAddress, setInputTokenAddress] = useState('');
    const [verifiedTokenAddress, setVerifiedTokenAddress] = useState('');
    const [tokenContract, setTokenContract] = useState(null);
    const [snapshots, setSnapshots] = useState([]);
    const [selectedSnapshot, setSelectedSnapshot] = useState(null);
    const [holderData, setHolderData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [error, setError] = useState('');
    const { address } = useAccount();
    const [isWaitingForWallet, setIsWaitingForWallet] = useState(false);

    // Check if connected wallet is token owner
    const { data: tokenOwner } = useContractRead({
        address: verifiedTokenAddress || undefined,
        abi: MemeTokenABI.abi,
        functionName: 'owner',
        watch: true,
        enabled: Boolean(verifiedTokenAddress),
    });

    const isOwner = address && tokenOwner && address.toLowerCase() === tokenOwner.toLowerCase();

    // Contract write function for taking new snapshots
    const { write: takeSnapshot, data: snapshotData } = useContractWrite({
        address: verifiedTokenAddress || undefined,
        abi: MemeTokenABI.abi,
        functionName: 'snapshot',
        enabled: Boolean(verifiedTokenAddress),
        onError() {
            setIsWaitingForWallet(false);
        }
    });

    // Wait for snapshot transaction
    const { isLoading: isSnapshotPending } = useWaitForTransaction({
        hash: snapshotData?.hash,
        onSuccess() {
            // First show success toast
            toast.success('Snapshot taken successfully!', toastOptions);
            // Then show refresh instructions
            setTimeout(() => {
                toast((t) => (
                    <div className="flex flex-col gap-2">
                        <p className="font-medium">Important: Refresh Required 🔄</p>
                        <p className="text-sm">Please refresh the page and paste the contract address again to see the new snapshot data.</p>
                    </div>
                ), {
                    ...toastOptions,
                    duration: 6000,
                    style: {
                        ...toastOptions.style,
                        maxWidth: '400px',
                    }
                });
            }, 1000); // Wait 1 second before showing the second toast
            setIsWaitingForWallet(false);
            fetchSnapshots(); // Refresh snapshots list
        },
        onError() {
            toast.error('Failed to take snapshot', toastOptions);
            setIsWaitingForWallet(false);
        },
    });

    // Verify token address and setup contract
    const verifyTokenAddress = async () => {
        if (!inputTokenAddress) {
            toast.error('Please enter a token address', toastOptions);
            return;
        }

        setVerifying(true);
        setError('');

        try {
            // Check if address is valid
            const isValidAddress = ethers.isAddress(inputTokenAddress);
            if (!isValidAddress) {
                throw new Error('Invalid token address format');
            }

            // Create contract instance
            const provider = new ethers.BrowserProvider(window.ethereum);
            const contract = new ethers.Contract(inputTokenAddress, MemeTokenABI.abi, provider);

            // Try to call basic functions to verify it's a valid token contract
            await Promise.all([
                contract.name(),
                contract.symbol(),
                contract.owner()
            ]);

            setVerifiedTokenAddress(inputTokenAddress);
            setTokenContract(contract);
            toast.success('Token contract verified', toastOptions);
        } catch (err) {
            console.error('Error verifying token:', err);
            setError('Invalid token contract. Please check the address and try again.');
            setVerifiedTokenAddress('');
            setTokenContract(null);
        } finally {
            setVerifying(false);
        }
    };

    // Listen for Snapshot events
    useEffect(() => {
        const fetchSnapshots = async () => {
            try {
                setLoading(true);
                // Get past Snapshot events
                const filter = tokenContract.filters.Snapshot();
                const events = await tokenContract.queryFilter(filter);
                
                // Map snapshot data without block timestamps initially
                const snapshotData = events.map(event => ({
                    id: event.args.id.toString(),
                    blockNumber: event.blockNumber,
                    timestamp: new Date().toLocaleString() // Default to current time
                }));
                
                // Try to get timestamps, but don't fail if we can't
                try {
                    const provider = new ethers.BrowserProvider(window.ethereum);
                    const updatedSnapshotData = await Promise.all(
                        snapshotData.map(async (snapshot) => {
                            try {
                                const block = await provider.getBlock(snapshot.blockNumber);
                                return {
                                    ...snapshot,
                                    timestamp: block ? new Date(block.timestamp * 1000).toLocaleString() : snapshot.timestamp
                                };
                            } catch (err) {
                                console.warn(`Could not fetch block data for snapshot ${snapshot.id}`, err);
                                return snapshot;
                            }
                        })
                    );
                    // Sort by block number descending
                    updatedSnapshotData.sort((a, b) => b.blockNumber - a.blockNumber);
                    setSnapshots(updatedSnapshotData);
                } catch (err) {
                    console.warn('Error fetching block timestamps:', err);
                    // Still set the snapshots even if we couldn't get timestamps
                    snapshotData.sort((a, b) => b.blockNumber - a.blockNumber);
                    setSnapshots(snapshotData);
                }
                
                setLoading(false);
            } catch (err) {
                console.error('Error fetching snapshots:', err);
                setError('Failed to load snapshots');
                setLoading(false);
            }
        };

        if (tokenContract) {
            fetchSnapshots();
        }
    }, [tokenContract]);

    // Function to fetch holder data for a specific snapshot
    const fetchHolderData = async (snapshotId) => {
        setLoading(true);
        setError('');
        try {
            // Get all Transfer events up to this snapshot
            const filter = tokenContract.filters.Transfer();
            const events = await tokenContract.queryFilter(filter);
            
            // Get unique addresses
            const holders = new Set();
            events.forEach(event => {
                holders.add(event.args.from);
                holders.add(event.args.to);
            });
            
            // Remove zero and dead addresses
            holders.delete('0x0000000000000000000000000000000000000000');
            holders.delete('0x000000000000000000000000000000000000dEaD');

            // Get balances for all holders at this snapshot
            const holderBalances = await Promise.all(
                Array.from(holders).map(async (holder) => {
                    const balance = await tokenContract.balanceOfAt(holder, snapshotId);
                    return {
                        address: holder,
                        balance: ethers.formatEther(balance)
                    };
                })
            );

            // Filter out zero balances and sort by balance
            const activeHolders = holderBalances
                .filter(holder => parseFloat(holder.balance) > 0)
                .sort((a, b) => parseFloat(b.balance) - parseFloat(a.balance));

            setHolderData(activeHolders);
        } catch (err) {
            console.error('Error fetching holder data:', err);
            setError('Failed to load holder data');
        }
        setLoading(false);
    };

    // Function to export holder data to CSV
    const exportToCSV = () => {
        if (!holderData.length) return;

        const csvContent = "data:text/csv;charset=utf-8," 
            + "Address,Balance\n"
            + holderData.map(row => `${row.address},${row.balance}`).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `snapshot_${selectedSnapshot}_${Date.now()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Function to handle snapshot button click
    const handleTakeSnapshot = async () => {
        try {
            // Only proceed if the connected wallet is the owner
            if (!address) {
                toast.error('Please connect your wallet first', toastOptions);
                return;
            }
            
            if (!isOwner) {
                // Don't show a toast, just return silently since the button shouldn't be visible anyway
                return;
            }

            setIsWaitingForWallet(true);
            if (takeSnapshot) {
                await takeSnapshot();
            }
        } catch (err) {
            console.error('Error taking snapshot:', err);
            setIsWaitingForWallet(false);
        }
    };

    // Function to handle snapshot selection
    const handleSelectSnapshot = (snapshot) => {
        setSelectedSnapshot(snapshot.id);
        fetchHolderData(snapshot.id);
    };

    return (
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg relative">
            <Toaster
                position="top-center"
                toastOptions={{
                    className: '',
                    style: {
                        zIndex: 9999999,
                        background: '#333',
                        color: 'white',
                    },
                }}
            />
            <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-3 mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Token Snapshots
                </h2>
                <button 
                    onClick={onClose}
                    className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-800 text-white transition-colors"
                >
                    <BiX className="w-5 h-5" />
                </button>
            </div>

            {/* Token Address Input Section */}
            <div className="mb-6">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={inputTokenAddress}
                        onChange={(e) => setInputTokenAddress(e.target.value)}
                        placeholder="Enter token contract address"
                        disabled={verifying}
                        className="flex-1 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg px-3 py-2 border border-gray-200 dark:border-gray-700 focus:border-[#00ffbd] focus:ring-2 focus:ring-[#00ffbd]/20 focus:outline-none transition-all duration-200"
                    />
                    <Button
                        onClick={verifyTokenAddress}
                        disabled={verifying || !inputTokenAddress}
                        className="bg-[#00ffbd] hover:bg-[#00e6a9] text-black font-medium px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
                    >
                        {verifying ? (
                            <Spinner size="sm" />
                        ) : (
                            <BiSearch className="w-4 h-4" />
                        )}
                        {verifying ? 'Verifying...' : 'Verify'}
                    </Button>
                </div>
                {error && (
                    <p className="mt-2 text-sm text-red-500 dark:text-red-400">
                        {error}
                    </p>
                )}
            </div>

            {verifiedTokenAddress && (
                <>
                    {/* Snapshot Control Section */}
                    <div className="mb-4">
                        <div className="flex justify-between items-center">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                {snapshots.length > 0 ? `${snapshots.length} snapshot${snapshots.length === 1 ? '' : 's'} available` : 'No snapshots taken yet'}
                            </div>
                            {isOwner && address && (
                                <Button
                                    onClick={handleTakeSnapshot}
                                    disabled={isSnapshotPending || isWaitingForWallet}
                                    className="bg-[#00ffbd] hover:bg-[#00e6a9] text-black font-medium px-3 py-1.5 rounded-lg transition-colors duration-200 flex items-center text-sm"
                                >
                                    {isSnapshotPending || isWaitingForWallet ? (
                                        <>
                                            <Spinner size="sm" className="mr-2" />
                                            {isWaitingForWallet ? 'Confirm in Wallet...' : 'Taking Snapshot...'}
                                        </>
                                    ) : (
                                        <>
                                            <HiOutlineCamera className="mr-1.5 h-4 w-4" />
                                            Take Snapshot
                                        </>
                                    )}
                                </Button>
                            )}
                        </div>
                        {/* Add info message about refreshing */}
                        {snapshots.length > 0 && (
                            <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg">
                                <p className="text-sm text-blue-600 dark:text-blue-400">
                                    <span className="font-medium">Note:</span> After taking a new snapshot, please refresh the page and paste the contract address again to see the updated data.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Rest of the existing UI (grid with snapshots and holder data) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Snapshots List */}
                        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 shadow-sm">
                            <h3 className="text-base font-medium mb-3 text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                                Available Snapshots
                            </h3>
                            <div className="space-y-2 custom-scrollbar max-h-[300px] overflow-y-auto pr-2">
                                {loading ? (
                                    <div className="flex justify-center py-4">
                                        <Spinner size="md" className="text-[#00ffbd]" />
                                    </div>
                                ) : snapshots.length === 0 ? (
                                    <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                                        No snapshots available
                                    </p>
                                ) : (
                                    snapshots.map((snapshot) => (
                                        <button
                                            key={snapshot.id}
                                            onClick={() => handleSelectSnapshot(snapshot)}
                                            className={`w-full text-left px-3 py-2 rounded-lg transition-colors duration-200 flex justify-between items-center text-sm ${
                                                selectedSnapshot === snapshot.id 
                                                ? 'bg-[#00ffbd] hover:bg-[#00e6a9] text-black' 
                                                : 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white'
                                            }`}
                                        >
                                            <span className="font-medium">Snapshot #{snapshot.id}</span>
                                            <span className="text-xs opacity-70">{snapshot.timestamp}</span>
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Holder Data */}
                        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 shadow-sm">
                            <div className="flex justify-between items-center mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">
                                <h3 className="text-base font-medium text-gray-900 dark:text-white">
                                    {selectedSnapshot ? `Snapshot #${selectedSnapshot} Data` : 'Select a snapshot'}
                                </h3>
                                {holderData.length > 0 && (
                                    <Button
                                        onClick={exportToCSV}
                                        size="xs"
                                        className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white transition-colors duration-200 px-2 py-1"
                                    >
                                        <HiOutlineDownload className="mr-1 h-3 w-3" />
                                        Export
                                    </Button>
                                )}
                            </div>

                            {loading ? (
                                <div className="flex justify-center items-center h-[250px]">
                                    <Spinner size="md" className="text-[#00ffbd]" />
                                </div>
                            ) : (
                                <div className="overflow-x-auto custom-scrollbar rounded-lg border border-gray-200 dark:border-gray-700">
                                    <Table className="w-full text-sm">
                                        <Table.Head>
                                            <Table.HeadCell className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-medium py-2 px-3">
                                                Address
                                            </Table.HeadCell>
                                            <Table.HeadCell className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-medium py-2 px-3">
                                                Balance
                                            </Table.HeadCell>
                                        </Table.Head>
                                        <Table.Body className="divide-y divide-gray-200 dark:divide-gray-700">
                                            {holderData.map((holder, index) => (
                                                <Table.Row 
                                                    key={index} 
                                                    className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150"
                                                >
                                                    <Table.Cell className="font-mono text-gray-900 dark:text-gray-300 py-2 px-3 text-xs">
                                                        {holder.address.slice(0, 6)}...{holder.address.slice(-4)}
                                                    </Table.Cell>
                                                    <Table.Cell className="text-gray-900 dark:text-gray-300 font-medium py-2 px-3 text-xs">
                                                        {parseFloat(holder.balance).toLocaleString()} tokens
                                                    </Table.Cell>
                                                </Table.Row>
                                            ))}
                                        </Table.Body>
                                    </Table>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default SnapshotViewer; 
import{r,R as e,a as h4,b as W4}from"./vendor-r-C9Te4mx-.js";import{c as Q4,a as V4,b as R4,d as l0}from"./vendor-vanilla-extract-DLxAaWrr.js";import{W as Z0,u as J,a as eu,b as O0,c as G4,d as f4,e as Y0,f as Ru,g as P4,h as J4,i as H4,j as X4,I as pu,M as _4,C as q4}from"./web3-wagmi-BvzjG269.js";import{r as K4}from"./vendor-i-QmFmXgsK.js";import{u as $4}from"./vendor-u-C_I5LO-p.js";import{b as u3}from"./vendor-q-DQjQg5mj.js";import{m as e3,U as E3}from"./web3-viem-CeBRBLCK.js";const n3="modulepreload",t3=function(u){return"/"+u},o0={},x=function(E,n,i){let a=Promise.resolve();if(n&&n.length>0){document.getElementsByTagName("link");const o=document.querySelector("meta[property=csp-nonce]"),C=o?.nonce||o?.getAttribute("nonce");a=Promise.allSettled(n.map(M=>{if(M=t3(M),M in o0)return;o0[M]=!0;const c=M.endsWith(".css"),d=c?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${M}"]${d}`))return;const D=document.createElement("link");if(D.rel=c?"stylesheet":n3,c||(D.as="script"),D.crossOrigin="",D.href=M,C&&D.setAttribute("nonce",C),document.head.appendChild(D),c)return new Promise((L,s)=>{D.addEventListener("load",L),D.addEventListener("error",()=>s(new Error(`Unable to preload CSS for ${M}`)))})}))}function l(o){const C=new Event("vite:preloadError",{cancelable:!0});if(C.payload=o,window.dispatchEvent(C),!C.defaultPrevented)throw o}return a.then(o=>{for(const C of o||[])C.status==="rejected"&&l(C.reason);return E().catch(l)})};var C0='-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',i3={rounded:`SFRounded, ui-rounded, "SF Pro Rounded", ${C0}`,system:C0},lu={large:{actionButton:"9999px",connectButton:"12px",modal:"24px",modalMobile:"28px"},medium:{actionButton:"10px",connectButton:"8px",modal:"16px",modalMobile:"18px"},none:{actionButton:"0px",connectButton:"0px",modal:"0px",modalMobile:"0px"},small:{actionButton:"4px",connectButton:"4px",modal:"8px",modalMobile:"8px"}},a3={large:{modalOverlay:"blur(20px)"},none:{modalOverlay:"blur(0px)"},small:{modalOverlay:"blur(4px)"}},v0=({borderRadius:u="large",fontStack:E="rounded",overlayBlur:n="none"})=>({blurs:{modalOverlay:a3[n].modalOverlay},fonts:{body:i3[E]},radii:{actionButton:lu[u].actionButton,connectButton:lu[u].connectButton,menuButton:lu[u].connectButton,modal:lu[u].modal,modalMobile:lu[u].modalMobile}}),h0={blue:{accentColor:"#0E76FD",accentColorForeground:"#FFF"},green:{accentColor:"#1DB847",accentColorForeground:"#FFF"},orange:{accentColor:"#FF801F",accentColorForeground:"#FFF"},pink:{accentColor:"#FF5CA0",accentColorForeground:"#FFF"},purple:{accentColor:"#5F5AFA",accentColorForeground:"#FFF"},red:{accentColor:"#FA423C",accentColorForeground:"#FFF"}},M0=h0.blue,W0=({accentColor:u=M0.accentColor,accentColorForeground:E=M0.accentColorForeground,...n}={})=>({...v0(n),colors:{accentColor:u,accentColorForeground:E,actionButtonBorder:"rgba(0, 0, 0, 0.04)",actionButtonBorderMobile:"rgba(0, 0, 0, 0.06)",actionButtonSecondaryBackground:"rgba(0, 0, 0, 0.06)",closeButton:"rgba(60, 66, 66, 0.8)",closeButtonBackground:"rgba(0, 0, 0, 0.06)",connectButtonBackground:"#FFF",connectButtonBackgroundError:"#FF494A",connectButtonInnerBackground:"linear-gradient(0deg, rgba(0, 0, 0, 0.03), rgba(0, 0, 0, 0.06))",connectButtonText:"#25292E",connectButtonTextError:"#FFF",connectionIndicator:"#30E000",downloadBottomCardBackground:"linear-gradient(126deg, rgba(255, 255, 255, 0) 9.49%, rgba(171, 171, 171, 0.04) 71.04%), #FFFFFF",downloadTopCardBackground:"linear-gradient(126deg, rgba(171, 171, 171, 0.2) 9.49%, rgba(255, 255, 255, 0) 71.04%), #FFFFFF",error:"#FF494A",generalBorder:"rgba(0, 0, 0, 0.06)",generalBorderDim:"rgba(0, 0, 0, 0.03)",menuItemBackground:"rgba(60, 66, 66, 0.1)",modalBackdrop:"rgba(0, 0, 0, 0.3)",modalBackground:"#FFF",modalBorder:"transparent",modalText:"#25292E",modalTextDim:"rgba(60, 66, 66, 0.3)",modalTextSecondary:"rgba(60, 66, 66, 0.6)",profileAction:"#FFF",profileActionHover:"rgba(255, 255, 255, 0.5)",profileForeground:"rgba(60, 66, 66, 0.06)",selectedOptionBorder:"rgba(60, 66, 66, 0.1)",standby:"#FFD641"},shadows:{connectButton:"0px 4px 12px rgba(0, 0, 0, 0.1)",dialog:"0px 8px 32px rgba(0, 0, 0, 0.32)",profileDetailsAction:"0px 2px 6px rgba(37, 41, 46, 0.04)",selectedOption:"0px 2px 6px rgba(0, 0, 0, 0.24)",selectedWallet:"0px 2px 6px rgba(0, 0, 0, 0.12)",walletLogo:"0px 2px 16px rgba(0, 0, 0, 0.16)"}});W0.accentColors=h0;var Nu="#1A1B1F",Q0={blue:{accentColor:"#3898FF",accentColorForeground:"#FFF"},green:{accentColor:"#4BD166",accentColorForeground:Nu},orange:{accentColor:"#FF983D",accentColorForeground:Nu},pink:{accentColor:"#FF7AB8",accentColorForeground:Nu},purple:{accentColor:"#7A70FF",accentColorForeground:"#FFF"},red:{accentColor:"#FF6257",accentColorForeground:"#FFF"}},r0=Q0.blue,l3=({accentColor:u=r0.accentColor,accentColorForeground:E=r0.accentColorForeground,...n}={})=>({...v0(n),colors:{accentColor:u,accentColorForeground:E,actionButtonBorder:"rgba(255, 255, 255, 0.04)",actionButtonBorderMobile:"rgba(255, 255, 255, 0.08)",actionButtonSecondaryBackground:"rgba(255, 255, 255, 0.08)",closeButton:"rgba(224, 232, 255, 0.6)",closeButtonBackground:"rgba(255, 255, 255, 0.08)",connectButtonBackground:Nu,connectButtonBackgroundError:"#FF494A",connectButtonInnerBackground:"linear-gradient(0deg, rgba(255, 255, 255, 0.075), rgba(255, 255, 255, 0.15))",connectButtonText:"#FFF",connectButtonTextError:"#FFF",connectionIndicator:"#30E000",downloadBottomCardBackground:"linear-gradient(126deg, rgba(0, 0, 0, 0) 9.49%, rgba(120, 120, 120, 0.2) 71.04%), #1A1B1F",downloadTopCardBackground:"linear-gradient(126deg, rgba(120, 120, 120, 0.2) 9.49%, rgba(0, 0, 0, 0) 71.04%), #1A1B1F",error:"#FF494A",generalBorder:"rgba(255, 255, 255, 0.08)",generalBorderDim:"rgba(255, 255, 255, 0.04)",menuItemBackground:"rgba(224, 232, 255, 0.1)",modalBackdrop:"rgba(0, 0, 0, 0.5)",modalBackground:"#1A1B1F",modalBorder:"rgba(255, 255, 255, 0.08)",modalText:"#FFF",modalTextDim:"rgba(224, 232, 255, 0.3)",modalTextSecondary:"rgba(255, 255, 255, 0.6)",profileAction:"rgba(224, 232, 255, 0.1)",profileActionHover:"rgba(224, 232, 255, 0.2)",profileForeground:"rgba(224, 232, 255, 0.05)",selectedOptionBorder:"rgba(224, 232, 255, 0.1)",standby:"#FFD641"},shadows:{connectButton:"0px 4px 12px rgba(0, 0, 0, 0.1)",dialog:"0px 8px 32px rgba(0, 0, 0, 0.32)",profileDetailsAction:"0px 2px 6px rgba(37, 41, 46, 0.04)",selectedOption:"0px 2px 6px rgba(0, 0, 0, 0.24)",selectedWallet:"0px 2px 6px rgba(0, 0, 0, 0.24)",walletLogo:"0px 2px 16px rgba(0, 0, 0, 0.16)"}});l3.accentColors=Q0;var hu=`{
  "connect_wallet": {
    "label": "Connect Wallet"
  },

  "intro": {
    "title": "What is a Wallet?",
    "description": "A wallet is used to send, receive, store, and display digital assets. It's also a new way to log in, without needing to create new accounts and passwords on every website.",
    "digital_asset": {
      "title": "A Home for your Digital Assets",
      "description": "Wallets are used to send, receive, store, and display digital assets like Ethereum and NFTs."
    },
    "login": {
      "title": "A New Way to Log In",
      "description": "Instead of creating new accounts and passwords on every website, just connect your wallet."
    },
    "get": {
      "label": "Get a Wallet"
    },
    "learn_more": {
      "label": "Learn More"
    }
  },

  "sign_in": {
    "label": "Verify your account",
    "description": "To finish connecting, you must sign a message in your wallet to verify that you are the owner of this account.",
    "message": {
      "send": "Sign message",
      "preparing": "Preparing message...",
      "cancel": "Cancel",
      "preparing_error": "Error preparing message, please retry!"
    },
    "signature": {
      "waiting": "Waiting for signature...",
      "verifying": "Verifying signature...",
      "signing_error": "Error signing message, please retry!",
      "verifying_error": "Error verifying signature, please retry!",
      "oops_error": "Oops, something went wrong!"
    }
  },

  "connect": {
    "label": "Connect",
    "title": "Connect a Wallet",
    "new_to_ethereum": {
      "description": "New to Ethereum wallets?",
      "learn_more": {
        "label": "Learn More"
      }
    },
    "learn_more": {
      "label": "Learn more"
    },
    "recent": "Recent",
    "status": {
      "opening": "Opening %{wallet}...",
      "connecting": "Connecting",
      "connect_mobile": "Continue in %{wallet}",
      "not_installed": "%{wallet} is not installed",
      "not_available": "%{wallet} is not available",
      "confirm": "Confirm connection in the extension",
      "confirm_mobile": "Accept connection request in the wallet"
    },
    "secondary_action": {
      "get": {
        "description": "Don't have %{wallet}?",
        "label": "GET"
      },
      "install": {
        "label": "INSTALL"
      },
      "retry": {
        "label": "RETRY"
      }
    },
    "walletconnect": {
      "description": {
        "full": "Need the official WalletConnect modal?",
        "compact": "Need the WalletConnect modal?"
      },
      "open": {
        "label": "OPEN"
      }
    }
  },

  "connect_scan": {
    "title": "Scan with %{wallet}",
    "fallback_title": "Scan with your phone"
  },

  "connector_group": {
    "recommended": "Recommended",
    "other": "Other",
    "popular": "Popular",
    "more": "More",
    "others": "Others"
  },

  "get": {
    "title": "Get a Wallet",
    "action": {
      "label": "GET"
    },
    "mobile": {
      "description": "Mobile Wallet"
    },
    "extension": {
      "description": "Browser Extension"
    },
    "mobile_and_extension": {
      "description": "Mobile Wallet and Extension"
    },
    "mobile_and_desktop": {
      "description": "Mobile and Desktop Wallet"
    },
    "looking_for": {
      "title": "Not what you're looking for?",
      "mobile": {
        "description": "Select a wallet on the main screen to get started with a different wallet provider."
      },
      "desktop": {
        "compact_description": "Select a wallet on the main screen to get started with a different wallet provider.",
        "wide_description": "Select a wallet on the left to get started with a different wallet provider."
      }
    }
  },

  "get_options": {
    "title": "Get started with %{wallet}",
    "short_title": "Get %{wallet}",
    "mobile": {
      "title": "%{wallet} for Mobile",
      "description": "Use the mobile wallet to explore the world of Ethereum.",
      "download": {
        "label": "Get the app"
      }
    },
    "extension": {
      "title": "%{wallet} for %{browser}",
      "description": "Access your wallet right from your favorite web browser.",
      "download": {
        "label": "Add to %{browser}"
      }
    },
    "desktop": {
      "title": "%{wallet} for %{platform}",
      "description": "Access your wallet natively from your powerful desktop.",
      "download": {
        "label": "Add to %{platform}"
      }
    }
  },

  "get_mobile": {
    "title": "Install %{wallet}",
    "description": "Scan with your phone to download on iOS or Android",
    "continue": {
      "label": "Continue"
    }
  },

  "get_instructions": {
    "mobile": {
      "connect": {
        "label": "Connect"
      },
      "learn_more": {
        "label": "Learn More"
      }
    },
    "extension": {
      "refresh": {
        "label": "Refresh"
      },
      "learn_more": {
        "label": "Learn More"
      }
    },
    "desktop": {
      "connect": {
        "label": "Connect"
      },
      "learn_more": {
        "label": "Learn More"
      }
    }
  },

  "chains": {
    "title": "Switch Networks",
    "wrong_network": "Wrong network detected, switch or disconnect to continue.",
    "confirm": "Confirm in Wallet",
    "switching_not_supported": "Your wallet does not support switching networks from %{appName}. Try switching networks from within your wallet instead.",
    "switching_not_supported_fallback": "Your wallet does not support switching networks from this app. Try switching networks from within your wallet instead.",
    "disconnect": "Disconnect",
    "connected": "Connected"
  },

  "profile": {
    "disconnect": {
      "label": "Disconnect"
    },
    "copy_address": {
      "label": "Copy Address",
      "copied": "Copied!"
    },
    "explorer": {
      "label": "View more on explorer"
    },
    "transactions": {
      "description": "%{appName} transactions will appear here...",
      "description_fallback": "Your transactions will appear here...",
      "recent": {
        "title": "Recent Transactions"
      },
      "clear": {
        "label": "Clear All"
      }
    }
  },

  "wallet_connectors": {
    "argent": {
      "qr_code": {
        "step1": {
          "description": "Put Argent on your home screen for faster access to your wallet.",
          "title": "Open the Argent app"
        },
        "step2": {
          "description": "Create a wallet and username, or import an existing wallet.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "After you scan, a connection prompt will appear for you to connect your wallet.",
          "title": "Tap the Scan QR button"
        }
      }
    },

    "bifrost": {
      "qr_code": {
        "step1": {
          "description": "We recommend putting Bifrost Wallet on your home screen for quicker access.",
          "title": "Open the Bifrost Wallet app"
        },
        "step2": {
          "description": "Create or import a wallet using your recovery phrase.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "After you scan, a connection prompt will appear for you to connect your wallet.",
          "title": "Tap the scan button"
        }
      }
    },

    "bitget": {
      "qr_code": {
        "step1": {
          "description": "We recommend putting Bitget Wallet on your home screen for quicker access.",
          "title": "Open the Bitget Wallet app"
        },
        "step2": {
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "After you scan, a connection prompt will appear for you to connect your wallet.",
          "title": "Tap the scan button"
        }
      },

      "extension": {
        "step1": {
          "description": "We recommend pinning Bitget Wallet to your taskbar for quicker access to your wallet.",
          "title": "Install the Bitget Wallet extension"
        },
        "step2": {
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension.",
          "title": "Refresh your browser"
        }
      }
    },

    "bitski": {
      "extension": {
        "step1": {
          "description": "We recommend pinning Bitski to your taskbar for quicker access to your wallet.",
          "title": "Install the Bitski extension"
        },
        "step2": {
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension.",
          "title": "Refresh your browser"
        }
      }
    },

    "coin98": {
      "qr_code": {
        "step1": {
          "description": "We recommend putting Coin98 Wallet on your home screen for faster access to your wallet.",
          "title": "Open the Coin98 Wallet app"
        },
        "step2": {
          "description": "You can easily backup your wallet using our backup feature on your phone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "After you scan, a connection prompt will appear for you to connect your wallet.",
          "title": "Tap the WalletConnect button"
        }
      },

      "extension": {
        "step1": {
          "description": "Click at the top right of your browser and pin Coin98 Wallet for easy access.",
          "title": "Install the Coin98 Wallet extension"
        },
        "step2": {
          "description": "Create a new wallet or import an existing one.",
          "title": "Create or Import a wallet"
        },
        "step3": {
          "description": "Once you set up Coin98 Wallet, click below to refresh the browser and load up the extension.",
          "title": "Refresh your browser"
        }
      }
    },

    "coinbase": {
      "qr_code": {
        "step1": {
          "description": "We recommend putting Coinbase Wallet on your home screen for quicker access.",
          "title": "Open the Coinbase Wallet app"
        },
        "step2": {
          "description": "You can easily backup your wallet using the cloud backup feature.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "After you scan, a connection prompt will appear for you to connect your wallet.",
          "title": "Tap the scan button"
        }
      },

      "extension": {
        "step1": {
          "description": "We recommend pinning Coinbase Wallet to your taskbar for quicker access to your wallet.",
          "title": "Install the Coinbase Wallet extension"
        },
        "step2": {
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension.",
          "title": "Refresh your browser"
        }
      }
    },

    "core": {
      "qr_code": {
        "step1": {
          "description": "We recommend putting Core on your home screen for faster access to your wallet.",
          "title": "Open the Core app"
        },
        "step2": {
          "description": "You can easily backup your wallet using our backup feature on your phone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "After you scan, a connection prompt will appear for you to connect your wallet.",
          "title": "Tap the WalletConnect button"
        }
      },

      "extension": {
        "step1": {
          "description": "We recommend pinning Core to your taskbar for quicker access to your wallet.",
          "title": "Install the Core extension"
        },
        "step2": {
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension.",
          "title": "Refresh your browser"
        }
      }
    },

    "fox": {
      "qr_code": {
        "step1": {
          "description": "We recommend putting FoxWallet on your home screen for quicker access.",
          "title": "Open the FoxWallet app"
        },
        "step2": {
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "After you scan, a connection prompt will appear for you to connect your wallet.",
          "title": "Tap the scan button"
        }
      }
    },

    "frontier": {
      "qr_code": {
        "step1": {
          "description": "We recommend putting Frontier Wallet on your home screen for quicker access.",
          "title": "Open the Frontier Wallet app"
        },
        "step2": {
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "After you scan, a connection prompt will appear for you to connect your wallet.",
          "title": "Tap the scan button"
        }
      },

      "extension": {
        "step1": {
          "description": "We recommend pinning Frontier Wallet to your taskbar for quicker access to your wallet.",
          "title": "Install the Frontier Wallet extension"
        },
        "step2": {
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension.",
          "title": "Refresh your browser"
        }
      }
    },

    "im_token": {
      "qr_code": {
        "step1": {
          "title": "Open the imToken app",
          "description": "Put imToken app on your home screen for faster access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Tap Scanner Icon in top right corner",
          "description": "Choose New Connection, then scan the QR code and confirm the prompt to connect."
        }
      }
    },

    "metamask": {
      "qr_code": {
        "step1": {
          "title": "Open the MetaMask app",
          "description": "We recommend putting MetaMask on your home screen for quicker access."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Tap the scan button",
          "description": "After you scan, a connection prompt will appear for you to connect your wallet."
        }
      },

      "extension": {
        "step1": {
          "title": "Install the MetaMask extension",
          "description": "We recommend pinning MetaMask to your taskbar for quicker access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "okx": {
      "qr_code": {
        "step1": {
          "title": "Open the OKX Wallet app",
          "description": "We recommend putting OKX Wallet on your home screen for quicker access."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Tap the scan button",
          "description": "After you scan, a connection prompt will appear for you to connect your wallet."
        }
      },

      "extension": {
        "step1": {
          "title": "Install the OKX Wallet extension",
          "description": "We recommend pinning OKX Wallet to your taskbar for quicker access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "omni": {
      "qr_code": {
        "step1": {
          "title": "Open the Omni app",
          "description": "Add Omni to your home screen for faster access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Tap the QR icon and scan",
          "description": "Tap the QR icon on your home screen, scan the code and confirm the prompt to connect."
        }
      }
    },

    "token_pocket": {
      "qr_code": {
        "step1": {
          "title": "Open the TokenPocket app",
          "description": "We recommend putting TokenPocket on your home screen for quicker access."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Tap the scan button",
          "description": "After you scan, a connection prompt will appear for you to connect your wallet."
        }
      },

      "extension": {
        "step1": {
          "title": "Install the TokenPocket extension",
          "description": "We recommend pinning TokenPocket to your taskbar for quicker access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "trust": {
      "qr_code": {
        "step1": {
          "title": "Open the Trust Wallet app",
          "description": "Put Trust Wallet on your home screen for faster access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Tap WalletConnect in Settings",
          "description": "Choose New Connection, then scan the QR code and confirm the prompt to connect."
        }
      },

      "extension": {
        "step1": {
          "title": "Install the Trust Wallet extension",
          "description": "Click at the top right of your browser and pin Trust Wallet for easy access."
        },
        "step2": {
          "title": "Create or Import a wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up Trust Wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "uniswap": {
      "qr_code": {
        "step1": {
          "title": "Open the Uniswap app",
          "description": "Add Uniswap Wallet to your home screen for faster access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Tap the QR icon and scan",
          "description": "Tap the QR icon on your homescreen, scan the code and confirm the prompt to connect."
        }
      }
    },

    "zerion": {
      "qr_code": {
        "step1": {
          "title": "Open the Zerion app",
          "description": "We recommend putting Zerion on your home screen for quicker access."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Tap the scan button",
          "description": "After you scan, a connection prompt will appear for you to connect your wallet."
        }
      },

      "extension": {
        "step1": {
          "title": "Install the Zerion extension",
          "description": "We recommend pinning Zerion to your taskbar for quicker access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "rainbow": {
      "qr_code": {
        "step1": {
          "title": "Open the Rainbow app",
          "description": "We recommend putting Rainbow on your home screen for faster access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "You can easily backup your wallet using our backup feature on your phone."
        },
        "step3": {
          "title": "Tap the scan button",
          "description": "After you scan, a connection prompt will appear for you to connect your wallet."
        }
      }
    },

    "enkrypt": {
      "extension": {
        "step1": {
          "description": "We recommend pinning Enkrypt Wallet to your taskbar for quicker access to your wallet.",
          "title": "Install the Enkrypt Wallet extension"
        },
        "step2": {
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension.",
          "title": "Refresh your browser"
        }
      }
    },

    "frame": {
      "extension": {
        "step1": {
          "description": "We recommend pinning Frame to your taskbar for quicker access to your wallet.",
          "title": "Install Frame & the companion extension"
        },
        "step2": {
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension.",
          "title": "Refresh your browser"
        }
      }
    },

    "one_key": {
      "extension": {
        "step1": {
          "title": "Install the OneKey Wallet extension",
          "description": "We recommend pinning OneKey Wallet to your taskbar for quicker access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "phantom": {
      "extension": {
        "step1": {
          "title": "Install the Phantom extension",
          "description": "We recommend pinning Phantom to your taskbar for easier access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret recovery phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "rabby": {
      "extension": {
        "step1": {
          "title": "Install the Rabby extension",
          "description": "We recommend pinning Rabby to your taskbar for quicker access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "safeheron": {
      "extension": {
        "step1": {
          "title": "Install the Core extension",
          "description": "We recommend pinning Safeheron to your taskbar for quicker access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "taho": {
      "extension": {
        "step1": {
          "title": "Install the Taho extension",
          "description": "We recommend pinning Taho to your taskbar for quicker access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "talisman": {
      "extension": {
        "step1": {
          "title": "Install the Talisman extension",
          "description": "We recommend pinning Talisman to your taskbar for quicker access to your wallet."
        },
        "step2": {
          "title": "Create or Import an Ethereum Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your recovery phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "xdefi": {
      "extension": {
        "step1": {
          "title": "Install the XDEFI Wallet extension",
          "description": "We recommend pinning XDEFI Wallet to your taskbar for quicker access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "zeal": {
      "extension": {
        "step1": {
          "title": "Install the Zeal extension",
          "description": "We recommend pinning Zeal to your taskbar for quicker access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "safepal": {
      "extension": {
        "step1": {
          "title": "Install the SafePal Wallet extension",
          "description": "Click at the top right of your browser and pin SafePal Wallet for easy access."
        },
        "step2": {
          "title": "Create or Import a wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up SafePal Wallet, click below to refresh the browser and load up the extension."
        }
      },
      "qr_code": {
        "step1": {
          "title": "Open the SafePal Wallet app",
          "description": "Put SafePal Wallet on your home screen for faster access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Tap WalletConnect in Settings",
          "description": "Choose New Connection, then scan the QR code and confirm the prompt to connect."
        }
      }
    },

    "desig": {
      "extension": {
        "step1": {
          "title": "Install the Desig extension",
          "description": "We recommend pinning Desig to your taskbar for easier access to your wallet."
        },
        "step2": {
          "title": "Create a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "subwallet": {
      "extension": {
        "step1": {
          "title": "Install the SubWallet extension",
          "description": "We recommend pinning SubWallet to your taskbar for quicker access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your recovery phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      },
      "qr_code": {
        "step1": {
          "title": "Open the SubWallet app",
          "description": "We recommend putting SubWallet on your home screen for quicker access."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Tap the scan button",
          "description": "After you scan, a connection prompt will appear for you to connect your wallet."
        }
      }
    },

    "clv": {
      "extension": {
        "step1": {
          "title": "Install the CLV Wallet extension",
          "description": "We recommend pinning CLV Wallet to your taskbar for quicker access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      },
      "qr_code": {
        "step1": {
          "title": "Open the CLV Wallet app",
          "description": "We recommend putting CLV Wallet on your home screen for quicker access."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Tap the scan button",
          "description": "After you scan, a connection prompt will appear for you to connect your wallet."
        }
      }
    },

    "okto": {
      "qr_code": {
        "step1": {
          "title": "Open the Okto app",
          "description": "Add Okto to your home screen for quick access"
        },
        "step2": {
          "title": "Create an MPC Wallet",
          "description": "Create an account and generate a wallet"
        },
        "step3": {
          "title": "Tap WalletConnect in Settings",
          "description": "Tap the Scan QR icon at the top right and confirm the prompt to connect."
        }
      }
    },

    "ledger": {
      "desktop": {
        "step1": {
          "title": "Open the Ledger Live app",
          "description": "We recommend putting Ledger Live on your home screen for quicker access."
        },
        "step2": {
          "title": "Set up your Ledger",
          "description": "Set up a new Ledger or connect to an existing one."
        },
        "step3": {
          "title": "Connect",
          "description": "A connection prompt will appear for you to connect your wallet."
        }
      },
      "qr_code": {
        "step1": {
          "title": "Open the Ledger Live app",
          "description": "We recommend putting Ledger Live on your home screen for quicker access."
        },
        "step2": {
          "title": "Set up your Ledger",
          "description": "You can either sync with the desktop app or connect your Ledger."
        },
        "step3": {
          "title": "Scan the code",
          "description": "Tap WalletConnect then Switch to Scanner. After you scan, a connection prompt will appear for you to connect your wallet."
        }
      }
    }
  }
}
`;function V0(u){var E,n,i="";if(typeof u=="string"||typeof u=="number")i+=u;else if(typeof u=="object")if(Array.isArray(u)){var a=u.length;for(E=0;E<a;E++)u[E]&&(n=V0(u[E]))&&(i&&(i+=" "),i+=n)}else for(n in u)u[n]&&(i&&(i+=" "),i+=n);return i}function R0(){for(var u,E,n=0,i="",a=arguments.length;n<a;n++)(u=arguments[n])&&(E=V0(u))&&(i&&(i+=" "),i+=E);return i}var o3=768,nu=Q4({conditions:{defaultCondition:"smallScreen",conditionNames:["smallScreen","largeScreen"],responsiveArray:void 0}}),G0=V4({conditions:{defaultCondition:"smallScreen",conditionNames:["smallScreen","largeScreen"],responsiveArray:void 0}}),Wu=R4({conditions:{defaultCondition:"base",conditionNames:["base","hover","active"],responsiveArray:void 0},styles:{background:{values:{accentColor:{conditions:{base:"ju367v9h",hover:"ju367v9i",active:"ju367v9j"},defaultClass:"ju367v9h"},accentColorForeground:{conditions:{base:"ju367v9k",hover:"ju367v9l",active:"ju367v9m"},defaultClass:"ju367v9k"},actionButtonBorder:{conditions:{base:"ju367v9n",hover:"ju367v9o",active:"ju367v9p"},defaultClass:"ju367v9n"},actionButtonBorderMobile:{conditions:{base:"ju367v9q",hover:"ju367v9r",active:"ju367v9s"},defaultClass:"ju367v9q"},actionButtonSecondaryBackground:{conditions:{base:"ju367v9t",hover:"ju367v9u",active:"ju367v9v"},defaultClass:"ju367v9t"},closeButton:{conditions:{base:"ju367v9w",hover:"ju367v9x",active:"ju367v9y"},defaultClass:"ju367v9w"},closeButtonBackground:{conditions:{base:"ju367v9z",hover:"ju367va0",active:"ju367va1"},defaultClass:"ju367v9z"},connectButtonBackground:{conditions:{base:"ju367va2",hover:"ju367va3",active:"ju367va4"},defaultClass:"ju367va2"},connectButtonBackgroundError:{conditions:{base:"ju367va5",hover:"ju367va6",active:"ju367va7"},defaultClass:"ju367va5"},connectButtonInnerBackground:{conditions:{base:"ju367va8",hover:"ju367va9",active:"ju367vaa"},defaultClass:"ju367va8"},connectButtonText:{conditions:{base:"ju367vab",hover:"ju367vac",active:"ju367vad"},defaultClass:"ju367vab"},connectButtonTextError:{conditions:{base:"ju367vae",hover:"ju367vaf",active:"ju367vag"},defaultClass:"ju367vae"},connectionIndicator:{conditions:{base:"ju367vah",hover:"ju367vai",active:"ju367vaj"},defaultClass:"ju367vah"},downloadBottomCardBackground:{conditions:{base:"ju367vak",hover:"ju367val",active:"ju367vam"},defaultClass:"ju367vak"},downloadTopCardBackground:{conditions:{base:"ju367van",hover:"ju367vao",active:"ju367vap"},defaultClass:"ju367van"},error:{conditions:{base:"ju367vaq",hover:"ju367var",active:"ju367vas"},defaultClass:"ju367vaq"},generalBorder:{conditions:{base:"ju367vat",hover:"ju367vau",active:"ju367vav"},defaultClass:"ju367vat"},generalBorderDim:{conditions:{base:"ju367vaw",hover:"ju367vax",active:"ju367vay"},defaultClass:"ju367vaw"},menuItemBackground:{conditions:{base:"ju367vaz",hover:"ju367vb0",active:"ju367vb1"},defaultClass:"ju367vaz"},modalBackdrop:{conditions:{base:"ju367vb2",hover:"ju367vb3",active:"ju367vb4"},defaultClass:"ju367vb2"},modalBackground:{conditions:{base:"ju367vb5",hover:"ju367vb6",active:"ju367vb7"},defaultClass:"ju367vb5"},modalBorder:{conditions:{base:"ju367vb8",hover:"ju367vb9",active:"ju367vba"},defaultClass:"ju367vb8"},modalText:{conditions:{base:"ju367vbb",hover:"ju367vbc",active:"ju367vbd"},defaultClass:"ju367vbb"},modalTextDim:{conditions:{base:"ju367vbe",hover:"ju367vbf",active:"ju367vbg"},defaultClass:"ju367vbe"},modalTextSecondary:{conditions:{base:"ju367vbh",hover:"ju367vbi",active:"ju367vbj"},defaultClass:"ju367vbh"},profileAction:{conditions:{base:"ju367vbk",hover:"ju367vbl",active:"ju367vbm"},defaultClass:"ju367vbk"},profileActionHover:{conditions:{base:"ju367vbn",hover:"ju367vbo",active:"ju367vbp"},defaultClass:"ju367vbn"},profileForeground:{conditions:{base:"ju367vbq",hover:"ju367vbr",active:"ju367vbs"},defaultClass:"ju367vbq"},selectedOptionBorder:{conditions:{base:"ju367vbt",hover:"ju367vbu",active:"ju367vbv"},defaultClass:"ju367vbt"},standby:{conditions:{base:"ju367vbw",hover:"ju367vbx",active:"ju367vby"},defaultClass:"ju367vbw"}}},borderColor:{values:{accentColor:{conditions:{base:"ju367vbz",hover:"ju367vc0",active:"ju367vc1"},defaultClass:"ju367vbz"},accentColorForeground:{conditions:{base:"ju367vc2",hover:"ju367vc3",active:"ju367vc4"},defaultClass:"ju367vc2"},actionButtonBorder:{conditions:{base:"ju367vc5",hover:"ju367vc6",active:"ju367vc7"},defaultClass:"ju367vc5"},actionButtonBorderMobile:{conditions:{base:"ju367vc8",hover:"ju367vc9",active:"ju367vca"},defaultClass:"ju367vc8"},actionButtonSecondaryBackground:{conditions:{base:"ju367vcb",hover:"ju367vcc",active:"ju367vcd"},defaultClass:"ju367vcb"},closeButton:{conditions:{base:"ju367vce",hover:"ju367vcf",active:"ju367vcg"},defaultClass:"ju367vce"},closeButtonBackground:{conditions:{base:"ju367vch",hover:"ju367vci",active:"ju367vcj"},defaultClass:"ju367vch"},connectButtonBackground:{conditions:{base:"ju367vck",hover:"ju367vcl",active:"ju367vcm"},defaultClass:"ju367vck"},connectButtonBackgroundError:{conditions:{base:"ju367vcn",hover:"ju367vco",active:"ju367vcp"},defaultClass:"ju367vcn"},connectButtonInnerBackground:{conditions:{base:"ju367vcq",hover:"ju367vcr",active:"ju367vcs"},defaultClass:"ju367vcq"},connectButtonText:{conditions:{base:"ju367vct",hover:"ju367vcu",active:"ju367vcv"},defaultClass:"ju367vct"},connectButtonTextError:{conditions:{base:"ju367vcw",hover:"ju367vcx",active:"ju367vcy"},defaultClass:"ju367vcw"},connectionIndicator:{conditions:{base:"ju367vcz",hover:"ju367vd0",active:"ju367vd1"},defaultClass:"ju367vcz"},downloadBottomCardBackground:{conditions:{base:"ju367vd2",hover:"ju367vd3",active:"ju367vd4"},defaultClass:"ju367vd2"},downloadTopCardBackground:{conditions:{base:"ju367vd5",hover:"ju367vd6",active:"ju367vd7"},defaultClass:"ju367vd5"},error:{conditions:{base:"ju367vd8",hover:"ju367vd9",active:"ju367vda"},defaultClass:"ju367vd8"},generalBorder:{conditions:{base:"ju367vdb",hover:"ju367vdc",active:"ju367vdd"},defaultClass:"ju367vdb"},generalBorderDim:{conditions:{base:"ju367vde",hover:"ju367vdf",active:"ju367vdg"},defaultClass:"ju367vde"},menuItemBackground:{conditions:{base:"ju367vdh",hover:"ju367vdi",active:"ju367vdj"},defaultClass:"ju367vdh"},modalBackdrop:{conditions:{base:"ju367vdk",hover:"ju367vdl",active:"ju367vdm"},defaultClass:"ju367vdk"},modalBackground:{conditions:{base:"ju367vdn",hover:"ju367vdo",active:"ju367vdp"},defaultClass:"ju367vdn"},modalBorder:{conditions:{base:"ju367vdq",hover:"ju367vdr",active:"ju367vds"},defaultClass:"ju367vdq"},modalText:{conditions:{base:"ju367vdt",hover:"ju367vdu",active:"ju367vdv"},defaultClass:"ju367vdt"},modalTextDim:{conditions:{base:"ju367vdw",hover:"ju367vdx",active:"ju367vdy"},defaultClass:"ju367vdw"},modalTextSecondary:{conditions:{base:"ju367vdz",hover:"ju367ve0",active:"ju367ve1"},defaultClass:"ju367vdz"},profileAction:{conditions:{base:"ju367ve2",hover:"ju367ve3",active:"ju367ve4"},defaultClass:"ju367ve2"},profileActionHover:{conditions:{base:"ju367ve5",hover:"ju367ve6",active:"ju367ve7"},defaultClass:"ju367ve5"},profileForeground:{conditions:{base:"ju367ve8",hover:"ju367ve9",active:"ju367vea"},defaultClass:"ju367ve8"},selectedOptionBorder:{conditions:{base:"ju367veb",hover:"ju367vec",active:"ju367ved"},defaultClass:"ju367veb"},standby:{conditions:{base:"ju367vee",hover:"ju367vef",active:"ju367veg"},defaultClass:"ju367vee"}}},boxShadow:{values:{connectButton:{conditions:{base:"ju367veh",hover:"ju367vei",active:"ju367vej"},defaultClass:"ju367veh"},dialog:{conditions:{base:"ju367vek",hover:"ju367vel",active:"ju367vem"},defaultClass:"ju367vek"},profileDetailsAction:{conditions:{base:"ju367ven",hover:"ju367veo",active:"ju367vep"},defaultClass:"ju367ven"},selectedOption:{conditions:{base:"ju367veq",hover:"ju367ver",active:"ju367ves"},defaultClass:"ju367veq"},selectedWallet:{conditions:{base:"ju367vet",hover:"ju367veu",active:"ju367vev"},defaultClass:"ju367vet"},walletLogo:{conditions:{base:"ju367vew",hover:"ju367vex",active:"ju367vey"},defaultClass:"ju367vew"}}},color:{values:{accentColor:{conditions:{base:"ju367vez",hover:"ju367vf0",active:"ju367vf1"},defaultClass:"ju367vez"},accentColorForeground:{conditions:{base:"ju367vf2",hover:"ju367vf3",active:"ju367vf4"},defaultClass:"ju367vf2"},actionButtonBorder:{conditions:{base:"ju367vf5",hover:"ju367vf6",active:"ju367vf7"},defaultClass:"ju367vf5"},actionButtonBorderMobile:{conditions:{base:"ju367vf8",hover:"ju367vf9",active:"ju367vfa"},defaultClass:"ju367vf8"},actionButtonSecondaryBackground:{conditions:{base:"ju367vfb",hover:"ju367vfc",active:"ju367vfd"},defaultClass:"ju367vfb"},closeButton:{conditions:{base:"ju367vfe",hover:"ju367vff",active:"ju367vfg"},defaultClass:"ju367vfe"},closeButtonBackground:{conditions:{base:"ju367vfh",hover:"ju367vfi",active:"ju367vfj"},defaultClass:"ju367vfh"},connectButtonBackground:{conditions:{base:"ju367vfk",hover:"ju367vfl",active:"ju367vfm"},defaultClass:"ju367vfk"},connectButtonBackgroundError:{conditions:{base:"ju367vfn",hover:"ju367vfo",active:"ju367vfp"},defaultClass:"ju367vfn"},connectButtonInnerBackground:{conditions:{base:"ju367vfq",hover:"ju367vfr",active:"ju367vfs"},defaultClass:"ju367vfq"},connectButtonText:{conditions:{base:"ju367vft",hover:"ju367vfu",active:"ju367vfv"},defaultClass:"ju367vft"},connectButtonTextError:{conditions:{base:"ju367vfw",hover:"ju367vfx",active:"ju367vfy"},defaultClass:"ju367vfw"},connectionIndicator:{conditions:{base:"ju367vfz",hover:"ju367vg0",active:"ju367vg1"},defaultClass:"ju367vfz"},downloadBottomCardBackground:{conditions:{base:"ju367vg2",hover:"ju367vg3",active:"ju367vg4"},defaultClass:"ju367vg2"},downloadTopCardBackground:{conditions:{base:"ju367vg5",hover:"ju367vg6",active:"ju367vg7"},defaultClass:"ju367vg5"},error:{conditions:{base:"ju367vg8",hover:"ju367vg9",active:"ju367vga"},defaultClass:"ju367vg8"},generalBorder:{conditions:{base:"ju367vgb",hover:"ju367vgc",active:"ju367vgd"},defaultClass:"ju367vgb"},generalBorderDim:{conditions:{base:"ju367vge",hover:"ju367vgf",active:"ju367vgg"},defaultClass:"ju367vge"},menuItemBackground:{conditions:{base:"ju367vgh",hover:"ju367vgi",active:"ju367vgj"},defaultClass:"ju367vgh"},modalBackdrop:{conditions:{base:"ju367vgk",hover:"ju367vgl",active:"ju367vgm"},defaultClass:"ju367vgk"},modalBackground:{conditions:{base:"ju367vgn",hover:"ju367vgo",active:"ju367vgp"},defaultClass:"ju367vgn"},modalBorder:{conditions:{base:"ju367vgq",hover:"ju367vgr",active:"ju367vgs"},defaultClass:"ju367vgq"},modalText:{conditions:{base:"ju367vgt",hover:"ju367vgu",active:"ju367vgv"},defaultClass:"ju367vgt"},modalTextDim:{conditions:{base:"ju367vgw",hover:"ju367vgx",active:"ju367vgy"},defaultClass:"ju367vgw"},modalTextSecondary:{conditions:{base:"ju367vgz",hover:"ju367vh0",active:"ju367vh1"},defaultClass:"ju367vgz"},profileAction:{conditions:{base:"ju367vh2",hover:"ju367vh3",active:"ju367vh4"},defaultClass:"ju367vh2"},profileActionHover:{conditions:{base:"ju367vh5",hover:"ju367vh6",active:"ju367vh7"},defaultClass:"ju367vh5"},profileForeground:{conditions:{base:"ju367vh8",hover:"ju367vh9",active:"ju367vha"},defaultClass:"ju367vh8"},selectedOptionBorder:{conditions:{base:"ju367vhb",hover:"ju367vhc",active:"ju367vhd"},defaultClass:"ju367vhb"},standby:{conditions:{base:"ju367vhe",hover:"ju367vhf",active:"ju367vhg"},defaultClass:"ju367vhe"}}}}},{conditions:{defaultCondition:"smallScreen",conditionNames:["smallScreen","largeScreen"],responsiveArray:void 0},styles:{alignItems:{values:{"flex-start":{conditions:{smallScreen:"ju367v0",largeScreen:"ju367v1"},defaultClass:"ju367v0"},"flex-end":{conditions:{smallScreen:"ju367v2",largeScreen:"ju367v3"},defaultClass:"ju367v2"},center:{conditions:{smallScreen:"ju367v4",largeScreen:"ju367v5"},defaultClass:"ju367v4"}}},display:{values:{none:{conditions:{smallScreen:"ju367v6",largeScreen:"ju367v7"},defaultClass:"ju367v6"},block:{conditions:{smallScreen:"ju367v8",largeScreen:"ju367v9"},defaultClass:"ju367v8"},flex:{conditions:{smallScreen:"ju367va",largeScreen:"ju367vb"},defaultClass:"ju367va"},inline:{conditions:{smallScreen:"ju367vc",largeScreen:"ju367vd"},defaultClass:"ju367vc"}}}}},{conditions:void 0,styles:{margin:{mappings:["marginTop","marginBottom","marginLeft","marginRight"]},marginX:{mappings:["marginLeft","marginRight"]},marginY:{mappings:["marginTop","marginBottom"]},padding:{mappings:["paddingTop","paddingBottom","paddingLeft","paddingRight"]},paddingX:{mappings:["paddingLeft","paddingRight"]},paddingY:{mappings:["paddingTop","paddingBottom"]},alignSelf:{values:{"flex-start":{defaultClass:"ju367ve"},"flex-end":{defaultClass:"ju367vf"},center:{defaultClass:"ju367vg"}}},backgroundSize:{values:{cover:{defaultClass:"ju367vh"}}},borderRadius:{values:{1:{defaultClass:"ju367vi"},6:{defaultClass:"ju367vj"},10:{defaultClass:"ju367vk"},13:{defaultClass:"ju367vl"},actionButton:{defaultClass:"ju367vm"},connectButton:{defaultClass:"ju367vn"},menuButton:{defaultClass:"ju367vo"},modal:{defaultClass:"ju367vp"},modalMobile:{defaultClass:"ju367vq"},"25%":{defaultClass:"ju367vr"},full:{defaultClass:"ju367vs"}}},borderStyle:{values:{solid:{defaultClass:"ju367vt"}}},borderWidth:{values:{0:{defaultClass:"ju367vu"},1:{defaultClass:"ju367vv"},2:{defaultClass:"ju367vw"},4:{defaultClass:"ju367vx"}}},cursor:{values:{pointer:{defaultClass:"ju367vy"},none:{defaultClass:"ju367vz"}}},pointerEvents:{values:{none:{defaultClass:"ju367v10"},all:{defaultClass:"ju367v11"}}},minHeight:{values:{8:{defaultClass:"ju367v12"},44:{defaultClass:"ju367v13"}}},flexDirection:{values:{row:{defaultClass:"ju367v14"},column:{defaultClass:"ju367v15"}}},fontFamily:{values:{body:{defaultClass:"ju367v16"}}},fontSize:{values:{12:{defaultClass:"ju367v17"},13:{defaultClass:"ju367v18"},14:{defaultClass:"ju367v19"},16:{defaultClass:"ju367v1a"},18:{defaultClass:"ju367v1b"},20:{defaultClass:"ju367v1c"},23:{defaultClass:"ju367v1d"}}},fontWeight:{values:{regular:{defaultClass:"ju367v1e"},medium:{defaultClass:"ju367v1f"},semibold:{defaultClass:"ju367v1g"},bold:{defaultClass:"ju367v1h"},heavy:{defaultClass:"ju367v1i"}}},gap:{values:{0:{defaultClass:"ju367v1j"},1:{defaultClass:"ju367v1k"},2:{defaultClass:"ju367v1l"},3:{defaultClass:"ju367v1m"},4:{defaultClass:"ju367v1n"},5:{defaultClass:"ju367v1o"},6:{defaultClass:"ju367v1p"},8:{defaultClass:"ju367v1q"},10:{defaultClass:"ju367v1r"},12:{defaultClass:"ju367v1s"},14:{defaultClass:"ju367v1t"},16:{defaultClass:"ju367v1u"},18:{defaultClass:"ju367v1v"},20:{defaultClass:"ju367v1w"},24:{defaultClass:"ju367v1x"},28:{defaultClass:"ju367v1y"},32:{defaultClass:"ju367v1z"},36:{defaultClass:"ju367v20"},44:{defaultClass:"ju367v21"},64:{defaultClass:"ju367v22"},"-1":{defaultClass:"ju367v23"}}},height:{values:{1:{defaultClass:"ju367v24"},2:{defaultClass:"ju367v25"},4:{defaultClass:"ju367v26"},8:{defaultClass:"ju367v27"},12:{defaultClass:"ju367v28"},20:{defaultClass:"ju367v29"},24:{defaultClass:"ju367v2a"},28:{defaultClass:"ju367v2b"},30:{defaultClass:"ju367v2c"},32:{defaultClass:"ju367v2d"},34:{defaultClass:"ju367v2e"},36:{defaultClass:"ju367v2f"},40:{defaultClass:"ju367v2g"},44:{defaultClass:"ju367v2h"},48:{defaultClass:"ju367v2i"},54:{defaultClass:"ju367v2j"},60:{defaultClass:"ju367v2k"},200:{defaultClass:"ju367v2l"},full:{defaultClass:"ju367v2m"},max:{defaultClass:"ju367v2n"}}},justifyContent:{values:{"flex-start":{defaultClass:"ju367v2o"},"flex-end":{defaultClass:"ju367v2p"},center:{defaultClass:"ju367v2q"},"space-between":{defaultClass:"ju367v2r"},"space-around":{defaultClass:"ju367v2s"}}},textAlign:{values:{left:{defaultClass:"ju367v2t"},center:{defaultClass:"ju367v2u"},inherit:{defaultClass:"ju367v2v"}}},marginBottom:{values:{0:{defaultClass:"ju367v2w"},1:{defaultClass:"ju367v2x"},2:{defaultClass:"ju367v2y"},3:{defaultClass:"ju367v2z"},4:{defaultClass:"ju367v30"},5:{defaultClass:"ju367v31"},6:{defaultClass:"ju367v32"},8:{defaultClass:"ju367v33"},10:{defaultClass:"ju367v34"},12:{defaultClass:"ju367v35"},14:{defaultClass:"ju367v36"},16:{defaultClass:"ju367v37"},18:{defaultClass:"ju367v38"},20:{defaultClass:"ju367v39"},24:{defaultClass:"ju367v3a"},28:{defaultClass:"ju367v3b"},32:{defaultClass:"ju367v3c"},36:{defaultClass:"ju367v3d"},44:{defaultClass:"ju367v3e"},64:{defaultClass:"ju367v3f"},"-1":{defaultClass:"ju367v3g"}}},marginLeft:{values:{0:{defaultClass:"ju367v3h"},1:{defaultClass:"ju367v3i"},2:{defaultClass:"ju367v3j"},3:{defaultClass:"ju367v3k"},4:{defaultClass:"ju367v3l"},5:{defaultClass:"ju367v3m"},6:{defaultClass:"ju367v3n"},8:{defaultClass:"ju367v3o"},10:{defaultClass:"ju367v3p"},12:{defaultClass:"ju367v3q"},14:{defaultClass:"ju367v3r"},16:{defaultClass:"ju367v3s"},18:{defaultClass:"ju367v3t"},20:{defaultClass:"ju367v3u"},24:{defaultClass:"ju367v3v"},28:{defaultClass:"ju367v3w"},32:{defaultClass:"ju367v3x"},36:{defaultClass:"ju367v3y"},44:{defaultClass:"ju367v3z"},64:{defaultClass:"ju367v40"},"-1":{defaultClass:"ju367v41"}}},marginRight:{values:{0:{defaultClass:"ju367v42"},1:{defaultClass:"ju367v43"},2:{defaultClass:"ju367v44"},3:{defaultClass:"ju367v45"},4:{defaultClass:"ju367v46"},5:{defaultClass:"ju367v47"},6:{defaultClass:"ju367v48"},8:{defaultClass:"ju367v49"},10:{defaultClass:"ju367v4a"},12:{defaultClass:"ju367v4b"},14:{defaultClass:"ju367v4c"},16:{defaultClass:"ju367v4d"},18:{defaultClass:"ju367v4e"},20:{defaultClass:"ju367v4f"},24:{defaultClass:"ju367v4g"},28:{defaultClass:"ju367v4h"},32:{defaultClass:"ju367v4i"},36:{defaultClass:"ju367v4j"},44:{defaultClass:"ju367v4k"},64:{defaultClass:"ju367v4l"},"-1":{defaultClass:"ju367v4m"}}},marginTop:{values:{0:{defaultClass:"ju367v4n"},1:{defaultClass:"ju367v4o"},2:{defaultClass:"ju367v4p"},3:{defaultClass:"ju367v4q"},4:{defaultClass:"ju367v4r"},5:{defaultClass:"ju367v4s"},6:{defaultClass:"ju367v4t"},8:{defaultClass:"ju367v4u"},10:{defaultClass:"ju367v4v"},12:{defaultClass:"ju367v4w"},14:{defaultClass:"ju367v4x"},16:{defaultClass:"ju367v4y"},18:{defaultClass:"ju367v4z"},20:{defaultClass:"ju367v50"},24:{defaultClass:"ju367v51"},28:{defaultClass:"ju367v52"},32:{defaultClass:"ju367v53"},36:{defaultClass:"ju367v54"},44:{defaultClass:"ju367v55"},64:{defaultClass:"ju367v56"},"-1":{defaultClass:"ju367v57"}}},maxWidth:{values:{1:{defaultClass:"ju367v58"},2:{defaultClass:"ju367v59"},4:{defaultClass:"ju367v5a"},8:{defaultClass:"ju367v5b"},12:{defaultClass:"ju367v5c"},20:{defaultClass:"ju367v5d"},24:{defaultClass:"ju367v5e"},28:{defaultClass:"ju367v5f"},30:{defaultClass:"ju367v5g"},32:{defaultClass:"ju367v5h"},34:{defaultClass:"ju367v5i"},36:{defaultClass:"ju367v5j"},40:{defaultClass:"ju367v5k"},44:{defaultClass:"ju367v5l"},48:{defaultClass:"ju367v5m"},54:{defaultClass:"ju367v5n"},60:{defaultClass:"ju367v5o"},200:{defaultClass:"ju367v5p"},full:{defaultClass:"ju367v5q"},max:{defaultClass:"ju367v5r"}}},minWidth:{values:{1:{defaultClass:"ju367v5s"},2:{defaultClass:"ju367v5t"},4:{defaultClass:"ju367v5u"},8:{defaultClass:"ju367v5v"},12:{defaultClass:"ju367v5w"},20:{defaultClass:"ju367v5x"},24:{defaultClass:"ju367v5y"},28:{defaultClass:"ju367v5z"},30:{defaultClass:"ju367v60"},32:{defaultClass:"ju367v61"},34:{defaultClass:"ju367v62"},36:{defaultClass:"ju367v63"},40:{defaultClass:"ju367v64"},44:{defaultClass:"ju367v65"},48:{defaultClass:"ju367v66"},54:{defaultClass:"ju367v67"},60:{defaultClass:"ju367v68"},200:{defaultClass:"ju367v69"},full:{defaultClass:"ju367v6a"},max:{defaultClass:"ju367v6b"}}},overflow:{values:{hidden:{defaultClass:"ju367v6c"}}},paddingBottom:{values:{0:{defaultClass:"ju367v6d"},1:{defaultClass:"ju367v6e"},2:{defaultClass:"ju367v6f"},3:{defaultClass:"ju367v6g"},4:{defaultClass:"ju367v6h"},5:{defaultClass:"ju367v6i"},6:{defaultClass:"ju367v6j"},8:{defaultClass:"ju367v6k"},10:{defaultClass:"ju367v6l"},12:{defaultClass:"ju367v6m"},14:{defaultClass:"ju367v6n"},16:{defaultClass:"ju367v6o"},18:{defaultClass:"ju367v6p"},20:{defaultClass:"ju367v6q"},24:{defaultClass:"ju367v6r"},28:{defaultClass:"ju367v6s"},32:{defaultClass:"ju367v6t"},36:{defaultClass:"ju367v6u"},44:{defaultClass:"ju367v6v"},64:{defaultClass:"ju367v6w"},"-1":{defaultClass:"ju367v6x"}}},paddingLeft:{values:{0:{defaultClass:"ju367v6y"},1:{defaultClass:"ju367v6z"},2:{defaultClass:"ju367v70"},3:{defaultClass:"ju367v71"},4:{defaultClass:"ju367v72"},5:{defaultClass:"ju367v73"},6:{defaultClass:"ju367v74"},8:{defaultClass:"ju367v75"},10:{defaultClass:"ju367v76"},12:{defaultClass:"ju367v77"},14:{defaultClass:"ju367v78"},16:{defaultClass:"ju367v79"},18:{defaultClass:"ju367v7a"},20:{defaultClass:"ju367v7b"},24:{defaultClass:"ju367v7c"},28:{defaultClass:"ju367v7d"},32:{defaultClass:"ju367v7e"},36:{defaultClass:"ju367v7f"},44:{defaultClass:"ju367v7g"},64:{defaultClass:"ju367v7h"},"-1":{defaultClass:"ju367v7i"}}},paddingRight:{values:{0:{defaultClass:"ju367v7j"},1:{defaultClass:"ju367v7k"},2:{defaultClass:"ju367v7l"},3:{defaultClass:"ju367v7m"},4:{defaultClass:"ju367v7n"},5:{defaultClass:"ju367v7o"},6:{defaultClass:"ju367v7p"},8:{defaultClass:"ju367v7q"},10:{defaultClass:"ju367v7r"},12:{defaultClass:"ju367v7s"},14:{defaultClass:"ju367v7t"},16:{defaultClass:"ju367v7u"},18:{defaultClass:"ju367v7v"},20:{defaultClass:"ju367v7w"},24:{defaultClass:"ju367v7x"},28:{defaultClass:"ju367v7y"},32:{defaultClass:"ju367v7z"},36:{defaultClass:"ju367v80"},44:{defaultClass:"ju367v81"},64:{defaultClass:"ju367v82"},"-1":{defaultClass:"ju367v83"}}},paddingTop:{values:{0:{defaultClass:"ju367v84"},1:{defaultClass:"ju367v85"},2:{defaultClass:"ju367v86"},3:{defaultClass:"ju367v87"},4:{defaultClass:"ju367v88"},5:{defaultClass:"ju367v89"},6:{defaultClass:"ju367v8a"},8:{defaultClass:"ju367v8b"},10:{defaultClass:"ju367v8c"},12:{defaultClass:"ju367v8d"},14:{defaultClass:"ju367v8e"},16:{defaultClass:"ju367v8f"},18:{defaultClass:"ju367v8g"},20:{defaultClass:"ju367v8h"},24:{defaultClass:"ju367v8i"},28:{defaultClass:"ju367v8j"},32:{defaultClass:"ju367v8k"},36:{defaultClass:"ju367v8l"},44:{defaultClass:"ju367v8m"},64:{defaultClass:"ju367v8n"},"-1":{defaultClass:"ju367v8o"}}},position:{values:{absolute:{defaultClass:"ju367v8p"},fixed:{defaultClass:"ju367v8q"},relative:{defaultClass:"ju367v8r"}}},right:{values:{0:{defaultClass:"ju367v8s"}}},transition:{values:{default:{defaultClass:"ju367v8t"},transform:{defaultClass:"ju367v8u"}}},userSelect:{values:{none:{defaultClass:"ju367v8v"}}},width:{values:{1:{defaultClass:"ju367v8w"},2:{defaultClass:"ju367v8x"},4:{defaultClass:"ju367v8y"},8:{defaultClass:"ju367v8z"},12:{defaultClass:"ju367v90"},20:{defaultClass:"ju367v91"},24:{defaultClass:"ju367v92"},28:{defaultClass:"ju367v93"},30:{defaultClass:"ju367v94"},32:{defaultClass:"ju367v95"},34:{defaultClass:"ju367v96"},36:{defaultClass:"ju367v97"},40:{defaultClass:"ju367v98"},44:{defaultClass:"ju367v99"},48:{defaultClass:"ju367v9a"},54:{defaultClass:"ju367v9b"},60:{defaultClass:"ju367v9c"},200:{defaultClass:"ju367v9d"},full:{defaultClass:"ju367v9e"},max:{defaultClass:"ju367v9f"}}},backdropFilter:{values:{modalOverlay:{defaultClass:"ju367v9g"}}}}}),D0={colors:{accentColor:"var(--rk-colors-accentColor)",accentColorForeground:"var(--rk-colors-accentColorForeground)",actionButtonBorder:"var(--rk-colors-actionButtonBorder)",actionButtonBorderMobile:"var(--rk-colors-actionButtonBorderMobile)",actionButtonSecondaryBackground:"var(--rk-colors-actionButtonSecondaryBackground)",closeButton:"var(--rk-colors-closeButton)",closeButtonBackground:"var(--rk-colors-closeButtonBackground)",connectButtonBackground:"var(--rk-colors-connectButtonBackground)",connectButtonBackgroundError:"var(--rk-colors-connectButtonBackgroundError)",connectButtonInnerBackground:"var(--rk-colors-connectButtonInnerBackground)",connectButtonText:"var(--rk-colors-connectButtonText)",connectButtonTextError:"var(--rk-colors-connectButtonTextError)",connectionIndicator:"var(--rk-colors-connectionIndicator)",downloadBottomCardBackground:"var(--rk-colors-downloadBottomCardBackground)",downloadTopCardBackground:"var(--rk-colors-downloadTopCardBackground)",error:"var(--rk-colors-error)",generalBorder:"var(--rk-colors-generalBorder)",generalBorderDim:"var(--rk-colors-generalBorderDim)",menuItemBackground:"var(--rk-colors-menuItemBackground)",modalBackdrop:"var(--rk-colors-modalBackdrop)",modalBackground:"var(--rk-colors-modalBackground)",modalBorder:"var(--rk-colors-modalBorder)",modalText:"var(--rk-colors-modalText)",modalTextDim:"var(--rk-colors-modalTextDim)",modalTextSecondary:"var(--rk-colors-modalTextSecondary)",profileAction:"var(--rk-colors-profileAction)",profileActionHover:"var(--rk-colors-profileActionHover)",profileForeground:"var(--rk-colors-profileForeground)",selectedOptionBorder:"var(--rk-colors-selectedOptionBorder)",standby:"var(--rk-colors-standby)"},fonts:{body:"var(--rk-fonts-body)"},radii:{actionButton:"var(--rk-radii-actionButton)",connectButton:"var(--rk-radii-connectButton)",menuButton:"var(--rk-radii-menuButton)",modal:"var(--rk-radii-modal)",modalMobile:"var(--rk-radii-modalMobile)"},shadows:{connectButton:"var(--rk-shadows-connectButton)",dialog:"var(--rk-shadows-dialog)",profileDetailsAction:"var(--rk-shadows-profileDetailsAction)",selectedOption:"var(--rk-shadows-selectedOption)",selectedWallet:"var(--rk-shadows-selectedWallet)",walletLogo:"var(--rk-shadows-walletLogo)"},blurs:{modalOverlay:"var(--rk-blurs-modalOverlay)"}},C3={shrink:"_12cbo8i6",shrinkSm:"_12cbo8i7"},M3="_12cbo8i3 ju367v8r",r3={grow:"_12cbo8i4",growLg:"_12cbo8i5"};function w({active:u,hover:E}){return[M3,E&&r3[E],C3[u]]}var f0=r.createContext(null);function D3(){var u;const{adapter:E}=(u=r.useContext(f0))!=null?u:{};if(!E)throw new Error("No authentication adapter found");return E}function Fu(){var u;const E=r.useContext(f0);return(u=E?.status)!=null?u:null}function Gu(){const u=Fu(),{isConnected:E}=J();return E?u&&(u==="loading"||u==="unauthenticated")?u:"connected":"disconnected"}function c3(){return typeof navigator<"u"&&/android/i.test(navigator.userAgent)}function s3(){return typeof navigator<"u"&&/iPhone|iPod/.test(navigator.userAgent)}function A3(){return typeof navigator<"u"&&(/iPad/.test(navigator.userAgent)||navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1)}function fu(){return s3()||A3()}function O(){return c3()||fu()}var d3="iekbcc0",j3={a:"iekbcca",blockquote:"iekbcc2",button:"iekbcc9",input:"iekbcc8 iekbcc5 iekbcc4",mark:"iekbcc6",ol:"iekbcc1",q:"iekbcc2",select:"iekbcc7 iekbcc5 iekbcc4",table:"iekbcc3",textarea:"iekbcc5 iekbcc4",ul:"iekbcc1"},N3=({reset:u,...E})=>{if(!u)return Wu(E);const n=j3[u],i=Wu(E);return R0(d3,n,i)},t=r.forwardRef(({as:u="div",className:E,testId:n,...i},a)=>{const l={},o={};for(const M in i)Wu.properties.has(M)?l[M]=i[M]:o[M]=i[M];const C=N3({reset:typeof u=="string"?u:"div",...l});return r.createElement(u,{className:R0(C,E),...o,"data-testid":n?`rk-${n.replace(/^rk-/,"")}`:void 0,ref:a})});t.displayName="Box";var P0=new Map,Tu=new Map;async function J0(u){const E=Tu.get(u);if(E)return E;const n=async()=>u().then(async a=>(P0.set(u,a),a)),i=n().catch(a=>n().catch(l=>{Tu.delete(u)}));return Tu.set(u,i),i}async function P(...u){return await Promise.all(u.map(E=>typeof E=="function"?J0(E):E))}function I3(){const[,u]=r.useReducer(E=>E+1,0);return u}function Pu(u){const E=typeof u=="function"?P0.get(u):void 0,n=I3();return r.useEffect(()=>{typeof u=="function"&&!E&&J0(u).then(n)},[u,E,n]),typeof u=="function"?E:u}function b({alt:u,background:E,borderColor:n,borderRadius:i,boxShadow:a,height:l,src:o,width:C,testId:M}){const c=Pu(o),d=c&&/^http/.test(c),[D,L]=r.useReducer(()=>!0,!1);return e.createElement(t,{"aria-label":u,borderRadius:i,boxShadow:a,height:typeof l=="string"?l:void 0,overflow:"hidden",position:"relative",role:"img",style:{background:E,height:typeof l=="number"?l:void 0,width:typeof C=="number"?C:void 0},width:typeof C=="string"?C:void 0,testId:M},e.createElement(t,{...d?{"aria-hidden":!0,as:"img",onLoad:L,src:c}:{backgroundSize:"cover"},height:"full",position:"absolute",style:{touchCallout:"none",transition:"opacity .15s linear",userSelect:"none",...d?{opacity:D?1:0}:{backgroundImage:c?`url(${c})`:void 0,backgroundRepeat:"no-repeat",opacity:c?1:0}},width:"full"}),n?e.createElement(t,{...typeof n=="object"&&"custom"in n?{style:{borderColor:n.custom}}:{borderColor:n},borderRadius:i,borderStyle:"solid",borderWidth:"1",height:"full",position:"relative",width:"full"}):null)}var L3="_1luule42",p3="_1luule43",F3=u=>r.useMemo(()=>`${u}_${Math.round(Math.random()*1e9)}`,[u]),Cu=({height:u=21,width:E=21})=>{const n=F3("spinner");return e.createElement("svg",{className:L3,fill:"none",height:u,viewBox:"0 0 21 21",width:E,xmlns:"http://www.w3.org/2000/svg"},e.createElement("title",null,"Loading"),e.createElement("clipPath",{id:n},e.createElement("path",{d:"M10.5 3C6.35786 3 3 6.35786 3 10.5C3 14.6421 6.35786 18 10.5 18C11.3284 18 12 18.6716 12 19.5C12 20.3284 11.3284 21 10.5 21C4.70101 21 0 16.299 0 10.5C0 4.70101 4.70101 0 10.5 0C16.299 0 21 4.70101 21 10.5C21 11.3284 20.3284 12 19.5 12C18.6716 12 18 11.3284 18 10.5C18 6.35786 14.6421 3 10.5 3Z"})),e.createElement("foreignObject",{clipPath:`url(#${n})`,height:"21",width:"21",x:"0",y:"0"},e.createElement("div",{className:p3})))},T=["#FC5C54","#FFD95A","#E95D72","#6A87C8","#5FD0F3","#75C06B","#FFDD86","#5FC6D4","#FF949A","#FF8024","#9BA1A4","#EC66FF","#FF8CBC","#FF9A23","#C5DADB","#A8CE63","#71ABFF","#FFE279","#B6B1B6","#FF6780","#A575FF","#4D82FF","#FFB35A"],c0=[{color:T[0],emoji:"🌶"},{color:T[1],emoji:"🤑"},{color:T[2],emoji:"🐙"},{color:T[3],emoji:"🫐"},{color:T[4],emoji:"🐳"},{color:T[0],emoji:"🤶"},{color:T[5],emoji:"🌲"},{color:T[6],emoji:"🌞"},{color:T[7],emoji:"🐒"},{color:T[8],emoji:"🐵"},{color:T[9],emoji:"🦊"},{color:T[10],emoji:"🐼"},{color:T[11],emoji:"🦄"},{color:T[12],emoji:"🐷"},{color:T[13],emoji:"🐧"},{color:T[8],emoji:"🦩"},{color:T[14],emoji:"👽"},{color:T[0],emoji:"🎈"},{color:T[8],emoji:"🍉"},{color:T[1],emoji:"🎉"},{color:T[15],emoji:"🐲"},{color:T[16],emoji:"🌎"},{color:T[17],emoji:"🍊"},{color:T[18],emoji:"🐭"},{color:T[19],emoji:"🍣"},{color:T[1],emoji:"🐥"},{color:T[20],emoji:"👾"},{color:T[15],emoji:"🥦"},{color:T[0],emoji:"👹"},{color:T[17],emoji:"🙀"},{color:T[4],emoji:"⛱"},{color:T[21],emoji:"⛵️"},{color:T[17],emoji:"🥳"},{color:T[8],emoji:"🤯"},{color:T[22],emoji:"🤠"}];function g3(u){let E=0;if(u.length===0)return E;for(let n=0;n<u.length;n++){const i=u.charCodeAt(n);E=(E<<5)-E+i,E|=0}return E}function B3(u){const n=Math.abs(g3((typeof u=="string"?u:"").toLowerCase())%c0.length);return c0[n??0]}var x3=({address:u,ensImage:E,size:n})=>{const[i,a]=r.useState(!1);r.useEffect(()=>{if(E){const C=new Image;C.src=E,C.onload=()=>a(!0)}},[E]);const{color:l,emoji:o}=r.useMemo(()=>B3(u),[u]);return E?i?e.createElement(t,{backgroundSize:"cover",borderRadius:"full",position:"absolute",style:{backgroundImage:`url(${E})`,backgroundPosition:"center",height:n,width:n}}):e.createElement(t,{alignItems:"center",backgroundSize:"cover",borderRadius:"full",color:"modalText",display:"flex",justifyContent:"center",position:"absolute",style:{height:n,width:n}},e.createElement(Cu,null)):e.createElement(t,{alignItems:"center",display:"flex",justifyContent:"center",overflow:"hidden",style:{...!E&&{backgroundColor:l},height:n,width:n}},o)},H0=x3,X0=r.createContext(H0);function _0({address:u,imageUrl:E,loading:n,size:i}){const a=r.useContext(X0);return e.createElement(t,{"aria-hidden":!0,borderRadius:"full",overflow:"hidden",position:"relative",style:{height:`${i}px`,width:`${i}px`},userSelect:"none"},e.createElement(t,{alignItems:"center",borderRadius:"full",display:"flex",justifyContent:"center",overflow:"hidden",position:"absolute",style:{fontSize:`${Math.round(i*.55)}px`,height:`${i}px`,transform:n?"scale(0.72)":void 0,transition:".25s ease",transitionDelay:n?void 0:".1s",width:`${i}px`,willChange:"transform"},userSelect:"none"},e.createElement(a,{address:u,ensImage:E,size:i})),n&&e.createElement(t,{color:"accentColor",display:"flex",height:"full",position:"absolute",width:"full"},e.createElement(Cu,{height:"100%",width:"100%"})))}var s0=()=>e.createElement("svg",{fill:"none",height:"7",width:"14",xmlns:"http://www.w3.org/2000/svg"},e.createElement("title",null,"Dropdown"),e.createElement("path",{d:"M12.75 1.54001L8.51647 5.0038C7.77974 5.60658 6.72026 5.60658 5.98352 5.0038L1.75 1.54001",stroke:"currentColor",strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2.5",xmlns:"http://www.w3.org/2000/svg"})),W=new K4.I18n({en:JSON.parse(hu),"en-US":JSON.parse(hu)});W.defaultLocale="en-US";W.enableFallback=!0;var z3=async u=>{switch(u){case"ar":case"ar-AR":return(await x(async()=>{const{default:E}=await Promise.resolve().then(()=>fE);return{default:E}},void 0)).default;case"en":case"en-US":return(await x(async()=>{const{default:E}=await Promise.resolve().then(()=>b0);return{default:E}},void 0)).default;case"es":case"es-419":return(await x(async()=>{const{default:E}=await Promise.resolve().then(()=>JE);return{default:E}},void 0)).default;case"fr":case"fr-FR":return(await x(async()=>{const{default:E}=await Promise.resolve().then(()=>XE);return{default:E}},void 0)).default;case"hi":case"hi-IN":return(await x(async()=>{const{default:E}=await Promise.resolve().then(()=>qE);return{default:E}},void 0)).default;case"id":case"id-ID":return(await x(async()=>{const{default:E}=await Promise.resolve().then(()=>$E);return{default:E}},void 0)).default;case"ja":case"ja-JP":return(await x(async()=>{const{default:E}=await Promise.resolve().then(()=>en);return{default:E}},void 0)).default;case"ko":case"ko-KR":return(await x(async()=>{const{default:E}=await Promise.resolve().then(()=>nn);return{default:E}},void 0)).default;case"pt":case"pt-BR":return(await x(async()=>{const{default:E}=await Promise.resolve().then(()=>an);return{default:E}},void 0)).default;case"ru":case"ru-RU":return(await x(async()=>{const{default:E}=await Promise.resolve().then(()=>on);return{default:E}},void 0)).default;case"th":case"th-TH":return(await x(async()=>{const{default:E}=await Promise.resolve().then(()=>Mn);return{default:E}},void 0)).default;case"tr":case"tr-TR":return(await x(async()=>{const{default:E}=await Promise.resolve().then(()=>Dn);return{default:E}},void 0)).default;case"ua":case"uk-UA":return(await x(async()=>{const{default:E}=await Promise.resolve().then(()=>sn);return{default:E}},void 0)).default;case"zh":case"zh-CN":return(await x(async()=>{const{default:E}=await Promise.resolve().then(()=>dn);return{default:E}},void 0)).default;default:return(await x(async()=>{const{default:E}=await Promise.resolve().then(()=>b0);return{default:E}},void 0)).default}};async function A0(u){if(W.translations[u]){W.locale=u;return}const E=await z3(u);W.translations[u]=JSON.parse(E),W.locale=u}var y3=()=>{var u;if(typeof window<"u"&&typeof navigator<"u"){if((u=navigator.languages)!=null&&u.length)return navigator.languages[0];if(navigator.language)return navigator.language}},U=r.createContext({i18n:W}),m3=({children:u,locale:E})=>{const[n,i]=r.useState(0),a=r.useMemo(()=>y3(),[]);r.useEffect(()=>W.onChange(()=>{i(C=>C+1)}),[]),r.useEffect(()=>{E&&E!==W.locale?A0(E):!E&&a&&a!==W.locale&&A0(a)},[E,a]);const l=r.useMemo(()=>({t:(C,M)=>W.t(C,M),i18n:W}),[n]);return e.createElement(U.Provider,{value:l},u)};function Ju(u){return u!=null}var Su={iconBackground:"#96bedc",iconUrl:async()=>(await x(async()=>{const{default:u}=await Promise.resolve().then(()=>Nn);return{default:u}},void 0)).default},d0={iconBackground:"#e84141",iconUrl:async()=>(await x(async()=>{const{default:u}=await Promise.resolve().then(()=>Ln);return{default:u}},void 0)).default},ku={iconBackground:"#0052ff",iconUrl:async()=>(await x(async()=>{const{default:u}=await Promise.resolve().then(()=>Fn);return{default:u}},void 0)).default},j0={iconBackground:"#ebac0e",iconUrl:async()=>(await x(async()=>{const{default:u}=await Promise.resolve().then(()=>Bn);return{default:u}},void 0)).default},N0={iconBackground:"#002D74",iconUrl:async()=>(await x(async()=>{const{default:u}=await Promise.resolve().then(()=>zn);return{default:u}},void 0)).default},K={iconBackground:"#484c50",iconUrl:async()=>(await x(async()=>{const{default:u}=await Promise.resolve().then(()=>mn);return{default:u}},void 0)).default},T3={iconBackground:"#f9f7ec",iconUrl:async()=>(await x(async()=>{const{default:u}=await Promise.resolve().then(()=>Sn);return{default:u}},void 0)).default},du={iconBackground:"#ff5a57",iconUrl:async()=>(await x(async()=>{const{default:u}=await Promise.resolve().then(()=>wn);return{default:u}},void 0)).default},I0={iconBackground:"#9f71ec",iconUrl:async()=>(await x(async()=>{const{default:u}=await Promise.resolve().then(()=>Un);return{default:u}},void 0)).default},L0={iconBackground:"#f9f7ec",iconUrl:async()=>(await x(async()=>{const{default:u}=await Promise.resolve().then(()=>On);return{default:u}},void 0)).default},p0={iconBackground:"#f9f7ec",iconUrl:async()=>(await x(async()=>{const{default:u}=await Promise.resolve().then(()=>vn);return{default:u}},void 0)).default},wu={iconBackground:"#000000",iconUrl:async()=>(await x(async()=>{const{default:u}=await Promise.resolve().then(()=>Wn);return{default:u}},void 0)).default},S3={arbitrum:{chainId:42161,name:"Arbitrum",...Su},arbitrumGoerli:{chainId:421613,...Su},arbitrumSepolia:{chainId:421614,...Su},avalanche:{chainId:43114,...d0},avalancheFuji:{chainId:43113,...d0},base:{chainId:8453,name:"Base",...ku},baseGoerli:{chainId:84531,...ku},baseSepolia:{chainId:84532,...ku},bsc:{chainId:56,name:"BSC",...j0},bscTestnet:{chainId:97,...j0},cronos:{chainId:25,...N0},cronosTestnet:{chainId:338,...N0},goerli:{chainId:5,...K},hardhat:{chainId:31337,...T3},holesky:{chainId:17e3,...K},kovan:{chainId:42,...K},localhost:{chainId:1337,...K},mainnet:{chainId:1,name:"Ethereum",...K},optimism:{chainId:10,name:"Optimism",...du},optimismGoerli:{chainId:420,...du},optimismKovan:{chainId:69,...du},optimismSepolia:{chainId:11155420,...du},polygon:{chainId:137,name:"Polygon",...I0},polygonMumbai:{chainId:80001,...I0},rinkeby:{chainId:4,...K},ropsten:{chainId:3,...K},sepolia:{chainId:11155111,...K},xdc:{chainId:50,name:"XinFin",...L0},xdcTestnet:{chainId:51,...L0},zkSync:{chainId:324,name:"zkSync",...p0},zkSyncTestnet:{chainId:280,...p0},zora:{chainId:7777777,name:"Zora",...wu},zoraSepolia:{chainId:999999999,...wu},zoraTestnet:{chainId:999,...wu}},k3=Object.fromEntries(Object.values(S3).filter(Ju).map(({chainId:u,...E})=>[u,E])),w3=u=>u.map(E=>{var n,i,a,l;const o=(n=k3[E.id])!=null?n:{};return{...E,name:(i=o.name)!=null?i:E.name,iconUrl:(a=E.iconUrl)!=null?a:o.iconUrl,iconBackground:(l=E.iconBackground)!=null?l:o.iconBackground}}),Hu=r.createContext({chains:[]});function b3({chains:u,children:E,initialChain:n}){return e.createElement(Hu.Provider,{value:r.useMemo(()=>({chains:w3(u),initialChainId:typeof n=="number"?n:n?.id}),[u,n])},E)}var Mu=()=>r.useContext(Hu).chains,U3=()=>r.useContext(Hu).initialChainId,Z3=()=>{const u=Mu();return r.useMemo(()=>{const E={};for(const n of u)E[n.id]=n;return E},[u])},q0=r.createContext({showBalance:void 0,setShowBalance:()=>{}});function O3({children:u}){const[E,n]=r.useState();return e.createElement(q0.Provider,{value:{showBalance:E,setShowBalance:n}},u)}var K0=()=>r.useContext(q0);function Y3(){const[u,E]=r.useState(!1);return r.useEffect(()=>(E(!0),()=>{E(!1)}),[]),r.useCallback(()=>u,[u])}function $0(){const u=e3.id,E=Y0(),n=Array.isArray(E.chains)?E.chains:[],i=n?.some(a=>a?.id===u);return{chainId:u,enabled:i}}function u4(u){const{chainId:E,enabled:n}=$0(),{data:i}=G4({chainId:E,enabled:n,name:u});return i}function e4(u){const{chainId:E,enabled:n}=$0(),{data:i}=f4({address:u,chainId:E,enabled:n});return i}function Xu(){var u;const{chain:E}=eu();return(u=E?.id)!=null?u:null}var E4="rk-transactions";function v3(u){try{const E=u?JSON.parse(u):{};return typeof E=="object"?E:{}}catch{return{}}}function F0(){return v3(typeof localStorage<"u"?localStorage.getItem(E4):null)}var h3=/^0x([A-Fa-f0-9]{64})$/;function W3(u){const E=[];return h3.test(u.hash)||E.push("Invalid transaction hash"),typeof u.description!="string"&&E.push("Transaction must have a description"),typeof u.confirmations<"u"&&(!Number.isInteger(u.confirmations)||u.confirmations<1)&&E.push("Transaction confirmations must be a positiver integer"),E}function Q3({provider:u}){let E=F0(),n=u;const i=new Set,a=new Map;function l(j){n=j}function o(j,g){var N,B;return(B=(N=E[j])==null?void 0:N[g])!=null?B:[]}function C(j,g,N){const B=W3(N);if(B.length>0)throw new Error(["Unable to add transaction",...B].join(`
`));D(j,g,F=>[{...N,status:"pending"},...F.filter(({hash:I})=>I!==N.hash)])}function M(j,g){D(j,g,()=>[])}function c(j,g,N,B){D(j,g,F=>F.map(I=>I.hash===N?{...I,status:B}:I))}async function d(j,g){await Promise.all(o(j,g).filter(N=>N.status==="pending").map(async N=>{const{confirmations:B,hash:F}=N,I=a.get(F);if(I)return await I;const z=n.waitForTransactionReceipt({confirmations:B,hash:F}).then(({status:y})=>{a.delete(F),y!==void 0&&c(j,g,F,y===0||y==="reverted"?"failed":"confirmed")});return a.set(F,z),await z}))}function D(j,g,N){var B,F;E=F0(),E[j]=(B=E[j])!=null?B:{};let I=0;const z=10,y=N((F=E[j][g])!=null?F:[]).filter(({status:S})=>S==="pending"?!0:I++<=z);E[j][g]=y.length>0?y:void 0,L(),s(),d(j,g)}function L(){localStorage.setItem(E4,JSON.stringify(E))}function s(){for(const j of i)j()}function A(j){return i.add(j),()=>{i.delete(j)}}return{addTransaction:C,clearTransactions:M,getTransactions:o,onChange:A,setProvider:l,waitForPendingTransactions:d}}var bu,n4=r.createContext(null);function V3({children:u}){const E=Y0(),{address:n}=J(),i=Xu(),[a]=r.useState(()=>bu??(bu=Q3({provider:E})));return r.useEffect(()=>{a.setProvider(E)},[a,E]),r.useEffect(()=>{n&&i&&a.waitForPendingTransactions(n,i)},[a,n,i]),e.createElement(n4.Provider,{value:a},u)}function t4(){const u=r.useContext(n4);if(!u)throw new Error("Transaction hooks must be used within RainbowKitProvider");return u}function i4(){const u=t4(),{address:E}=J(),n=Xu(),[i,a]=r.useState(()=>u&&E&&n?u.getTransactions(E,n):[]);return r.useEffect(()=>{if(u&&E&&n)return a(u.getTransactions(E,n)),u.onChange(()=>{a(u.getTransactions(E,n))})},[u,E,n]),i}var g0=u=>typeof u=="function"?u():u;function R3(u,{extends:E}={}){const n={...l0(D0,g0(u))};if(!E)return n;const i=l0(D0,g0(E));return Object.fromEntries(Object.entries(n).filter(([l,o])=>o!==i[l]))}function B0(u,E={}){return Object.entries(R3(u,E)).map(([n,i])=>`${n}:${i.replace(/[:;{}</>]/g,"")};`).join("")}var a4={appName:void 0,disclaimer:void 0,learnMoreUrl:"https://learn.rainbow.me/understanding-web3?utm_source=rainbowkit&utm_campaign=learnmore"},au=r.createContext(a4),l4=r.createContext(!1),o4=()=>{const[u,E]=r.useState({height:void 0,width:void 0});return r.useEffect(()=>{function n(){E({height:window.innerHeight,width:window.innerWidth})}return window.addEventListener("resize",n),n(),()=>window.removeEventListener("resize",n)},[]),u},ru=r.createContext({connector:null,setConnector:()=>{}});function G3({children:u}){const[E,n]=r.useState(null);return e.createElement(ru.Provider,{value:r.useMemo(()=>({connector:E,setConnector:n}),[E])},u)}var Du={COMPACT:"compact",WIDE:"wide"},gu=r.createContext(Du.WIDE);function f3({children:u,modalSize:E}){const{width:n}=o4(),i=n&&n<o3,{connector:a}=r.useContext(ru);return e.createElement(gu.Provider,{value:i||a?Du.COMPACT:E},u)}var _u=r.createContext(!1),P3="rk-version";function J3({version:u}){localStorage.setItem(P3,u)}function H3(){const u=r.useCallback(()=>{J3({version:"1.3.3"})},[]);r.useEffect(()=>{u()},[u])}function X3(u){const E=[];for(const n of u)E.push(...n);return E}function _3(u,E){const n={};for(const i of u){const a=E(i);a&&(n[a]=i)}return n}function qu(){return typeof navigator<"u"&&/Version\/([0-9._]+).*Safari/.test(navigator.userAgent)}function q3(){return typeof document<"u"&&getComputedStyle(document.body).getPropertyValue("--arc-palette-focus")!==""}function Ku(){var u;if(typeof navigator>"u")return"Browser";const E=navigator.userAgent.toLowerCase();return(u=navigator.brave)!=null&&u.isBrave?"Brave":E.indexOf("edg/")>-1?"Edge":E.indexOf("op")>-1?"Opera":q3()?"Arc":E.indexOf("chrome")>-1?"Chrome":E.indexOf("firefox")>-1?"Firefox":qu()?"Safari":"Browser"}var K3=$4.UAParser(),{os:$u}=K3;function $3(){return $u.name==="Windows"}function ue(){return $u.name==="Mac OS"}function ee(){return["Ubuntu","Mint","Fedora","Debian","Arch","Linux"].includes($u.name)}function u0(){return $3()?"Windows":ue()?"macOS":ee()?"Linux":"Desktop"}var Ee=u=>{var E,n,i,a,l,o,C,M,c,d,D,L;const s=Ku();return(L={Arc:(E=u?.downloadUrls)==null?void 0:E.chrome,Brave:(n=u?.downloadUrls)==null?void 0:n.chrome,Chrome:(i=u?.downloadUrls)==null?void 0:i.chrome,Edge:((a=u?.downloadUrls)==null?void 0:a.edge)||((l=u?.downloadUrls)==null?void 0:l.chrome),Firefox:(o=u?.downloadUrls)==null?void 0:o.firefox,Opera:((C=u?.downloadUrls)==null?void 0:C.opera)||((M=u?.downloadUrls)==null?void 0:M.chrome),Safari:(c=u?.downloadUrls)==null?void 0:c.safari,Browser:(d=u?.downloadUrls)==null?void 0:d.browserExtension}[s])!=null?L:(D=u?.downloadUrls)==null?void 0:D.browserExtension},ne=u=>{var E,n,i,a;return(a=fu()?(E=u?.downloadUrls)==null?void 0:E.ios:(n=u?.downloadUrls)==null?void 0:n.android)!=null?a:(i=u?.downloadUrls)==null?void 0:i.mobile},te=u=>{var E,n,i,a,l,o;const C=u0();return(o={Windows:(E=u?.downloadUrls)==null?void 0:E.windows,macOS:(n=u?.downloadUrls)==null?void 0:n.macos,Linux:(i=u?.downloadUrls)==null?void 0:i.linux,Desktop:(a=u?.downloadUrls)==null?void 0:a.desktop}[C])!=null?o:(l=u?.downloadUrls)==null?void 0:l.desktop},C4="rk-recent";function ie(u){try{const E=u?JSON.parse(u):[];return Array.isArray(E)?E:[]}catch{return[]}}function M4(){return typeof localStorage<"u"?ie(localStorage.getItem(C4)):[]}function ae(u){return[...new Set(u)]}function le(u){const E=ae([u,...M4()]);localStorage.setItem(C4,JSON.stringify(E))}function Bu(){var u;const E=Mu(),n=U3(),{connectAsync:i,connectors:a}=J4(),l=a;async function o(A,j){var g,N,B;const F=await j.getChainId(),I=await i({chainId:(B=n??((g=E.find(({id:z})=>z===F))==null?void 0:g.id))!=null?B:(N=E[0])==null?void 0:N.id,connector:j});return I&&le(A),I}async function C(A,j){try{return await o(A,j)}catch(g){if(!(g.name==="UserRejectedRequestError"||g.message==="Connection request reset. Please try again."))throw g}}const M=X3(l.map(A=>{var j;return(j=A._wallets)!=null?j:[]})).sort((A,j)=>A.index-j.index),c=_3(M,A=>A.id),D=M4().map(A=>c[A]).filter(Ju).slice(0,3),L=[...D,...M.filter(A=>!D.includes(A))],s=[];for(const A of L){if(!A)continue;const j=D.includes(A);s.push({...A,connect:()=>A.connector.showQrModal?C(A.id,A.connector):o(A.id,A.connector),desktopDownloadUrl:te(A),extensionDownloadUrl:Ee(A),groupName:A.groupName,mobileDownloadUrl:ne(A),onConnecting:g=>A.connector.on("message",({type:N})=>N==="connecting"?g():void 0),ready:((u=A.installed)!=null?u:!0)&&A.connector.ready,recent:j,showWalletConnectModal:A.walletConnectModalConnector?()=>C(A.id,A.walletConnectModalConnector):void 0})}return s}var r4=async()=>(await x(async()=>{const{default:u}=await Promise.resolve().then(()=>Vn);return{default:u}},void 0)).default,oe=()=>P(r4),Ce=()=>e.createElement(b,{background:"#d0d5de",borderRadius:"10",height:"48",src:r4,width:"48"}),D4=async()=>(await x(async()=>{const{default:u}=await Promise.resolve().then(()=>Gn);return{default:u}},void 0)).default,Me=()=>P(D4),re=()=>e.createElement(b,{background:"#d0d5de",borderRadius:"10",height:"48",src:D4,width:"48"}),p=e.forwardRef(({as:u="div",children:E,className:n,color:i,display:a,font:l="body",id:o,size:C="16",style:M,tabIndex:c,textAlign:d="inherit",weight:D="regular",testId:L},s)=>e.createElement(t,{as:u,className:n,color:i,display:a,fontFamily:l,fontSize:C,fontWeight:D,id:o,ref:s,style:M,tabIndex:c,textAlign:d,testId:L},E));p.displayName="Text";var De={large:{fontSize:"16",paddingX:"24",paddingY:"10"},medium:{fontSize:"14",height:"28",paddingX:"12",paddingY:"4"},small:{fontSize:"14",paddingX:"10",paddingY:"5"}};function h({disabled:u=!1,href:E,label:n,onClick:i,rel:a="noreferrer noopener",size:l="medium",target:o="_blank",testId:C,type:M="primary"}){const c=M==="primary",d=l!=="large",D=O(),L=u?"actionButtonSecondaryBackground":c?"accentColor":d?"actionButtonSecondaryBackground":null,{fontSize:s,height:A,paddingX:j,paddingY:g}=De[l],N=!D||!d;return e.createElement(t,{...E?u?{}:{as:"a",href:E,rel:a,target:o}:{as:"button",type:"button"},onClick:u?void 0:i,...N?{borderColor:D&&!d&&!c?"actionButtonBorderMobile":"actionButtonBorder",borderStyle:"solid",borderWidth:"1"}:{},borderRadius:"actionButton",className:!u&&w({active:"shrinkSm",hover:"grow"}),display:"block",paddingX:j,paddingY:g,style:{willChange:"transform"},testId:C,textAlign:"center",transition:"transform",...L?{background:L}:{},...A?{height:A}:{}},e.createElement(p,{color:u?"modalTextSecondary":c?"accentColorForeground":"accentColor",size:s,weight:"bold"},n))}var ce=()=>O()?e.createElement("svg",{"aria-hidden":!0,fill:"none",height:"11.5",viewBox:"0 0 11.5 11.5",width:"11.5",xmlns:"http://www.w3.org/2000/svg"},e.createElement("title",null,"Close"),e.createElement("path",{d:"M2.13388 0.366117C1.64573 -0.122039 0.854272 -0.122039 0.366117 0.366117C-0.122039 0.854272 -0.122039 1.64573 0.366117 2.13388L3.98223 5.75L0.366117 9.36612C-0.122039 9.85427 -0.122039 10.6457 0.366117 11.1339C0.854272 11.622 1.64573 11.622 2.13388 11.1339L5.75 7.51777L9.36612 11.1339C9.85427 11.622 10.6457 11.622 11.1339 11.1339C11.622 10.6457 11.622 9.85427 11.1339 9.36612L7.51777 5.75L11.1339 2.13388C11.622 1.64573 11.622 0.854272 11.1339 0.366117C10.6457 -0.122039 9.85427 -0.122039 9.36612 0.366117L5.75 3.98223L2.13388 0.366117Z",fill:"currentColor"})):e.createElement("svg",{"aria-hidden":!0,fill:"none",height:"10",viewBox:"0 0 10 10",width:"10",xmlns:"http://www.w3.org/2000/svg"},e.createElement("title",null,"Close"),e.createElement("path",{d:"M1.70711 0.292893C1.31658 -0.0976311 0.683417 -0.0976311 0.292893 0.292893C-0.0976311 0.683417 -0.0976311 1.31658 0.292893 1.70711L3.58579 5L0.292893 8.29289C-0.0976311 8.68342 -0.0976311 9.31658 0.292893 9.70711C0.683417 10.0976 1.31658 10.0976 1.70711 9.70711L5 6.41421L8.29289 9.70711C8.68342 10.0976 9.31658 10.0976 9.70711 9.70711C10.0976 9.31658 10.0976 8.68342 9.70711 8.29289L6.41421 5L9.70711 1.70711C10.0976 1.31658 10.0976 0.683417 9.70711 0.292893C9.31658 -0.0976311 8.68342 -0.0976311 8.29289 0.292893L5 3.58579L1.70711 0.292893Z",fill:"currentColor"})),$=({"aria-label":u="Close",onClose:E})=>{const n=O();return e.createElement(t,{alignItems:"center","aria-label":u,as:"button",background:"closeButtonBackground",borderColor:"actionButtonBorder",borderRadius:"full",borderStyle:"solid",borderWidth:n?"0":"1",className:w({active:"shrinkSm",hover:"growLg"}),color:"closeButton",display:"flex",height:n?"30":"28",justifyContent:"center",onClick:E,style:{willChange:"transform"},transition:"default",type:"button",width:n?"30":"28"},e.createElement(ce,null))},c4=async()=>(await x(async()=>{const{default:u}=await Promise.resolve().then(()=>Pn);return{default:u}},void 0)).default;function se({onClose:u}){const{i18n:E}=r.useContext(U),[{status:n,...i},a]=e.useState({status:"idle"}),l=D3(),o=r.useCallback(async()=>{try{const s=await l.getNonce();a(A=>({...A,nonce:s}))}catch{a(s=>({...s,errorMessage:E.t("sign_in.message.preparing_error"),status:"idle"}))}},[l,E.t]),C=r.useRef(!1);e.useEffect(()=>{C.current||(C.current=!0,o())},[o]);const M=O(),{address:c}=J(),{chain:d}=eu(),{signMessageAsync:D}=H4(),L=async()=>{try{const s=d?.id,{nonce:A}=i;if(!c||!s||!A)return;a(N=>({...N,errorMessage:void 0,status:"signing"}));const j=l.createMessage({address:c,chainId:s,nonce:A});let g;try{g=await D({message:l.getMessageBody({message:j})})}catch(N){return N instanceof E3?a(B=>({...B,status:"idle"})):a(B=>({...B,errorMessage:E.t("sign_in.signature.signing_error"),status:"idle"}))}a(N=>({...N,status:"verifying"}));try{if(await l.verify({message:j,signature:g}))return;throw new Error}catch{return a(N=>({...N,errorMessage:E.t("sign_in.signature.verifying_error"),status:"idle"}))}}catch{a({errorMessage:E.t("sign_in.signature.oops_error"),status:"idle"})}};return e.createElement(t,{position:"relative"},e.createElement(t,{display:"flex",paddingRight:"16",paddingTop:"16",position:"absolute",right:"0"},e.createElement($,{onClose:u})),e.createElement(t,{alignItems:"center",display:"flex",flexDirection:"column",gap:M?"32":"24",padding:"24",paddingX:"18",style:{paddingTop:M?"60px":"36px"}},e.createElement(t,{alignItems:"center",display:"flex",flexDirection:"column",gap:M?"6":"4",style:{maxWidth:M?320:280}},e.createElement(t,{alignItems:"center",display:"flex",flexDirection:"column",gap:M?"32":"16"},e.createElement(b,{height:40,src:c4,width:40}),e.createElement(p,{color:"modalText",size:M?"20":"18",textAlign:"center",weight:"heavy"},E.t("sign_in.label"))),e.createElement(t,{alignItems:"center",display:"flex",flexDirection:"column",gap:M?"16":"12"},e.createElement(p,{color:"modalTextSecondary",size:M?"16":"14",textAlign:"center"},E.t("sign_in.description")),n==="idle"&&i.errorMessage?e.createElement(p,{color:"error",size:M?"16":"14",textAlign:"center",weight:"bold"},i.errorMessage):null)),e.createElement(t,{alignItems:M?void 0:"center",display:"flex",flexDirection:"column",gap:"8",width:"full"},e.createElement(h,{disabled:!i.nonce||n==="signing"||n==="verifying",label:i.nonce?n==="signing"?E.t("sign_in.signature.waiting"):n==="verifying"?E.t("sign_in.signature.verifying"):E.t("sign_in.message.send"):E.t("sign_in.message.preparing"),onClick:L,size:M?"large":"medium",testId:"auth-message-button"}),M?e.createElement(h,{label:"Cancel",onClick:u,size:"large",type:"secondary"}):e.createElement(t,{as:"button",borderRadius:"full",className:w({active:"shrink",hover:"grow"}),display:"block",onClick:u,paddingX:"10",paddingY:"5",rel:"noreferrer",style:{willChange:"transform"},target:"_blank",transition:"default"},e.createElement(p,{color:"closeButton",size:M?"16":"14",weight:"bold"},E.t("sign_in.message.cancel"))))))}function Ae(){const u=Mu(),E=Bu(),n=Fu()==="unauthenticated",i=r.useCallback(()=>{P(...E.map(a=>a.iconUrl),...u.map(a=>a.iconUrl).filter(Ju)),O()||(oe(),Me()),n&&P(c4)},[E,u,n]);r.useEffect(()=>{i()},[i])}var s4="WALLETCONNECT_DEEPLINK_CHOICE";function de({mobileUri:u,name:E}){localStorage.setItem(s4,JSON.stringify({href:u.split("?")[0],name:E}))}function je(){localStorage.removeItem(s4)}var A4=r.createContext(void 0),Qu="data-rk",d4=u=>({[Qu]:u||""}),Ne=u=>{if(u&&!/^[a-zA-Z0-9_]+$/.test(u))throw new Error(`Invalid ID: ${u}`);return u?`[${Qu}="${u}"]`:`[${Qu}]`},Ie=()=>{const u=r.useContext(A4);return d4(u)},Le=W0();function Gt({appInfo:u,avatar:E,chains:n,children:i,coolMode:a=!1,id:l,initialChain:o,locale:C,modalSize:M=Du.WIDE,showRecentTransactions:c=!1,theme:d=Le}){if(Ae(),H3(),J({onDisconnect:je}),typeof d=="function")throw new Error('A theme function was provided to the "theme" prop instead of a theme object. You must execute this function to get the resulting theme object.');const D=Ne(l),L={...a4,...u},s=E??H0;return e.createElement(b3,{chains:n,initialChain:o},e.createElement(G3,null,e.createElement(m3,{locale:C},e.createElement(l4.Provider,{value:a},e.createElement(f3,{modalSize:M},e.createElement(_u.Provider,{value:c},e.createElement(V3,null,e.createElement(X0.Provider,{value:s},e.createElement(au.Provider,{value:L},e.createElement(A4.Provider,{value:l},e.createElement(O3,null,e.createElement(bE,null,d?e.createElement("div",{...d4(l)},e.createElement("style",{dangerouslySetInnerHTML:{__html:[`${D}{${B0("lightMode"in d?d.lightMode:d)}}`,"darkMode"in d?`@media(prefers-color-scheme:dark){${D}{${B0(d.darkMode,{extends:d.lightMode})}}}`:null].join("")}}),i):i))))))))))))}var pe="_9pm4ki5 ju367va ju367v15 ju367v8r",Fe="_9pm4ki3 ju367v9g ju367vb2 ju367va ju367v2q ju367v8q",x0=(u,E)=>{const n=u.querySelectorAll("button:not(:disabled), a[href]");n.length!==0&&n[E==="end"?n.length-1:0].focus()};function ge(u){const E=r.useRef(null);return r.useEffect(()=>{const n=document.activeElement;return()=>{var i;(i=n.focus)==null||i.call(n)}},[]),r.useEffect(()=>{if(E.current){const n=E.current.querySelector("[data-auto-focus]");n?n.focus():E.current.focus()}},[]),e.createElement(e.Fragment,null,e.createElement("div",{onFocus:r.useCallback(()=>E.current&&x0(E.current,"end"),[]),tabIndex:0}),e.createElement("div",{ref:E,style:{outline:"none"},tabIndex:-1,...u}),e.createElement("div",{onFocus:r.useCallback(()=>E.current&&x0(E.current,"start"),[]),tabIndex:0}))}var Be=u=>u.stopPropagation();function Iu({children:u,onClose:E,open:n,titleId:i}){r.useEffect(()=>{const c=d=>n&&d.key==="Escape"&&E();return document.addEventListener("keydown",c),()=>document.removeEventListener("keydown",c)},[n,E]);const[a,l]=r.useState(!0);r.useEffect(()=>{l(getComputedStyle(window.document.body).overflow!=="hidden")},[]);const o=r.useCallback(()=>E(),[E]),C=Ie(),M=O();return e.createElement(e.Fragment,null,n?h4.createPortal(e.createElement(W4,{enabled:a},e.createElement(t,{...C},e.createElement(t,{...C,alignItems:M?"flex-end":"center","aria-labelledby":i,"aria-modal":!0,className:Fe,onClick:o,position:"fixed",role:"dialog"},e.createElement(ge,{className:pe,onClick:Be,role:"document"},u)))),document.body):null)}var xe="_1ckjpok7",ze="_1ckjpok1 ju367vb5 ju367vdq ju367vp ju367vt ju367vv ju367vek ju367va ju367v15 ju367v6c ju367v8r",ye="_1ckjpok4 _1ckjpok1 ju367vb5 ju367vdq ju367vp ju367vt ju367vv ju367vek ju367va ju367v15 ju367v6c ju367v8r",me="_1ckjpok6 ju367vq",Te="_1ckjpok3 _1ckjpok1 ju367vb5 ju367vdq ju367vp ju367vt ju367vv ju367vek ju367va ju367v15 ju367v6c ju367v8r",Se="_1ckjpok2 _1ckjpok1 ju367vb5 ju367vdq ju367vp ju367vt ju367vv ju367vek ju367va ju367v15 ju367v6c ju367v8r";function Lu({bottomSheetOnMobile:u=!1,children:E,marginTop:n,padding:i="16",paddingBottom:a,wide:l=!1}){const o=O(),M=r.useContext(gu)===Du.COMPACT;return e.createElement(t,{marginTop:n},e.createElement(t,{className:[l?o?Se:M?ye:Te:ze,o?me:null,o&&u?xe:null].join(" ")},e.createElement(t,{padding:i,paddingBottom:a??i},E)))}var z0=["k","m","b","t"];function ju(u,E=1){return u.toString().replace(new RegExp(`(.+\\.\\d{${E}})\\d+`),"$1").replace(/(\.[1-9]*)0+$/,"$1").replace(/\.$/,"")}function j4(u){if(u<1)return ju(u,3);if(u<10**2)return ju(u,2);if(u<10**4)return new Intl.NumberFormat().format(parseFloat(ju(u,1)));const E=10**1;let n=String(u);for(let i=z0.length-1;i>=0;i--){const a=10**((i+1)*3);if(a<=u){u=u*E/a/E,n=ju(u,1)+z0[i];break}}return n}function N4(u){return u.length<8?u:`${u.substring(0,4)}…${u.substring(u.length-4)}`}function I4(u){const E=u.split("."),n=E.pop();return E.join(".").length>24?`${E.join(".").substring(0,24)}...`:`${E.join(".")}.${n}`}var ke=()=>e.createElement("svg",{fill:"none",height:"13",viewBox:"0 0 13 13",width:"13",xmlns:"http://www.w3.org/2000/svg"},e.createElement("title",null,"Copied"),e.createElement("path",{d:"M4.94568 12.2646C5.41052 12.2646 5.77283 12.0869 6.01892 11.7109L12.39 1.96973C12.5677 1.69629 12.6429 1.44336 12.6429 1.2041C12.6429 0.561523 12.1644 0.0966797 11.5082 0.0966797C11.057 0.0966797 10.7767 0.260742 10.5033 0.691406L4.9115 9.50977L2.07458 5.98926C1.82166 5.68848 1.54822 5.55176 1.16541 5.55176C0.502319 5.55176 0.0238037 6.02344 0.0238037 6.66602C0.0238037 6.95312 0.112671 7.20605 0.358765 7.48633L3.88611 11.7588C4.18005 12.1074 4.50818 12.2646 4.94568 12.2646Z",fill:"currentColor"})),we=()=>e.createElement("svg",{fill:"none",height:"16",viewBox:"0 0 17 16",width:"17",xmlns:"http://www.w3.org/2000/svg"},e.createElement("title",null,"Copy"),e.createElement("path",{d:"M3.04236 12.3027H4.18396V13.3008C4.18396 14.8525 5.03845 15.7002 6.59705 15.7002H13.6244C15.183 15.7002 16.0375 14.8525 16.0375 13.3008V6.24609C16.0375 4.69434 15.183 3.84668 13.6244 3.84668H12.4828V2.8418C12.4828 1.29688 11.6283 0.442383 10.0697 0.442383H3.04236C1.48376 0.442383 0.629272 1.29004 0.629272 2.8418V9.90332C0.629272 11.4551 1.48376 12.3027 3.04236 12.3027ZM3.23376 10.5391C2.68689 10.5391 2.39294 10.2656 2.39294 9.68457V3.06055C2.39294 2.47949 2.68689 2.21289 3.23376 2.21289H9.8783C10.4252 2.21289 10.7191 2.47949 10.7191 3.06055V3.84668H6.59705C5.03845 3.84668 4.18396 4.69434 4.18396 6.24609V10.5391H3.23376ZM6.78845 13.9365C6.24158 13.9365 5.94763 13.6699 5.94763 13.0889V6.45801C5.94763 5.87695 6.24158 5.61035 6.78845 5.61035H13.433C13.9799 5.61035 14.2738 5.87695 14.2738 6.45801V13.0889C14.2738 13.6699 13.9799 13.9365 13.433 13.9365H6.78845Z",fill:"currentColor"})),be=()=>e.createElement("svg",{fill:"none",height:"16",viewBox:"0 0 18 16",width:"18",xmlns:"http://www.w3.org/2000/svg"},e.createElement("title",null,"Disconnect"),e.createElement("path",{d:"M2.67834 15.5908H9.99963C11.5514 15.5908 12.399 14.7432 12.399 13.1777V10.2656H10.6354V12.9863C10.6354 13.5332 10.3688 13.8271 9.78772 13.8271H2.89026C2.3092 13.8271 2.0426 13.5332 2.0426 12.9863V3.15625C2.0426 2.60254 2.3092 2.30859 2.89026 2.30859H9.78772C10.3688 2.30859 10.6354 2.60254 10.6354 3.15625V5.89746H12.399V2.95801C12.399 1.39941 11.5514 0.544922 9.99963 0.544922H2.67834C1.12659 0.544922 0.278931 1.39941 0.278931 2.95801V13.1777C0.278931 14.7432 1.12659 15.5908 2.67834 15.5908ZM7.43616 8.85059H14.0875L15.0924 8.78906L14.566 9.14453L13.6842 9.96484C13.5406 10.1016 13.4586 10.2861 13.4586 10.4844C13.4586 10.8398 13.7321 11.168 14.1217 11.168C14.3199 11.168 14.4635 11.0928 14.6002 10.9561L16.7809 8.68652C16.986 8.48145 17.0543 8.27637 17.0543 8.06445C17.0543 7.85254 16.986 7.64746 16.7809 7.43555L14.6002 5.17285C14.4635 5.03613 14.3199 4.9541 14.1217 4.9541C13.7321 4.9541 13.4586 5.27539 13.4586 5.6377C13.4586 5.83594 13.5406 6.02734 13.6842 6.15723L14.566 6.98438L15.0924 7.33984L14.0875 7.27148H7.43616C7.01917 7.27148 6.65686 7.62012 6.65686 8.06445C6.65686 8.50195 7.01917 8.85059 7.43616 8.85059Z",fill:"currentColor"}));function Ue(){const u=t4(),{address:E}=J(),n=Xu();return r.useCallback(()=>{if(!E||!n)throw new Error("No address or chain ID found");u.clearTransactions(E,n)},[u,E,n])}var L4=u=>{var E,n;return(n=(E=u?.blockExplorers)==null?void 0:E.default)==null?void 0:n.url},p4=()=>e.createElement("svg",{fill:"none",height:"19",viewBox:"0 0 20 19",width:"20",xmlns:"http://www.w3.org/2000/svg"},e.createElement("title",null,"Link"),e.createElement("path",{d:"M10 18.9443C15.0977 18.9443 19.2812 14.752 19.2812 9.6543C19.2812 4.56543 15.0889 0.373047 10 0.373047C4.90234 0.373047 0.71875 4.56543 0.71875 9.6543C0.71875 14.752 4.91113 18.9443 10 18.9443ZM10 16.6328C6.1416 16.6328 3.03906 13.5215 3.03906 9.6543C3.03906 5.7959 6.13281 2.68457 10 2.68457C13.8584 2.68457 16.9697 5.7959 16.9697 9.6543C16.9785 13.5215 13.8672 16.6328 10 16.6328ZM12.7158 12.1416C13.2432 12.1416 13.5684 11.7549 13.5684 11.1836V7.19336C13.5684 6.44629 13.1377 6.05957 12.417 6.05957H8.40918C7.8291 6.05957 7.45117 6.38477 7.45117 6.91211C7.45117 7.43945 7.8291 7.77344 8.40918 7.77344H9.69238L10.7207 7.63281L9.53418 8.67871L6.73047 11.4912C6.53711 11.6758 6.41406 11.9395 6.41406 12.2031C6.41406 12.7832 6.85352 13.1699 7.39844 13.1699C7.68848 13.1699 7.92578 13.0732 8.1543 12.8623L10.9316 10.0762L11.9775 8.89844L11.8545 9.98828V11.1836C11.8545 11.7725 12.1885 12.1416 12.7158 12.1416Z",fill:"currentColor"})),Ze=()=>e.createElement("svg",{fill:"none",height:"19",viewBox:"0 0 20 19",width:"20",xmlns:"http://www.w3.org/2000/svg"},e.createElement("title",null,"Cancel"),e.createElement("path",{d:"M10 18.9443C15.0977 18.9443 19.2812 14.752 19.2812 9.6543C19.2812 4.56543 15.0889 0.373047 10 0.373047C4.90234 0.373047 0.71875 4.56543 0.71875 9.6543C0.71875 14.752 4.91113 18.9443 10 18.9443ZM10 16.6328C6.1416 16.6328 3.03906 13.5215 3.03906 9.6543C3.03906 5.7959 6.13281 2.68457 10 2.68457C13.8584 2.68457 16.9697 5.7959 16.9697 9.6543C16.9785 13.5215 13.8672 16.6328 10 16.6328ZM7.29297 13.3018C7.58301 13.3018 7.81152 13.2139 7.99609 13.0205L10 11.0166L12.0127 13.0205C12.1973 13.2051 12.4258 13.3018 12.707 13.3018C13.2432 13.3018 13.6562 12.8887 13.6562 12.3525C13.6562 12.0977 13.5508 11.8691 13.3662 11.6934L11.3535 9.67188L13.375 7.6416C13.5596 7.44824 13.6562 7.22852 13.6562 6.98242C13.6562 6.44629 13.2432 6.0332 12.7158 6.0332C12.4346 6.0332 12.2148 6.12109 12.0215 6.31445L10 8.32715L7.9873 6.32324C7.80273 6.12988 7.58301 6.04199 7.29297 6.04199C6.76562 6.04199 6.35254 6.45508 6.35254 6.99121C6.35254 7.2373 6.44922 7.46582 6.63379 7.6416L8.65527 9.67188L6.63379 11.6934C6.44922 11.8691 6.35254 12.1064 6.35254 12.3525C6.35254 12.8887 6.76562 13.3018 7.29297 13.3018Z",fill:"currentColor"})),Oe=()=>e.createElement("svg",{fill:"none",height:"20",viewBox:"0 0 20 20",width:"20",xmlns:"http://www.w3.org/2000/svg"},e.createElement("title",null,"Success"),e.createElement("path",{d:"M10 19.4443C15.0977 19.4443 19.2812 15.252 19.2812 10.1543C19.2812 5.06543 15.0889 0.873047 10 0.873047C4.90234 0.873047 0.71875 5.06543 0.71875 10.1543C0.71875 15.252 4.91113 19.4443 10 19.4443ZM10 17.1328C6.1416 17.1328 3.03906 14.0215 3.03906 10.1543C3.03906 6.2959 6.13281 3.18457 10 3.18457C13.8584 3.18457 16.9697 6.2959 16.9697 10.1543C16.9785 14.0215 13.8672 17.1328 10 17.1328ZM9.07715 14.3379C9.4375 14.3379 9.7627 14.1533 9.97363 13.8369L13.7441 8.00977C13.8848 7.79883 13.9814 7.5791 13.9814 7.36816C13.9814 6.84961 13.5244 6.48926 13.0322 6.48926C12.707 6.48926 12.4258 6.66504 12.2148 7.0166L9.05957 12.0967L7.5918 10.2949C7.37207 10.0225 7.13477 9.9082 6.84473 9.9082C6.33496 9.9082 5.92188 10.3125 5.92188 10.8223C5.92188 11.0684 6.00098 11.2793 6.18555 11.5078L8.1543 13.8545C8.40918 14.1709 8.70801 14.3379 9.07715 14.3379Z",fill:"currentColor"})),Ye=u=>{switch(u){case"pending":return Cu;case"confirmed":return Oe;case"failed":return Ze;default:return Cu}};function ve({tx:u}){const E=O(),n=Ye(u.status),i=u.status==="failed"?"error":"accentColor",{chain:a}=eu(),l=u.status==="confirmed"?"Confirmed":u.status==="failed"?"Failed":"Pending",o=L4(a);return e.createElement(e.Fragment,null,e.createElement(t,{...o?{as:"a",background:{hover:"profileForeground"},borderRadius:"menuButton",className:w({active:"shrink"}),href:`${o}/tx/${u.hash}`,rel:"noreferrer noopener",target:"_blank",transition:"default"}:{},color:"modalText",display:"flex",flexDirection:"row",justifyContent:"space-between",padding:"8",width:"full"},e.createElement(t,{alignItems:"center",display:"flex",flexDirection:"row",gap:E?"16":"14"},e.createElement(t,{color:i},e.createElement(n,null)),e.createElement(t,{display:"flex",flexDirection:"column",gap:E?"3":"1"},e.createElement(t,null,e.createElement(p,{color:"modalText",font:"body",size:E?"16":"14",weight:"bold"},u?.description)),e.createElement(t,null,e.createElement(p,{color:u.status==="pending"?"modalTextSecondary":i,font:"body",size:"14",weight:E?"medium":"regular"},l)))),o&&e.createElement(t,{alignItems:"center",color:"modalTextDim",display:"flex"},e.createElement(p4,null))))}var he=3;function We({address:u}){const E=i4(),n=Ue(),{chain:i}=eu(),a=L4(i),l=E.slice(0,he),o=l.length>0,C=O(),{appName:M}=r.useContext(au),{i18n:c}=r.useContext(U);return e.createElement(e.Fragment,null,e.createElement(t,{display:"flex",flexDirection:"column",gap:"10",paddingBottom:"2",paddingTop:"16",paddingX:C?"8":"18"},o&&e.createElement(t,{paddingBottom:C?"4":"0",paddingTop:"8",paddingX:C?"12":"6"},e.createElement(t,{display:"flex",justifyContent:"space-between"},e.createElement(p,{color:"modalTextSecondary",size:C?"16":"14",weight:"semibold"},c.t("profile.transactions.recent.title")),e.createElement(t,{style:{marginBottom:-6,marginLeft:-10,marginRight:-10,marginTop:-6}},e.createElement(t,{as:"button",background:{hover:"profileForeground"},borderRadius:"actionButton",className:w({active:"shrink"}),onClick:n,paddingX:C?"8":"12",paddingY:C?"4":"5",transition:"default",type:"button"},e.createElement(p,{color:"modalTextSecondary",size:C?"16":"14",weight:"semibold"},c.t("profile.transactions.clear.label")))))),e.createElement(t,{display:"flex",flexDirection:"column",gap:"4"},o?l.map(d=>e.createElement(ve,{key:d.hash,tx:d})):e.createElement(e.Fragment,null,e.createElement(t,{padding:C?"12":"8"},e.createElement(p,{color:"modalTextDim",size:C?"16":"14",weight:C?"medium":"bold"},M?c.t("profile.transactions.description",{appName:M}):c.t("profile.transactions.description_fallback"))),C&&e.createElement(t,{background:"generalBorderDim",height:"1",marginX:"12",marginY:"8"})))),a&&e.createElement(t,{paddingBottom:"18",paddingX:C?"8":"18"},e.createElement(t,{alignItems:"center",as:"a",background:{hover:"profileForeground"},borderRadius:"menuButton",className:w({active:"shrink"}),color:"modalTextDim",display:"flex",flexDirection:"row",href:`${a}/address/${u}`,justifyContent:"space-between",paddingX:"8",paddingY:"12",rel:"noreferrer noopener",style:{willChange:"transform"},target:"_blank",transition:"default",width:"full",...C?{paddingLeft:"12"}:{}},e.createElement(p,{color:"modalText",font:"body",size:C?"16":"14",weight:C?"semibold":"bold"},c.t("profile.explorer.label")),e.createElement(p4,null))))}function y0({action:u,icon:E,label:n,testId:i,url:a}){const l=O();return e.createElement(t,{...a?{as:"a",href:a,rel:"noreferrer noopener",target:"_blank"}:{as:"button",type:"button"},background:{base:"profileAction",...l?{}:{hover:"profileActionHover"}},borderRadius:"menuButton",boxShadow:"profileDetailsAction",className:w({active:"shrinkSm",hover:l?void 0:"grow"}),display:"flex",onClick:u,padding:l?"6":"8",style:{willChange:"transform"},testId:i,transition:"default",width:"full"},e.createElement(t,{alignItems:"center",display:"flex",flexDirection:"column",gap:"1",justifyContent:"center",paddingTop:"2",width:"full"},e.createElement(t,{color:"modalText",height:"max"},E),e.createElement(t,null,e.createElement(p,{color:"modalText",size:l?"12":"13",weight:"semibold"},n))))}function Qe({address:u,ensAvatar:E,ensName:n,onClose:i,onDisconnect:a}){const l=r.useContext(_u),{data:o}=O0({address:u}),[C,M]=r.useState(!1),c=r.useCallback(()=>{u&&(navigator.clipboard.writeText(u),M(!0))},[u]);if(r.useEffect(()=>{if(C){const g=setTimeout(()=>{M(!1)},1500);return()=>clearTimeout(g)}},[C]),!u)return null;const d=n?I4(n):N4(u),D=o?.formatted,L=D?j4(parseFloat(D)):void 0,s="rk_profile_title",A=O(),{i18n:j}=r.useContext(U);return e.createElement(e.Fragment,null,e.createElement(t,{display:"flex",flexDirection:"column"},e.createElement(t,{background:"profileForeground",padding:"16"},e.createElement(t,{alignItems:"center",display:"flex",flexDirection:"column",gap:A?"16":"12",justifyContent:"center",margin:"8",style:{textAlign:"center"}},e.createElement(t,{style:{position:"absolute",right:16,top:16,willChange:"transform"}},e.createElement($,{onClose:i}))," ",e.createElement(t,{marginTop:A?"24":"0"},e.createElement(_0,{address:u,imageUrl:E,size:A?82:74})),e.createElement(t,{display:"flex",flexDirection:"column",gap:A?"4":"0",textAlign:"center"},e.createElement(t,{textAlign:"center"},e.createElement(p,{as:"h1",color:"modalText",id:s,size:A?"20":"18",weight:"heavy"},d)),o&&e.createElement(t,{textAlign:"center"},e.createElement(p,{as:"h1",color:"modalTextSecondary",id:s,size:A?"16":"14",weight:"semibold"},L," ",o.symbol)))),e.createElement(t,{display:"flex",flexDirection:"row",gap:"8",margin:"2",marginTop:"16"},e.createElement(y0,{action:c,icon:C?e.createElement(ke,null):e.createElement(we,null),label:C?j.t("profile.copy_address.copied"):j.t("profile.copy_address.label")}),e.createElement(y0,{action:a,icon:e.createElement(be,null),label:j.t("profile.disconnect.label"),testId:"disconnect-button"}))),l&&e.createElement(e.Fragment,null,e.createElement(t,{background:"generalBorder",height:"1",marginTop:"-1"}),e.createElement(t,null,e.createElement(We,{address:u})))))}function Ve({onClose:u,open:E}){const{address:n}=J(),i=e4(n),a=u4(i),{disconnect:l}=Ru();return n?e.createElement(e.Fragment,null,n&&e.createElement(Iu,{onClose:u,open:E,titleId:"rk_account_modal_title"},e.createElement(Lu,{bottomSheetOnMobile:!0,padding:"0"},e.createElement(Qe,{address:n,ensAvatar:a,ensName:i,onClose:u,onDisconnect:l})))):null}var Re=({size:u})=>e.createElement("svg",{fill:"none",height:u,viewBox:"0 0 28 28",width:u,xmlns:"http://www.w3.org/2000/svg"},e.createElement("title",null,"Disconnect"),e.createElement("path",{d:"M6.742 22.195h8.367c1.774 0 2.743-.968 2.743-2.758V16.11h-2.016v3.11c0 .625-.305.96-.969.96H6.984c-.664 0-.968-.335-.968-.96V7.984c0-.632.304-.968.968-.968h7.883c.664 0 .969.336.969.968v3.133h2.016v-3.36c0-1.78-.97-2.757-2.743-2.757H6.742C4.97 5 4 5.977 4 7.758v11.68c0 1.789.969 2.757 2.742 2.757Zm5.438-7.703h7.601l1.149-.07-.602.406-1.008.938a.816.816 0 0 0-.258.593c0 .407.313.782.758.782.227 0 .39-.086.547-.243l2.492-2.593c.235-.235.313-.47.313-.711 0-.242-.078-.477-.313-.719l-2.492-2.586c-.156-.156-.32-.25-.547-.25-.445 0-.758.367-.758.781 0 .227.094.446.258.594l1.008.945.602.407-1.149-.079H12.18a.904.904 0 0 0 0 1.805Z",fill:"currentColor"})),Ge="v9horb0",Vu=e.forwardRef(({children:u,currentlySelected:E=!1,onClick:n,testId:i,...a},l)=>{const o=O();return e.createElement(t,{as:"button",borderRadius:"menuButton",disabled:E,display:"flex",onClick:n,ref:l,testId:i,type:"button"},e.createElement(t,{borderRadius:"menuButton",className:[o?Ge:void 0,!E&&w({active:"shrink"})],padding:o?"8":"6",transition:"default",width:"full",...E?{background:"accentColor",borderColor:"selectedOptionBorder",borderStyle:"solid",borderWidth:"1",boxShadow:"selectedOption",color:"accentColorForeground"}:{background:{hover:"menuItemBackground"},color:"modalText",transition:"default"},...a},u))});Vu.displayName="MenuButton";var fe="_18dqw9x0",Pe="_18dqw9x1";function Je({onClose:u,open:E}){var n;const{chain:i}=eu(),{chains:a,pendingChainId:l,reset:o,switchNetwork:C}=P4({onSettled:()=>{o(),u()}}),{i18n:M}=r.useContext(U),{disconnect:c}=Ru(),d="rk_chain_modal_title",D=O(),L=(n=i?.unsupported)!=null?n:!1,s=D?"36":"28",{appName:A}=r.useContext(au),j=Mu();return!i||!i?.id?null:e.createElement(Iu,{onClose:u,open:E,titleId:d},e.createElement(Lu,{bottomSheetOnMobile:!0,paddingBottom:"0"},e.createElement(t,{display:"flex",flexDirection:"column",gap:"14"},e.createElement(t,{display:"flex",flexDirection:"row",justifyContent:"space-between"},D&&e.createElement(t,{width:"30"}),e.createElement(t,{paddingBottom:"0",paddingLeft:"8",paddingTop:"4"},e.createElement(p,{as:"h1",color:"modalText",id:d,size:D?"20":"18",weight:"heavy"},M.t("chains.title"))),e.createElement($,{onClose:u})),L&&e.createElement(t,{marginX:"8",textAlign:D?"center":"left"},e.createElement(p,{color:"modalTextSecondary",size:"14",weight:"medium"},M.t("chains.wrong_network"))),e.createElement(t,{className:D?Pe:fe,display:"flex",flexDirection:"column",gap:"4",padding:"2",paddingBottom:"16"},C?j.map(({iconBackground:g,iconUrl:N,id:B,name:F},I)=>{const z=a.find(Q=>Q.id===B);if(!z)return null;const y=z.id===i?.id,S=!y&&z.id===l;return e.createElement(r.Fragment,{key:z.id},e.createElement(Vu,{currentlySelected:y,onClick:y?void 0:()=>C(z.id),testId:`chain-option-${z.id}`},e.createElement(t,{fontFamily:"body",fontSize:"16",fontWeight:"bold"},e.createElement(t,{alignItems:"center",display:"flex",flexDirection:"row",justifyContent:"space-between"},e.createElement(t,{alignItems:"center",display:"flex",flexDirection:"row",gap:"4",height:s},N&&e.createElement(t,{height:"full",marginRight:"8"},e.createElement(b,{alt:F??z.name,background:g,borderRadius:"full",height:s,src:N,width:s,testId:`chain-option-${z.id}-icon`})),e.createElement("div",null,F??z.name)),y&&e.createElement(t,{alignItems:"center",display:"flex",flexDirection:"row",marginRight:"6"},e.createElement(p,{color:"accentColorForeground",size:"14",weight:"medium"},M.t("chains.connected")),e.createElement(t,{background:"connectionIndicator",borderColor:"selectedOptionBorder",borderRadius:"full",borderStyle:"solid",borderWidth:"1",height:"8",marginLeft:"8",width:"8"})),S&&e.createElement(t,{alignItems:"center",display:"flex",flexDirection:"row",marginRight:"6"},e.createElement(p,{color:"modalText",size:"14",weight:"medium"},M.t("chains.confirm")),e.createElement(t,{background:"standby",borderRadius:"full",height:"8",marginLeft:"8",width:"8"}))))),D&&I<j.length-1&&e.createElement(t,{background:"generalBorderDim",height:"1",marginX:"8"}))}):e.createElement(t,{background:"generalBorder",borderRadius:"menuButton",paddingX:"18",paddingY:"12"},e.createElement(p,{color:"modalText",size:"14",weight:"medium"},A?M.t("chains.switching_not_supported",{appName:A}):M.t("chains.switching_not_supported_fallback"))),L&&e.createElement(e.Fragment,null,e.createElement(t,{background:"generalBorderDim",height:"1",marginX:"8"}),e.createElement(Vu,{onClick:()=>c(),testId:"chain-option-disconnect"},e.createElement(t,{color:"error",fontFamily:"body",fontSize:"16",fontWeight:"bold"},e.createElement(t,{alignItems:"center",display:"flex",flexDirection:"row",justifyContent:"space-between"},e.createElement(t,{alignItems:"center",display:"flex",flexDirection:"row",gap:"4",height:s},e.createElement(t,{alignItems:"center",color:"error",height:s,justifyContent:"center",marginRight:"8"},e.createElement(Re,{size:Number(s)})),e.createElement("div",null,M.t("chains.disconnect")))))))))))}function He(u,E){const n={};for(const i of u){const a=E(i);a&&(n[a]||(n[a]=[]),n[a].push(i))}return n}var Xe="rk-latest-id";function _e(u){localStorage.setItem(Xe,u)}var e0=({children:u,href:E})=>e.createElement(t,{as:"a",color:"accentColor",href:E,rel:"noreferrer",target:"_blank"},u),E0=({children:u})=>e.createElement(p,{color:"modalTextSecondary",size:"12",weight:"medium"},u);function m0({compactModeEnabled:u=!1,getWallet:E}){const{disclaimer:n,learnMoreUrl:i}=r.useContext(au),{i18n:a}=r.useContext(U);return e.createElement(e.Fragment,null,e.createElement(t,{alignItems:"center",color:"accentColor",display:"flex",flexDirection:"column",height:"full",justifyContent:"space-around"},e.createElement(t,{marginBottom:"10"},!u&&e.createElement(p,{color:"modalText",size:"18",weight:"heavy"},a.t("intro.title"))),e.createElement(t,{display:"flex",flexDirection:"column",gap:"32",justifyContent:"center",marginY:"20",style:{maxWidth:312}},e.createElement(t,{alignItems:"center",display:"flex",flexDirection:"row",gap:"16"},e.createElement(t,{borderRadius:"6",height:"48",minWidth:"48",width:"48"},e.createElement(Ce,null)),e.createElement(t,{display:"flex",flexDirection:"column",gap:"4"},e.createElement(p,{color:"modalText",size:"14",weight:"bold"},a.t("intro.digital_asset.title")),e.createElement(p,{color:"modalTextSecondary",size:"14",weight:"medium"},a.t("intro.digital_asset.description")))),e.createElement(t,{alignItems:"center",display:"flex",flexDirection:"row",gap:"16"},e.createElement(t,{borderRadius:"6",height:"48",minWidth:"48",width:"48"},e.createElement(re,null)),e.createElement(t,{display:"flex",flexDirection:"column",gap:"4"},e.createElement(p,{color:"modalText",size:"14",weight:"bold"},a.t("intro.login.title")),e.createElement(p,{color:"modalTextSecondary",size:"14",weight:"medium"},a.t("intro.login.description"))))),e.createElement(t,{alignItems:"center",display:"flex",flexDirection:"column",gap:"12",justifyContent:"center",margin:"10"},e.createElement(h,{label:a.t("intro.get.label"),onClick:E}),e.createElement(t,{as:"a",className:w({active:"shrink",hover:"grow"}),display:"block",href:i,paddingX:"12",paddingY:"4",rel:"noreferrer",style:{willChange:"transform"},target:"_blank",transition:"default"},e.createElement(p,{color:"accentColor",size:"14",weight:"bold"},a.t("intro.learn_more.label")))),n&&!u&&e.createElement(t,{marginBottom:"8",marginTop:"12",textAlign:"center"},e.createElement(n,{Link:e0,Text:E0}))))}var F4=()=>e.createElement("svg",{fill:"none",height:"17",viewBox:"0 0 11 17",width:"11",xmlns:"http://www.w3.org/2000/svg"},e.createElement("title",null,"Back"),e.createElement("path",{d:"M0.99707 8.6543C0.99707 9.08496 1.15527 9.44531 1.51562 9.79688L8.16016 16.3096C8.43262 16.5732 8.74902 16.7051 9.13574 16.7051C9.90918 16.7051 10.5508 16.0811 10.5508 15.3076C10.5508 14.9121 10.3838 14.5605 10.0938 14.2705L4.30176 8.64551L10.0938 3.0293C10.3838 2.74805 10.5508 2.3877 10.5508 2.00098C10.5508 1.23633 9.90918 0.603516 9.13574 0.603516C8.74902 0.603516 8.43262 0.735352 8.16016 0.999023L1.51562 7.51172C1.15527 7.85449 1.00586 8.21484 0.99707 8.6543Z",fill:"currentColor"})),qe=()=>e.createElement("svg",{fill:"none",height:"12",viewBox:"0 0 8 12",width:"8",xmlns:"http://www.w3.org/2000/svg"},e.createElement("title",null,"Info"),e.createElement("path",{d:"M3.64258 7.99609C4.19336 7.99609 4.5625 7.73828 4.68555 7.24609C4.69141 7.21094 4.70312 7.16406 4.70898 7.13477C4.80859 6.60742 5.05469 6.35547 6.04492 5.76367C7.14648 5.10156 7.67969 4.3457 7.67969 3.24414C7.67969 1.39844 6.17383 0.255859 3.95898 0.255859C2.32422 0.255859 1.05859 0.894531 0.548828 1.86719C0.396484 2.14844 0.320312 2.44727 0.320312 2.74023C0.314453 3.37305 0.742188 3.79492 1.42188 3.79492C1.91406 3.79492 2.33594 3.54883 2.53516 3.11523C2.78711 2.47656 3.23242 2.21289 3.83594 2.21289C4.55664 2.21289 5.10742 2.65234 5.10742 3.29102C5.10742 3.9707 4.7793 4.29883 3.81836 4.87891C3.02148 5.36523 2.50586 5.92773 2.50586 6.76562V6.90039C2.50586 7.55664 2.96289 7.99609 3.64258 7.99609ZM3.67188 11.4473C4.42773 11.4473 5.04297 10.8672 5.04297 10.1406C5.04297 9.41406 4.42773 8.83984 3.67188 8.83984C2.91602 8.83984 2.30664 9.41406 2.30664 10.1406C2.30664 10.8672 2.91602 11.4473 3.67188 11.4473Z",fill:"currentColor"})),Ke=({"aria-label":u="Info",onClick:E})=>{const n=O();return e.createElement(t,{alignItems:"center","aria-label":u,as:"button",background:"closeButtonBackground",borderColor:"actionButtonBorder",borderRadius:"full",borderStyle:"solid",borderWidth:n?"0":"1",className:w({active:"shrinkSm",hover:"growLg"}),color:"closeButton",display:"flex",height:n?"30":"28",justifyContent:"center",onClick:E,style:{willChange:"transform"},transition:"default",type:"button",width:n?"30":"28"},e.createElement(qe,null))},g4=u=>{const E=r.useRef(null),n=r.useContext(l4),i=Pu(u);return r.useEffect(()=>{if(n&&E.current&&i)return uE(E.current,i)},[n,i]),E},$e=()=>{const u="_rk_coolMode",E=document.getElementById(u);if(E)return E;const n=document.createElement("div");return n.setAttribute("id",u),n.setAttribute("style",["overflow:hidden","position:fixed","height:100%","top:0","left:0","right:0","bottom:0","pointer-events:none","z-index:2147483647"].join(";")),document.body.appendChild(n),n},T0=0;function uE(u,E){T0++;const n=[15,20,25,35,45],i=35;let a=[],l=!1,o=0,C=0;const M=$e();function c(){const I=n[Math.floor(Math.random()*n.length)],z=Math.random()*10,y=Math.random()*25,S=Math.random()*360,Q=Math.random()*35*(Math.random()<=.5?-1:1),k=C-I/2,X=o-I/2,Eu=Math.random()<=.5?-1:1,V=document.createElement("div");V.innerHTML=`<img src="${E}" width="${I}" height="${I}" style="border-radius: 25%">`,V.setAttribute("style",["position:absolute","will-change:transform",`top:${k}px`,`left:${X}px`,`transform:rotate(${S}deg)`].join(";")),M.appendChild(V),a.push({direction:Eu,element:V,left:X,size:I,speedHorz:z,speedUp:y,spinSpeed:Q,spinVal:S,top:k})}function d(){for(const I of a)I.left=I.left-I.speedHorz*I.direction,I.top=I.top-I.speedUp,I.speedUp=Math.min(I.size,I.speedUp-1),I.spinVal=I.spinVal+I.spinSpeed,I.top>=Math.max(window.innerHeight,document.body.clientHeight)+I.size&&(a=a.filter(z=>z!==I),I.element.remove()),I.element.setAttribute("style",["position:absolute","will-change:transform",`top:${I.top}px`,`left:${I.left}px`,`transform:rotate(${I.spinVal}deg)`].join(";"))}let D;function L(){l&&a.length<i&&c(),d(),D=requestAnimationFrame(L)}L();const s="ontouchstart"in window||navigator.msMaxTouchPoints,A=s?"touchstart":"mousedown",j=s?"touchend":"mouseup",g=s?"touchmove":"mousemove",N=I=>{var z,y;"touches"in I?(o=(z=I.touches)==null?void 0:z[0].clientX,C=(y=I.touches)==null?void 0:y[0].clientY):(o=I.clientX,C=I.clientY)},B=I=>{N(I),l=!0},F=()=>{l=!1};return u.addEventListener(g,N,{passive:!1}),u.addEventListener(A,B),u.addEventListener(j,F),u.addEventListener("mouseleave",F),()=>{u.removeEventListener(g,N),u.removeEventListener(A,B),u.removeEventListener(j,F),u.removeEventListener("mouseleave",F);const I=setInterval(()=>{D&&a.length===0&&(cancelAnimationFrame(D),clearInterval(I),--T0===0&&M.remove())},500)}}var eE="g5kl0l0",B4=({as:u="button",currentlySelected:E=!1,iconBackground:n,iconUrl:i,name:a,onClick:l,ready:o,recent:C,testId:M,...c})=>{const d=g4(i),[D,L]=r.useState(!1),{i18n:s}=r.useContext(U);return e.createElement(t,{display:"flex",flexDirection:"column",onMouseEnter:()=>L(!0),onMouseLeave:()=>L(!1),ref:d},e.createElement(t,{as:u,borderRadius:"menuButton",borderStyle:"solid",borderWidth:"1",className:E?void 0:[eE,w({active:"shrink"})],disabled:E,onClick:l,padding:"5",style:{willChange:"transform"},testId:M,transition:"default",width:"full",...E?{background:"accentColor",borderColor:"selectedOptionBorder",boxShadow:"selectedWallet"}:{background:{hover:"menuItemBackground"}},...c},e.createElement(t,{color:E?"accentColorForeground":"modalText",disabled:!o,fontFamily:"body",fontSize:"16",fontWeight:"bold",transition:"default"},e.createElement(t,{alignItems:"center",display:"flex",flexDirection:"row",gap:"12"},e.createElement(b,{background:n,...D?{}:{borderColor:"actionButtonBorder"},borderRadius:"6",height:"28",src:i,width:"28"}),e.createElement(t,null,e.createElement(t,{style:{marginTop:C?-2:void 0}},a),C&&e.createElement(p,{color:E?"accentColorForeground":"accentColor",size:"12",style:{lineHeight:1,marginTop:-1},weight:"medium"},s.t("connect.recent")))))))};B4.displayName="ModalSelection";var Uu=(u,E=1)=>{let n=u.replace("#","");n.length===3&&(n=`${n[0]}${n[0]}${n[1]}${n[1]}${n[2]}${n[2]}`);const i=parseInt(n.substring(0,2),16),a=parseInt(n.substring(2,4),16),l=parseInt(n.substring(4,6),16);return E>1&&E<=100&&(E=E/100),`rgba(${i},${a},${l},${E})`},EE=u=>u?[Uu(u,.2),Uu(u,.14),Uu(u,.1)]:null,nE=u=>/^#([0-9a-f]{3}){1,2}$/i.test(u),x4=async()=>(await x(async()=>{const{default:u}=await Promise.resolve().then(()=>Hn);return{default:u}},void 0)).default,tE=()=>P(x4),iE=()=>e.createElement(b,{background:"#515a70",borderColor:"generalBorder",borderRadius:"10",height:"48",src:x4,width:"48"}),z4=async()=>(await x(async()=>{const{default:u}=await Promise.resolve().then(()=>_n);return{default:u}},void 0)).default,y4=()=>P(z4),aE=()=>e.createElement(b,{background:"#e3a5e8",borderColor:"generalBorder",borderRadius:"10",height:"48",src:z4,width:"48"}),m4=async()=>(await x(async()=>{const{default:u}=await Promise.resolve().then(()=>Kn);return{default:u}},void 0)).default,lE=()=>P(m4),oE=()=>e.createElement(b,{background:"#515a70",borderColor:"generalBorder",borderRadius:"10",height:"48",src:m4,width:"48"}),T4=async()=>(await x(async()=>{const{default:u}=await Promise.resolve().then(()=>ut);return{default:u}},void 0)).default,S4=()=>P(T4),CE=()=>e.createElement(b,{background:"#515a70",borderColor:"generalBorder",borderRadius:"10",height:"48",src:T4,width:"48"}),ME="_1vwt0cg0",rE="_1vwt0cg2 ju367v7a ju367v7v",DE="_1vwt0cg3",cE="_1vwt0cg4",sE=(u,E)=>{const n=Array.prototype.slice.call(u3.create(u,{errorCorrectionLevel:E}).modules.data,0),i=Math.sqrt(n.length);return n.reduce((a,l,o)=>(o%i===0?a.push([l]):a[a.length-1].push(l))&&a,[])};function k4({ecl:u="M",logoBackground:E,logoMargin:n=10,logoSize:i=50,logoUrl:a,size:l=200,uri:o}){const C="20",M=l-parseInt(C,10)*2,c=r.useMemo(()=>{const L=[],s=sE(o,u),A=M/s.length;[{x:0,y:0},{x:1,y:0},{x:0,y:1}].forEach(({x:F,y:I})=>{const z=(s.length-7)*A*F,y=(s.length-7)*A*I;for(let S=0;S<3;S++)L.push(e.createElement("rect",{fill:S%2!==0?"white":"black",height:A*(7-S*2),key:`${S}-${F}-${I}`,rx:(S-2)*-5+(S===0?2:0),ry:(S-2)*-5+(S===0?2:0),width:A*(7-S*2),x:z+A*S,y:y+A*S}))});const g=Math.floor((i+25)/A),N=s.length/2-g/2,B=s.length/2+g/2-1;return s.forEach((F,I)=>{F.forEach((z,y)=>{s[I][y]&&(I<7&&y<7||I>s.length-8&&y<7||I<7&&y>s.length-8||I>N&&I<B&&y>N&&y<B||L.push(e.createElement("circle",{cx:I*A+A/2,cy:y*A+A/2,fill:"black",key:`circle-${I}-${y}`,r:A/3})))})}),L},[u,i,M,o]),d=M/2-i/2,D=i+n*2;return e.createElement(t,{borderColor:"generalBorder",borderRadius:"menuButton",borderStyle:"solid",borderWidth:"1",className:ME,padding:C,width:"max"},e.createElement(t,{style:{height:M,userSelect:"none",width:M},userSelect:"none"},e.createElement(t,{display:"flex",justifyContent:"center",position:"relative",style:{height:0,top:d,width:M},width:"full"},e.createElement(b,{background:E,borderColor:{custom:"rgba(0, 0, 0, 0.06)"},borderRadius:"13",height:i,src:a,width:i})),e.createElement("svg",{height:M,style:{all:"revert"},width:M},e.createElement("title",null,"QR Code"),e.createElement("defs",null,e.createElement("clipPath",{id:"clip-wrapper"},e.createElement("rect",{height:D,width:D})),e.createElement("clipPath",{id:"clip-logo"},e.createElement("rect",{height:i,width:i}))),e.createElement("rect",{fill:"transparent",height:M,width:M}),c)))}var w4=async()=>{switch(Ku()){case"Arc":return(await x(async()=>{const{default:E}=await Promise.resolve().then(()=>Et);return{default:E}},void 0)).default;case"Brave":return(await x(async()=>{const{default:E}=await Promise.resolve().then(()=>tt);return{default:E}},void 0)).default;case"Chrome":return(await x(async()=>{const{default:E}=await Promise.resolve().then(()=>at);return{default:E}},void 0)).default;case"Edge":return(await x(async()=>{const{default:E}=await Promise.resolve().then(()=>ot);return{default:E}},void 0)).default;case"Firefox":return(await x(async()=>{const{default:E}=await Promise.resolve().then(()=>Mt);return{default:E}},void 0)).default;case"Opera":return(await x(async()=>{const{default:E}=await Promise.resolve().then(()=>Dt);return{default:E}},void 0)).default;case"Safari":return(await x(async()=>{const{default:E}=await Promise.resolve().then(()=>st);return{default:E}},void 0)).default;default:return(await x(async()=>{const{default:E}=await Promise.resolve().then(()=>dt);return{default:E}},void 0)).default}},AE=()=>P(w4),b4=async()=>{switch(u0()){case"Windows":return(await x(async()=>{const{default:E}=await Promise.resolve().then(()=>Nt);return{default:E}},void 0)).default;case"macOS":return(await x(async()=>{const{default:E}=await Promise.resolve().then(()=>Lt);return{default:E}},void 0)).default;case"Linux":return(await x(async()=>{const{default:E}=await Promise.resolve().then(()=>U0);return{default:E}},void 0)).default;default:return(await x(async()=>{const{default:E}=await Promise.resolve().then(()=>U0);return{default:E}},void 0)).default}},dE=()=>P(b4);function jE({getWalletDownload:u,compactModeEnabled:E}){const i=Bu().splice(0,5),{i18n:a}=r.useContext(U);return e.createElement(t,{alignItems:"center",display:"flex",flexDirection:"column",height:"full",marginTop:"18",width:"full"},e.createElement(t,{alignItems:"center",display:"flex",flexDirection:"column",gap:"28",height:"full",width:"full"},i?.filter(l=>{var o;return l.extensionDownloadUrl||l.desktopDownloadUrl||l.qrCode&&((o=l.downloadUrls)==null?void 0:o.qrCode)}).map(l=>{const{downloadUrls:o,iconBackground:C,iconUrl:M,id:c,name:d,qrCode:D}=l,L=o?.qrCode&&D,s=!!l.extensionDownloadUrl,A=o?.qrCode&&s,j=o?.qrCode&&!!l.desktopDownloadUrl;return e.createElement(t,{alignItems:"center",display:"flex",gap:"16",justifyContent:"space-between",key:l.id,width:"full"},e.createElement(t,{alignItems:"center",display:"flex",flexDirection:"row",gap:"16"},e.createElement(b,{background:C,borderColor:"actionButtonBorder",borderRadius:"10",height:"48",src:M,width:"48"}),e.createElement(t,{display:"flex",flexDirection:"column",gap:"2"},e.createElement(p,{color:"modalText",size:"14",weight:"bold"},d),e.createElement(p,{color:"modalTextSecondary",size:"14",weight:"medium"},A?a.t("get.mobile_and_extension.description"):j?a.t("get.mobile_and_desktop.description"):L?a.t("get.mobile.description"):s?a.t("get.extension.description"):null))),e.createElement(t,{display:"flex",flexDirection:"column",gap:"4"},e.createElement(h,{label:a.t("get.action.label"),onClick:()=>u(c),type:"secondary"})))})),e.createElement(t,{alignItems:"center",borderRadius:"10",display:"flex",flexDirection:"column",gap:"8",justifyContent:"space-between",marginBottom:"4",paddingY:"8",style:{maxWidth:275,textAlign:"center"}},e.createElement(p,{color:"modalText",size:"14",weight:"bold"},a.t("get.looking_for.title")),e.createElement(p,{color:"modalTextSecondary",size:"14",weight:"medium"},E?a.t("get.looking_for.desktop.compact_description"):a.t("get.looking_for.desktop.wide_description"))))}var Zu="44";function NE({changeWalletStep:u,compactModeEnabled:E,connectionError:n,onClose:i,qrCodeUri:a,reconnect:l,wallet:o}){var C;const{downloadUrls:M,iconBackground:c,iconUrl:d,name:D,qrCode:L,ready:s,showWalletConnectModal:A}=o,j=(C=o.desktop)==null?void 0:C.getUri,g=qu(),{i18n:N}=r.useContext(U),B=!!o.extensionDownloadUrl,F=M?.qrCode&&B,I=M?.qrCode&&!!o.desktopDownloadUrl,z=L&&a,y=A?{description:E?N.t("connect.walletconnect.description.compact"):N.t("connect.walletconnect.description.full"),label:N.t("connect.walletconnect.open.label"),onClick:()=>{i(),A()}}:z?{description:N.t("connect.secondary_action.get.description",{wallet:D}),label:N.t("connect.secondary_action.get.label"),onClick:()=>u(F||I?"DOWNLOAD_OPTIONS":"DOWNLOAD")}:null,{width:S}=o4(),Q=S&&S<768;return r.useEffect(()=>{AE(),dE()},[]),e.createElement(t,{display:"flex",flexDirection:"column",height:"full",width:"full"},z?e.createElement(t,{alignItems:"center",display:"flex",height:"full",justifyContent:"center"},e.createElement(k4,{logoBackground:c,logoSize:E?60:72,logoUrl:d,size:E?318:Q?Math.max(280,Math.min(S-308,382)):382,uri:a})):e.createElement(t,{alignItems:"center",display:"flex",justifyContent:"center",style:{flexGrow:1}},e.createElement(t,{alignItems:"center",display:"flex",flexDirection:"column",gap:"8"},e.createElement(t,{borderRadius:"10",height:Zu,overflow:"hidden"},e.createElement(b,{height:Zu,src:d,width:Zu})),e.createElement(t,{alignItems:"center",display:"flex",flexDirection:"column",gap:"4",paddingX:"32",style:{textAlign:"center"}},e.createElement(p,{color:"modalText",size:"18",weight:"bold"},s?N.t("connect.status.opening",{wallet:D}):B?N.t("connect.status.not_installed",{wallet:D}):N.t("connect.status.not_available",{wallet:D})),!s&&B?e.createElement(t,{paddingTop:"20"},e.createElement(h,{href:o.extensionDownloadUrl,label:N.t("connect.secondary_action.install.label"),type:"secondary"})):null,s&&!z&&e.createElement(e.Fragment,null,e.createElement(t,{alignItems:"center",display:"flex",flexDirection:"column",justifyContent:"center"},e.createElement(p,{color:"modalTextSecondary",size:"14",textAlign:"center",weight:"medium"},N.t("connect.status.confirm"))),e.createElement(t,{alignItems:"center",color:"modalText",display:"flex",flexDirection:"row",height:"32",marginTop:"8"},n?e.createElement(h,{label:N.t("connect.secondary_action.retry.label"),onClick:j?async()=>{const k=await j();window.open(k,g?"_blank":"_self")}:()=>{l(o)}}):e.createElement(t,{color:"modalTextSecondary"},e.createElement(Cu,null))))))),e.createElement(t,{alignItems:"center",borderRadius:"10",display:"flex",flexDirection:"row",gap:"8",height:"28",justifyContent:"space-between",marginTop:"12"},s&&y&&e.createElement(e.Fragment,null,e.createElement(p,{color:"modalTextSecondary",size:"14",weight:"medium"},y.description),e.createElement(h,{label:y.label,onClick:y.onClick,type:"secondary"}))))}var Ou=({actionLabel:u,description:E,iconAccent:n,iconBackground:i,iconUrl:a,isCompact:l,onAction:o,title:C,url:M,variant:c})=>{const d=c==="browser",D=!d&&n&&EE(n);return e.createElement(t,{alignItems:"center",borderRadius:"13",display:"flex",justifyContent:"center",overflow:"hidden",paddingX:l?"18":"44",position:"relative",style:{flex:1,isolation:"isolate"},width:"full"},e.createElement(t,{borderColor:"actionButtonBorder",borderRadius:"13",borderStyle:"solid",borderWidth:"1",style:{bottom:"0",left:"0",position:"absolute",right:"0",top:"0",zIndex:1}}),d&&e.createElement(t,{background:"downloadTopCardBackground",height:"full",position:"absolute",style:{zIndex:0},width:"full"},e.createElement(t,{display:"flex",flexDirection:"row",justifyContent:"space-between",style:{bottom:"0",filter:"blur(20px)",left:"0",position:"absolute",right:"0",top:"0",transform:"translate3d(0, 0, 0)"}},e.createElement(t,{style:{filter:"blur(100px)",marginLeft:-27,marginTop:-20,opacity:.6,transform:"translate3d(0, 0, 0)"}},e.createElement(b,{borderRadius:"full",height:"200",src:a,width:"200"})),e.createElement(t,{style:{filter:"blur(100px)",marginRight:0,marginTop:105,opacity:.6,overflow:"auto",transform:"translate3d(0, 0, 0)"}},e.createElement(b,{borderRadius:"full",height:"200",src:a,width:"200"})))),!d&&D&&e.createElement(t,{background:"downloadBottomCardBackground",style:{bottom:"0",left:"0",position:"absolute",right:"0",top:"0"}},e.createElement(t,{position:"absolute",style:{background:`radial-gradient(50% 50% at 50% 50%, ${D[0]} 0%, ${D[1]} 25%, rgba(0,0,0,0) 100%)`,height:564,left:-215,top:-197,transform:"translate3d(0, 0, 0)",width:564}}),e.createElement(t,{position:"absolute",style:{background:`radial-gradient(50% 50% at 50% 50%, ${D[2]} 0%, rgba(0, 0, 0, 0) 100%)`,height:564,left:-1,top:-76,transform:"translate3d(0, 0, 0)",width:564}})),e.createElement(t,{alignItems:"flex-start",display:"flex",flexDirection:"row",gap:"24",height:"max",justifyContent:"center",style:{zIndex:1}},e.createElement(t,null,e.createElement(b,{height:"60",src:a,width:"60",...i?{background:i,borderColor:"generalBorder",borderRadius:"10"}:null})),e.createElement(t,{display:"flex",flexDirection:"column",gap:"4",style:{flex:1},width:"full"},e.createElement(p,{color:"modalText",size:"14",weight:"bold"},C),e.createElement(p,{color:"modalTextSecondary",size:"14",weight:"medium"},E),e.createElement(t,{marginTop:"14",width:"max"},e.createElement(h,{href:M,label:u,onClick:o,size:"medium"})))))};function IE({changeWalletStep:u,wallet:E}){const n=Ku(),i=u0(),l=r.useContext(gu)==="compact",{desktop:o,desktopDownloadUrl:C,extension:M,extensionDownloadUrl:c,mobileDownloadUrl:d}=E,{i18n:D}=r.useContext(U);return r.useEffect(()=>{y4(),S4(),lE(),tE()},[]),e.createElement(t,{alignItems:"center",display:"flex",flexDirection:"column",gap:"24",height:"full",marginBottom:"8",marginTop:"4",width:"full"},e.createElement(t,{alignItems:"center",display:"flex",flexDirection:"column",gap:"8",height:"full",justifyContent:"center",width:"full"},c&&e.createElement(Ou,{actionLabel:D.t("get_options.extension.download.label",{browser:n}),description:D.t("get_options.extension.description"),iconUrl:w4,isCompact:l,onAction:()=>u(M?.instructions?"INSTRUCTIONS_EXTENSION":"CONNECT"),title:D.t("get_options.extension.title",{wallet:E.name,browser:n}),url:c,variant:"browser"}),C&&e.createElement(Ou,{actionLabel:D.t("get_options.desktop.download.label",{platform:i}),description:D.t("get_options.desktop.description"),iconUrl:b4,isCompact:l,onAction:()=>u(o?.instructions?"INSTRUCTIONS_DESKTOP":"CONNECT"),title:D.t("get_options.desktop.title",{wallet:E.name,platform:i}),url:C,variant:"desktop"}),d&&e.createElement(Ou,{actionLabel:D.t("get_options.mobile.download.label",{wallet:E.name}),description:D.t("get_options.mobile.description"),iconAccent:E.iconAccent,iconBackground:E.iconBackground,iconUrl:E.iconUrl,isCompact:l,onAction:()=>{u("DOWNLOAD")},title:D.t("get_options.mobile.title",{wallet:E.name}),variant:"app"})))}function LE({changeWalletStep:u,wallet:E}){const{downloadUrls:n,qrCode:i}=E,{i18n:a}=r.useContext(U);return r.useEffect(()=>{y4(),S4()},[]),e.createElement(t,{alignItems:"center",display:"flex",flexDirection:"column",gap:"24",height:"full",width:"full"},e.createElement(t,{style:{maxWidth:220,textAlign:"center"}},e.createElement(p,{color:"modalTextSecondary",size:"14",weight:"semibold"},a.t("get_mobile.description"))),e.createElement(t,{height:"full"},n?.qrCode?e.createElement(k4,{logoSize:0,size:268,uri:n.qrCode}):null),e.createElement(t,{alignItems:"center",borderRadius:"10",display:"flex",flexDirection:"row",gap:"8",height:"34",justifyContent:"space-between",marginBottom:"12",paddingY:"8"},e.createElement(h,{label:a.t("get_mobile.continue.label"),onClick:()=>u(i?.instructions?"INSTRUCTIONS_MOBILE":"CONNECT")})))}var tu={connect:()=>e.createElement(iE,null),create:()=>e.createElement(aE,null),install:u=>e.createElement(b,{background:u.iconBackground,borderColor:"generalBorder",borderRadius:"10",height:"48",src:u.iconUrl,width:"48"}),refresh:()=>e.createElement(oE,null),scan:()=>e.createElement(CE,null)};function pE({connectWallet:u,wallet:E}){var n,i,a,l;const{i18n:o}=r.useContext(U);return e.createElement(t,{alignItems:"center",display:"flex",flexDirection:"column",height:"full",width:"full"},e.createElement(t,{display:"flex",flexDirection:"column",gap:"28",height:"full",justifyContent:"center",paddingY:"32",style:{maxWidth:320}},(i=(n=E?.qrCode)==null?void 0:n.instructions)==null?void 0:i.steps.map((C,M)=>{var c;return e.createElement(t,{alignItems:"center",display:"flex",flexDirection:"row",gap:"16",key:M},e.createElement(t,{borderRadius:"10",height:"48",minWidth:"48",overflow:"hidden",position:"relative",width:"48"},(c=tu[C.step])==null?void 0:c.call(tu,E)),e.createElement(t,{display:"flex",flexDirection:"column",gap:"4"},e.createElement(p,{color:"modalText",size:"14",weight:"bold"},o.t(C.title)),e.createElement(p,{color:"modalTextSecondary",size:"14",weight:"medium"},o.t(C.description))))})),e.createElement(t,{alignItems:"center",display:"flex",flexDirection:"column",gap:"12",justifyContent:"center",marginBottom:"16"},e.createElement(h,{label:o.t("get_instructions.mobile.connect.label"),onClick:()=>u(E)}),e.createElement(t,{as:"a",className:w({active:"shrink",hover:"grow"}),display:"block",href:(l=(a=E?.qrCode)==null?void 0:a.instructions)==null?void 0:l.learnMoreUrl,paddingX:"12",paddingY:"4",rel:"noreferrer",style:{willChange:"transform"},target:"_blank",transition:"default"},e.createElement(p,{color:"accentColor",size:"14",weight:"bold"},o.t("get_instructions.mobile.learn_more.label")))))}function FE({wallet:u}){var E,n,i,a;const{i18n:l}=r.useContext(U);return e.createElement(t,{alignItems:"center",display:"flex",flexDirection:"column",height:"full",width:"full"},e.createElement(t,{display:"flex",flexDirection:"column",gap:"28",height:"full",justifyContent:"center",paddingY:"32",style:{maxWidth:320}},(n=(E=u?.extension)==null?void 0:E.instructions)==null?void 0:n.steps.map((o,C)=>{var M;return e.createElement(t,{alignItems:"center",display:"flex",flexDirection:"row",gap:"16",key:C},e.createElement(t,{borderRadius:"10",height:"48",minWidth:"48",overflow:"hidden",position:"relative",width:"48"},(M=tu[o.step])==null?void 0:M.call(tu,u)),e.createElement(t,{display:"flex",flexDirection:"column",gap:"4"},e.createElement(p,{color:"modalText",size:"14",weight:"bold"},l.t(o.title)),e.createElement(p,{color:"modalTextSecondary",size:"14",weight:"medium"},l.t(o.description))))})),e.createElement(t,{alignItems:"center",display:"flex",flexDirection:"column",gap:"12",justifyContent:"center",marginBottom:"16"},e.createElement(h,{label:l.t("get_instructions.extension.refresh.label"),onClick:window.location.reload.bind(window.location)}),e.createElement(t,{as:"a",className:w({active:"shrink",hover:"grow"}),display:"block",href:(a=(i=u?.extension)==null?void 0:i.instructions)==null?void 0:a.learnMoreUrl,paddingX:"12",paddingY:"4",rel:"noreferrer",style:{willChange:"transform"},target:"_blank",transition:"default"},e.createElement(p,{color:"accentColor",size:"14",weight:"bold"},l.t("get_instructions.extension.learn_more.label")))))}function gE({connectWallet:u,wallet:E}){var n,i,a,l;const{i18n:o}=r.useContext(U);return e.createElement(t,{alignItems:"center",display:"flex",flexDirection:"column",height:"full",width:"full"},e.createElement(t,{display:"flex",flexDirection:"column",gap:"28",height:"full",justifyContent:"center",paddingY:"32",style:{maxWidth:320}},(i=(n=E?.desktop)==null?void 0:n.instructions)==null?void 0:i.steps.map((C,M)=>{var c;return e.createElement(t,{alignItems:"center",display:"flex",flexDirection:"row",gap:"16",key:M},e.createElement(t,{borderRadius:"10",height:"48",minWidth:"48",overflow:"hidden",position:"relative",width:"48"},(c=tu[C.step])==null?void 0:c.call(tu,E)),e.createElement(t,{display:"flex",flexDirection:"column",gap:"4"},e.createElement(p,{color:"modalText",size:"14",weight:"bold"},o.t(C.title)),e.createElement(p,{color:"modalTextSecondary",size:"14",weight:"medium"},o.t(C.description))))})),e.createElement(t,{alignItems:"center",display:"flex",flexDirection:"column",gap:"12",justifyContent:"center",marginBottom:"16"},e.createElement(h,{label:o.t("get_instructions.desktop.connect.label"),onClick:()=>u(E)}),e.createElement(t,{as:"a",className:w({active:"shrink",hover:"grow"}),display:"block",href:(l=(a=E?.desktop)==null?void 0:a.instructions)==null?void 0:l.learnMoreUrl,paddingX:"12",paddingY:"4",rel:"noreferrer",style:{willChange:"transform"},target:"_blank",transition:"default"},e.createElement(p,{color:"accentColor",size:"14",weight:"bold"},o.t("get_instructions.desktop.learn_more.label")))))}function BE({onClose:u}){const E="rk_connect_title",n=qu(),[i,a]=r.useState(),[l,o]=r.useState(),[C,M]=r.useState(),c=!!l?.qrCode&&C,[d,D]=r.useState(!1),s=r.useContext(gu)===Du.COMPACT,{disclaimer:A}=r.useContext(au),{i18n:j}=r.useContext(U),g=r.useRef(!1),{connector:N}=r.useContext(ru),B=Bu().filter(m=>m.ready||!!m.extensionDownloadUrl).sort((m,Y)=>m.groupIndex-Y.groupIndex),F=He(B,m=>m.groupName),I=["Recommended","Other","Popular","More","Others"];r.useEffect(()=>{N&&!g.current&&(k("CONNECT"),y(N),g.current=!0)},[N]);const z=m=>{var Y,v,Z;if(D(!1),m.ready){(v=(Y=m?.connect)==null?void 0:Y.call(m))==null||v.catch(()=>{D(!0)});const _=(Z=m.desktop)==null?void 0:Z.getUri;_&&setTimeout(async()=>{const H=await _();window.open(H,n?"_blank":"_self")},0)}},y=m=>{var Y;if(_e(m.id),z(m),a(m.id),m.ready){let v=!1;(Y=m?.onConnecting)==null||Y.call(m,async()=>{var Z,_;if(v)return;v=!0;const H=B.find(Au=>m.id===Au.id),su=await((Z=H?.qrCode)==null?void 0:Z.getUri());M(su),setTimeout(()=>{o(H),k("CONNECT")},su?0:50);const a0=await H?.connector.getProvider(),q=(_=a0?.signer)==null?void 0:_.connection;if(q?.on&&q?.off){const Au=()=>{mu(),y(m)},mu=()=>{q.off("close",Au),q.off("open",mu)};q.on("close",Au),q.on("open",mu)}})}else o(m),k(m?.extensionDownloadUrl?"DOWNLOAD_OPTIONS":"CONNECT")},S=m=>{var Y;a(m);const v=B.find(su=>m===su.id),Z=(Y=v?.downloadUrls)==null?void 0:Y.qrCode,_=!!v?.desktopDownloadUrl,H=!!v?.extensionDownloadUrl;o(v),k(Z&&(H||_)?"DOWNLOAD_OPTIONS":Z?"DOWNLOAD":_?"INSTRUCTIONS_DESKTOP":"INSTRUCTIONS_EXTENSION")},Q=()=>{a(void 0),o(void 0),M(void 0)},k=(m,Y=!1)=>{Y&&m==="GET"&&X==="GET"?Q():!Y&&m==="GET"?Eu("GET"):!Y&&m==="CONNECT"&&Eu("CONNECT"),zu(m)},[X,Eu]=r.useState("NONE"),[V,zu]=r.useState("NONE");let G=null,f=null,R=null,yu;r.useEffect(()=>{D(!1)},[V,l]);const i0=!!(!!l?.extensionDownloadUrl&&l?.mobileDownloadUrl);switch(V){case"NONE":G=e.createElement(m0,{getWallet:()=>k("GET")});break;case"LEARN_COMPACT":G=e.createElement(m0,{compactModeEnabled:s,getWallet:()=>k("GET")}),f=j.t("intro.title"),R="NONE";break;case"GET":G=e.createElement(jE,{getWalletDownload:S,compactModeEnabled:s}),f=j.t("get.title"),R=s?"LEARN_COMPACT":"NONE";break;case"CONNECT":G=l&&e.createElement(NE,{changeWalletStep:k,compactModeEnabled:s,connectionError:d,onClose:u,qrCodeUri:C,reconnect:z,wallet:l}),f=c&&(l.name==="WalletConnect"?j.t("connect_scan.fallback_title"):j.t("connect_scan.title",{wallet:l.name})),R=s?N?null:"NONE":null,yu=s?N?()=>{}:Q:()=>{};break;case"DOWNLOAD_OPTIONS":G=l&&e.createElement(IE,{changeWalletStep:k,wallet:l}),f=l&&j.t("get_options.short_title",{wallet:l.name}),R=N?"CONNECT":i0?X:null;break;case"DOWNLOAD":G=l&&e.createElement(LE,{changeWalletStep:k,wallet:l}),f=l&&j.t("get_mobile.title",{wallet:l.name}),R=i0?"DOWNLOAD_OPTIONS":X;break;case"INSTRUCTIONS_MOBILE":G=l&&e.createElement(pE,{connectWallet:y,wallet:l}),f=l&&j.t("get_options.title",{wallet:s&&l.shortName||l.name}),R="DOWNLOAD";break;case"INSTRUCTIONS_EXTENSION":G=l&&e.createElement(FE,{wallet:l}),f=l&&j.t("get_options.title",{wallet:s&&l.shortName||l.name}),R="DOWNLOAD_OPTIONS";break;case"INSTRUCTIONS_DESKTOP":G=l&&e.createElement(gE,{connectWallet:y,wallet:l}),f=l&&j.t("get_options.title",{wallet:s&&l.shortName||l.name}),R="DOWNLOAD_OPTIONS";break}return e.createElement(t,{display:"flex",flexDirection:"row",style:{maxHeight:s?468:504}},(s?V==="NONE":!0)&&e.createElement(t,{className:s?cE:DE,display:"flex",flexDirection:"column",marginTop:"16"},e.createElement(t,{display:"flex",justifyContent:"space-between"},s&&A&&e.createElement(t,{marginLeft:"16",width:"28"},e.createElement(Ke,{onClick:()=>k("LEARN_COMPACT")})),s&&!A&&e.createElement(t,{marginLeft:"16",width:"28"}),e.createElement(t,{marginLeft:s?"0":"6",paddingBottom:"8",paddingTop:"2",paddingX:"18"},e.createElement(p,{as:"h1",color:"modalText",id:E,size:"18",weight:"heavy",testId:"connect-header-label"},j.t("connect.title"))),s&&e.createElement(t,{marginRight:"16"},e.createElement($,{onClose:u}))),e.createElement(t,{className:rE,paddingBottom:"18"},Object.entries(F).map(([m,Y],v)=>Y.length>0&&e.createElement(r.Fragment,{key:v},m?e.createElement(t,{marginBottom:"8",marginTop:"16",marginX:"6"},e.createElement(p,{color:"modalTextSecondary",size:"14",weight:"bold"},I.includes(m)?j.t(`connector_group.${m.toLowerCase()}`):m)):null,e.createElement(t,{display:"flex",flexDirection:"column",gap:"4"},Y.map(Z=>e.createElement(B4,{currentlySelected:Z.id===i,iconBackground:Z.iconBackground,iconUrl:Z.iconUrl,key:Z.id,name:Z.name,onClick:()=>y(Z),ready:Z.ready,recent:Z.recent,testId:`wallet-option-${Z.id}`})))))),s&&e.createElement(e.Fragment,null,e.createElement(t,{background:"generalBorder",height:"1",marginTop:"-1"}),A?e.createElement(t,{paddingX:"24",paddingY:"16",textAlign:"center"},e.createElement(A,{Link:e0,Text:E0})):e.createElement(t,{alignItems:"center",display:"flex",justifyContent:"space-between",paddingX:"24",paddingY:"16"},e.createElement(t,{paddingY:"4"},e.createElement(p,{color:"modalTextSecondary",size:"14",weight:"medium"},j.t("connect.new_to_ethereum.description"))),e.createElement(t,{alignItems:"center",display:"flex",flexDirection:"row",gap:"4",justifyContent:"center"},e.createElement(t,{className:w({active:"shrink",hover:"grow"}),cursor:"pointer",onClick:()=>k("LEARN_COMPACT"),paddingY:"4",style:{willChange:"transform"},transition:"default"},e.createElement(p,{color:"accentColor",size:"14",weight:"bold"},j.t("connect.new_to_ethereum.learn_more.label"))))))),(s?V!=="NONE":!0)&&e.createElement(e.Fragment,null,!s&&e.createElement(t,{background:"generalBorder",minWidth:"1",width:"1"}),e.createElement(t,{display:"flex",flexDirection:"column",margin:"16",style:{flexGrow:1}},e.createElement(t,{alignItems:"center",display:"flex",justifyContent:"space-between",marginBottom:"12"},e.createElement(t,{width:"28"},R&&e.createElement(t,{as:"button",className:w({active:"shrinkSm",hover:"growLg"}),color:"accentColor",onClick:()=>{R&&k(R,!0),yu?.()},paddingX:"8",paddingY:"4",style:{boxSizing:"content-box",height:17,willChange:"transform"},transition:"default",type:"button"},e.createElement(F4,null))),e.createElement(t,{display:"flex",justifyContent:"center",style:{flexGrow:1}},f&&e.createElement(p,{color:"modalText",size:"18",textAlign:"center",weight:"heavy"},f)),e.createElement($,{onClose:u})),e.createElement(t,{display:"flex",flexDirection:"column",style:{minHeight:s?396:432}},e.createElement(t,{alignItems:"center",display:"flex",flexDirection:"column",gap:"6",height:"full",justifyContent:"center",marginX:"8"},G)))))}var xE="_1am14412",zE="_1am14410",yE="_1am14413",mE=({wallet:u})=>e.createElement("svg",{className:yE,viewBox:"0 0 86 86",width:"86",height:"86"},e.createElement("title",null,"Loading"),e.createElement("rect",{x:"3",y:"3",width:80,height:80,rx:20,ry:20,strokeDasharray:`${160/3} ${2*160/3}`,strokeDashoffset:160,className:xE,style:{stroke:u?.iconAccent||"#0D3887"}}));function U4({onClose:u,wallet:E,connecting:n}){const{connect:i,connector:a,iconBackground:l,iconUrl:o,id:C,mobile:M,name:c,onConnecting:d,ready:D,shortName:L}=E,s=M?.getUri,A=g4(o),j=r.useRef(!1),{i18n:g}=r.useContext(U),N=r.useCallback(async()=>{var B;C==="walletConnect"&&u?.(),(B=i?.())==null||B.catch(()=>{});let F=!1;d?.(async()=>{if(!F&&(F=!0,s)){const I=await s();if((a.id==="walletConnect"||a.id==="walletConnectLegacy")&&de({mobileUri:I,name:c}),I.startsWith("http")){const z=document.createElement("a");z.href=I,z.target="_blank",z.rel="noreferrer noopener",z.click()}else window.location.href=I}})},[a,i,s,d,u,c,C]);return r.useEffect(()=>{n&&!j.current&&(N(),j.current=!0)},[n,N]),e.createElement(t,{as:"button",color:D?"modalText":"modalTextSecondary",disabled:!D,fontFamily:"body",key:C,onClick:N,ref:A,style:{overflow:"visible",textAlign:"center"},testId:`wallet-option-${C}`,type:"button",width:"full"},e.createElement(t,{alignItems:"center",display:"flex",flexDirection:"column",justifyContent:"center"},e.createElement(t,{display:"flex",alignItems:"center",justifyContent:"center",paddingBottom:"8",paddingTop:"10",position:"relative"},n?e.createElement(mE,{wallet:E}):null,e.createElement(b,{background:l,borderRadius:"13",boxShadow:"walletLogo",height:"60",src:o,width:"60"})),n?null:e.createElement(t,{display:"flex",flexDirection:"column",textAlign:"center"},e.createElement(p,{as:"h2",color:E.ready?"modalText":"modalTextSecondary",size:"13",weight:"medium"},e.createElement(t,{as:"span",position:"relative"},L??c,!E.ready&&" (unsupported)")),E.recent&&e.createElement(p,{color:"accentColor",size:"12",weight:"medium"},g.t("connect.recent")))))}function TE({onClose:u}){var E;const n="rk_connect_title",i=Bu(),{disclaimer:a,learnMoreUrl:l}=r.useContext(au);let o=null,C=null,M=!1,c=null;const[d,D]=r.useState("CONNECT"),{i18n:L}=r.useContext(U),s=fu();switch(d){case"CONNECT":{o=L.t("connect.title"),M=!0,C=e.createElement(t,null,e.createElement(t,{background:"profileForeground",className:zE,display:"flex",paddingBottom:"20",paddingTop:"6"},e.createElement(t,{display:"flex",style:{margin:"0 auto"}},i.filter(A=>A.ready).map(A=>e.createElement(t,{key:A.id,paddingX:"20"},e.createElement(t,{width:"60"},e.createElement(U4,{onClose:u,wallet:A})))))),e.createElement(t,{background:"generalBorder",height:"1",marginBottom:"32",marginTop:"-1"}),e.createElement(t,{alignItems:"center",display:"flex",flexDirection:"column",gap:"32",paddingX:"32",style:{textAlign:"center"}},e.createElement(t,{display:"flex",flexDirection:"column",gap:"8",textAlign:"center"},e.createElement(p,{color:"modalText",size:"16",weight:"bold"},L.t("intro.title")),e.createElement(p,{color:"modalTextSecondary",size:"16"},L.t("intro.description")))),e.createElement(t,{paddingTop:"32",paddingX:"20"},e.createElement(t,{display:"flex",gap:"14",justifyContent:"center"},e.createElement(h,{label:L.t("intro.get.label"),onClick:()=>D("GET"),size:"large",type:"secondary"}),e.createElement(h,{href:l,label:L.t("intro.learn_more.label"),size:"large",type:"secondary"}))),a&&e.createElement(t,{marginTop:"28",marginX:"32",textAlign:"center"},e.createElement(a,{Link:e0,Text:E0})));break}case"GET":{o=L.t("get.title"),c="CONNECT";const A=(E=i?.filter(j=>{var g,N,B;return((g=j.downloadUrls)==null?void 0:g.ios)||((N=j.downloadUrls)==null?void 0:N.android)||((B=j.downloadUrls)==null?void 0:B.mobile)}))==null?void 0:E.splice(0,3);C=e.createElement(t,null,e.createElement(t,{alignItems:"center",display:"flex",flexDirection:"column",height:"full",marginBottom:"36",marginTop:"5",paddingTop:"12",width:"full"},A.map((j,g)=>{const{downloadUrls:N,iconBackground:B,iconUrl:F,name:I}=j;return!N?.ios&&!N?.android&&!N?.mobile?null:e.createElement(t,{display:"flex",gap:"16",key:j.id,paddingX:"20",width:"full"},e.createElement(t,{style:{minHeight:48,minWidth:48}},e.createElement(b,{background:B,borderColor:"generalBorder",borderRadius:"10",height:"48",src:F,width:"48"})),e.createElement(t,{display:"flex",flexDirection:"column",width:"full"},e.createElement(t,{alignItems:"center",display:"flex",height:"48"},e.createElement(t,{width:"full"},e.createElement(p,{color:"modalText",size:"18",weight:"bold"},I)),e.createElement(h,{href:(s?N?.ios:N?.android)||N?.mobile,label:L.t("get.action.label"),size:"small",type:"secondary"})),g<A.length-1&&e.createElement(t,{background:"generalBorderDim",height:"1",marginY:"10",width:"full"})))})),e.createElement(t,{style:{marginBottom:"42px"}}),e.createElement(t,{alignItems:"center",display:"flex",flexDirection:"column",gap:"36",paddingX:"36",style:{textAlign:"center"}},e.createElement(t,{display:"flex",flexDirection:"column",gap:"12",textAlign:"center"},e.createElement(p,{color:"modalText",size:"16",weight:"bold"},L.t("get.looking_for.title")),e.createElement(p,{color:"modalTextSecondary",size:"16"},L.t("get.looking_for.mobile.description")))));break}}return e.createElement(t,{display:"flex",flexDirection:"column",paddingBottom:"36"},e.createElement(t,{background:M?"profileForeground":"modalBackground",display:"flex",flexDirection:"column",paddingBottom:"4",paddingTop:"14"},e.createElement(t,{display:"flex",justifyContent:"center",paddingBottom:"6",paddingX:"20",position:"relative"},c&&e.createElement(t,{display:"flex",position:"absolute",style:{left:0,marginBottom:-20,marginTop:-20}},e.createElement(t,{alignItems:"center",as:"button",className:w({active:"shrinkSm",hover:"growLg"}),color:"accentColor",display:"flex",marginLeft:"4",marginTop:"20",onClick:()=>D(c),padding:"16",style:{height:17,willChange:"transform"},transition:"default",type:"button"},e.createElement(F4,null))),e.createElement(t,{marginTop:"4",textAlign:"center",width:"full"},e.createElement(p,{as:"h1",color:"modalText",id:n,size:"20",weight:"bold"},o)),e.createElement(t,{alignItems:"center",display:"flex",height:"32",paddingRight:"14",position:"absolute",right:"0"},e.createElement(t,{style:{marginBottom:-20,marginTop:-20}},e.createElement($,{onClose:u}))))),e.createElement(t,{display:"flex",flexDirection:"column"},C))}var SE=({onClose:u})=>{const{connector:E}=r.useContext(ru),{i18n:n}=r.useContext(U),i=E?.name||"";return e.createElement(t,null,e.createElement(t,{display:"flex",paddingBottom:"32",justifyContent:"center",alignItems:"center",background:"profileForeground",flexDirection:"column"},e.createElement(t,{width:"full",display:"flex",justifyContent:"flex-end",marginTop:"18",marginRight:"24"},e.createElement($,{onClose:u})),e.createElement(t,{width:"60"},e.createElement(U4,{onClose:u,wallet:E,connecting:!0})),e.createElement(t,{marginTop:"20"},e.createElement(p,{textAlign:"center",color:"modalText",size:"18",weight:"semibold"},n.t("connect.status.connect_mobile",{wallet:i}))),e.createElement(t,{maxWidth:"full",marginTop:"8"},e.createElement(p,{textAlign:"center",color:"modalText",size:"16",weight:"medium"},n.t("connect.status.confirm_mobile",{wallet:i})))))};function kE({onClose:u}){const{connector:E}=r.useContext(ru);return O()?E?e.createElement(SE,{onClose:u}):e.createElement(TE,{onClose:u}):e.createElement(BE,{onClose:u})}function wE({onClose:u,open:E}){const n="rk_connect_title",i=Gu(),{disconnect:a}=Ru(),{isConnecting:l}=J(),o=e.useCallback(()=>{u(),a()},[u,a]),C=e.useCallback(()=>{l&&a(),u()},[u,a,l]);return i==="disconnected"?e.createElement(Iu,{onClose:C,open:E,titleId:n},e.createElement(Lu,{bottomSheetOnMobile:!0,padding:"0",wide:!0},e.createElement(kE,{onClose:C}))):i==="unauthenticated"?e.createElement(Iu,{onClose:o,open:E,titleId:n},e.createElement(Lu,{bottomSheetOnMobile:!0,padding:"0"},e.createElement(se,{onClose:o}))):null}function Yu(){const[u,E]=r.useState(!1);return{closeModal:r.useCallback(()=>E(!1),[]),isModalOpen:u,openModal:r.useCallback(()=>E(!0),[])}}var cu=r.createContext({accountModalOpen:!1,chainModalOpen:!1,connectModalOpen:!1});function bE({children:u}){const{closeModal:E,isModalOpen:n,openModal:i}=Yu(),{closeModal:a,isModalOpen:l,openModal:o}=Yu(),{closeModal:C,isModalOpen:M,openModal:c}=Yu(),d=Gu(),{chain:D}=eu(),L=!D?.unsupported;function s({keepConnectModalOpen:j=!1}={}){j||E(),a(),C()}const A=Fu()==="unauthenticated";return J({onConnect:()=>s({keepConnectModalOpen:A}),onDisconnect:()=>s()}),e.createElement(cu.Provider,{value:r.useMemo(()=>({accountModalOpen:l,chainModalOpen:M,connectModalOpen:n,openAccountModal:L&&d==="connected"?o:void 0,openChainModal:d==="connected"?c:void 0,openConnectModal:d==="disconnected"||d==="unauthenticated"?i:void 0}),[d,L,l,M,n,o,c,i])},u,e.createElement(wE,{onClose:E,open:n}),e.createElement(Ve,{onClose:a,open:l}),e.createElement(Je,{onClose:C,open:M}))}function UE(){const{accountModalOpen:u,chainModalOpen:E,connectModalOpen:n}=r.useContext(cu);return{accountModalOpen:u,chainModalOpen:E,connectModalOpen:n}}function ZE(){const{accountModalOpen:u,openAccountModal:E}=r.useContext(cu);return{accountModalOpen:u,openAccountModal:E}}function OE(){const{chainModalOpen:u,openChainModal:E}=r.useContext(cu);return{chainModalOpen:u,openChainModal:E}}function YE(){const{connectModalOpen:u,openConnectModal:E}=r.useContext(cu);return{connectModalOpen:u,openConnectModal:E}}var vu=()=>{};function n0({children:u}){var E,n,i,a;const l=Y3(),{address:o}=J(),C=e4(o),M=u4(C),c=Z3(),d=(E=Fu())!=null?E:void 0,{chain:D}=eu(),L=D?c[D.id]:void 0,s=(n=L?.name)!=null?n:void 0,A=(i=L?.iconUrl)!=null?i:void 0,j=(a=L?.iconBackground)!=null?a:void 0,g=Pu(A),N=r.useContext(_u),B=i4().some(({status:zu})=>zu==="pending")&&N,{showBalance:F}=K0(),I=F?G0(F)[O()?"smallScreen":"largeScreen"]:!1,{data:z}=O0({address:I?o:void 0}),y=z?`${j4(parseFloat(z.formatted))} ${z.symbol}`:void 0,{openConnectModal:S}=YE(),{openChainModal:Q}=OE(),{openAccountModal:k}=ZE(),{accountModalOpen:X,chainModalOpen:Eu,connectModalOpen:V}=UE();return e.createElement(e.Fragment,null,u({account:o?{address:o,balanceDecimals:z?.decimals,balanceFormatted:z?.formatted,balanceSymbol:z?.symbol,displayBalance:y,displayName:C?I4(C):N4(o),ensAvatar:M??void 0,ensName:C??void 0,hasPendingTransactions:B}:void 0,accountModalOpen:X,authenticationStatus:d,chain:D?{hasIcon:!!A,iconBackground:j,iconUrl:g,id:D.id,name:s??D.name,unsupported:D.unsupported}:void 0,chainModalOpen:Eu,connectModalOpen:V,mounted:l(),openAccountModal:k??vu,openChainModal:Q??vu,openConnectModal:S??vu}))}n0.displayName="ConnectButton.Custom";var ou={accountStatus:"full",chainStatus:{largeScreen:"full",smallScreen:"icon"},label:"Connect Wallet",showBalance:{largeScreen:!0,smallScreen:!1}};function Z4({accountStatus:u=ou.accountStatus,chainStatus:E=ou.chainStatus,label:n=ou.label,showBalance:i=ou.showBalance}){const a=Mu(),l=Gu(),{setShowBalance:o}=K0(),{i18n:C}=r.useContext(U);return r.useEffect(()=>{o(i)},[i,o]),e.createElement(n0,null,({account:M,chain:c,mounted:d,openAccountModal:D,openChainModal:L,openConnectModal:s})=>{var A,j,g;const N=d&&l!=="loading",B=(A=c?.unsupported)!=null?A:!1;return e.createElement(t,{display:"flex",gap:"12",...!N&&{"aria-hidden":!0,style:{opacity:0,pointerEvents:"none",userSelect:"none"}}},N&&M&&l==="connected"?e.createElement(e.Fragment,null,c&&(a.length>1||B)&&e.createElement(t,{alignItems:"center","aria-label":"Chain Selector",as:"button",background:B?"connectButtonBackgroundError":"connectButtonBackground",borderRadius:"connectButton",boxShadow:"connectButton",className:w({active:"shrink",hover:"grow"}),color:B?"connectButtonTextError":"connectButtonText",display:nu(E,F=>F==="none"?"none":"flex"),fontFamily:"body",fontWeight:"bold",gap:"6",key:B?"unsupported":"supported",onClick:L,paddingX:"10",paddingY:"8",testId:B?"wrong-network-button":"chain-button",transition:"default",type:"button"},B?e.createElement(t,{alignItems:"center",display:"flex",height:"24",paddingX:"4"},"Wrong network"):e.createElement(t,{alignItems:"center",display:"flex",gap:"6"},c.hasIcon?e.createElement(t,{display:nu(E,F=>F==="full"||F==="icon"?"block":"none"),height:"24",width:"24"},e.createElement(b,{alt:(j=c.name)!=null?j:"Chain icon",background:c.iconBackground,borderRadius:"full",height:"24",src:c.iconUrl,width:"24"})):null,e.createElement(t,{display:nu(E,F=>F==="icon"&&!c.iconUrl||F==="full"||F==="name"?"block":"none")},(g=c.name)!=null?g:c.id)),e.createElement(s0,null)),!B&&e.createElement(t,{alignItems:"center",as:"button",background:"connectButtonBackground",borderRadius:"connectButton",boxShadow:"connectButton",className:w({active:"shrink",hover:"grow"}),color:"connectButtonText",display:"flex",fontFamily:"body",fontWeight:"bold",onClick:D,testId:"account-button",transition:"default",type:"button"},M.displayBalance&&e.createElement(t,{display:nu(i,F=>F?"block":"none"),padding:"8",paddingLeft:"12"},M.displayBalance),e.createElement(t,{background:G0(i)[O()?"smallScreen":"largeScreen"]?"connectButtonInnerBackground":"connectButtonBackground",borderColor:"connectButtonBackground",borderRadius:"connectButton",borderStyle:"solid",borderWidth:"2",color:"connectButtonText",fontFamily:"body",fontWeight:"bold",paddingX:"8",paddingY:"6",transition:"default"},e.createElement(t,{alignItems:"center",display:"flex",gap:"6",height:"24"},e.createElement(t,{display:nu(u,F=>F==="full"||F==="avatar"?"block":"none")},e.createElement(_0,{address:M.address,imageUrl:M.ensAvatar,loading:M.hasPendingTransactions,size:24})),e.createElement(t,{alignItems:"center",display:"flex",gap:"6"},e.createElement(t,{display:nu(u,F=>F==="full"||F==="address"?"block":"none")},M.displayName),e.createElement(s0,null)))))):e.createElement(t,{as:"button",background:"accentColor",borderRadius:"connectButton",boxShadow:"connectButton",className:w({active:"shrink",hover:"grow"}),color:"accentColorForeground",fontFamily:"body",fontWeight:"bold",height:"40",key:"connect",onClick:s,paddingX:"14",testId:"connect-button",transition:"default",type:"button"},d&&n==="Connect Wallet"?C.t("connect_wallet.label"):n))})}Z4.__defaultProps=ou;Z4.Custom=n0;function vE(u){return Object.fromEntries(Object.entries(u).filter(([E,n])=>n!==void 0))}function ft(u){return"groupName"in u[0]?S0(u):S0([{groupName:"",wallets:u}])()}var S0=u=>()=>{let E=-1;const n=[],i=[],a=[],l=[];return u.forEach(({groupName:C,wallets:M},c)=>{M.forEach(d=>{if(E++,d?.iconAccent&&!nE(d?.iconAccent))throw new Error(`Property \`iconAccent\` is not a hex value for wallet: ${d.name}`);const D={...d,groupIndex:c,groupName:C,index:E};typeof d.hidden=="function"?a.push(D):i.push(D)})}),[...i,...a].forEach(({createConnector:C,groupIndex:M,groupName:c,hidden:d,index:D,...L})=>{if(typeof d=="function"&&d({wallets:[...l.map(({connector:B,id:F,installed:I,name:z})=>({connector:B,id:F,installed:I,name:z}))]}))return;const{connector:s,...A}=vE(C());let j;if(L.id==="walletConnect"&&A.qrCode&&!O()){const{chains:N,options:B}=s;j=new Z0({chains:N,options:{...B,showQrModal:!0}}),n.push(j)}const g={connector:s,groupIndex:M,groupName:c,index:D,walletConnectModalConnector:j,...L,...A};l.push(g),n.includes(s)||(n.push(s),s._wallets=[]),s._wallets.push(g)}),n};function t0(){return typeof navigator<"u"&&/android/i.test(navigator.userAgent)}function hE(){return typeof navigator<"u"&&/iPhone|iPod/.test(navigator.userAgent)}function WE(){return typeof navigator<"u"&&(/iPad/.test(navigator.userAgent)||navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1)}function xu(){return hE()||WE()}async function uu(u,E){const n=await u.getProvider();return E==="2"?new Promise(i=>n.once("display_uri",i)):n.connector.uri}var O4=new Map;function QE(u,E){const n=u==="1"?new X4(E):new Z0(E);return O4.set(JSON.stringify(E),n),n}function iu({chains:u,options:E={},projectId:n,version:i="2"}){const a="21fef48091f12692cad574a6f7753643";if(i==="2"){if(!n||n==="")throw new Error("No projectId found. Every dApp must now provide a WalletConnect Cloud projectId to enable WalletConnect v2 https://www.rainbowkit.com/docs/installation#configure");(n==="YOUR_PROJECT_ID"||n===a)&&console.warn("Invalid projectId. Please create a unique WalletConnect Cloud projectId for your dApp https://www.rainbowkit.com/docs/installation#configure")}const l={chains:u,options:i==="1"?{qrcode:!1,...E}:{projectId:n==="YOUR_PROJECT_ID"?a:n,showQrModal:!1,...E}},o=JSON.stringify(l),C=O4.get(o);return C??QE(i,l)}var k0=()=>{if(!(typeof window>"u"))return window.SubWallet},Pt=({chains:u,projectId:E,walletConnectOptions:n,walletConnectVersion:i="2",...a})=>{const l=!!k0(),o=!l;return{id:"subwallet",name:"SubWallet",iconUrl:async()=>(await x(async()=>{const{default:C}=await Promise.resolve().then(()=>gt);return{default:C}},void 0)).default,iconBackground:"#fff",installed:l||void 0,downloadUrls:{browserExtension:"https://www.subwallet.app/download",chrome:"https://chrome.google.com/webstore/detail/subwallet-polkadot-wallet/onhogfjeacnfoofkfgppdlbmlmnplgbn",firefox:"https://addons.mozilla.org/en-US/firefox/addon/subwallet/",edge:"https://chrome.google.com/webstore/detail/subwallet-polkadot-wallet/onhogfjeacnfoofkfgppdlbmlmnplgbn",mobile:"https://www.subwallet.app/download",android:"https://play.google.com/store/apps/details?id=app.subwallet.mobile",ios:"https://apps.apple.com/us/app/subwallet-polkadot-wallet/id1633050285",qrCode:"https://www.subwallet.app/download"},createConnector:()=>{const C=o?iu({projectId:E,chains:u,version:i,options:n}):new pu({chains:u,options:{getProvider:k0,...a}}),M=async()=>{const s=await uu(C,i);return`subwallet://wc?uri=${encodeURIComponent(s)}`},c=async()=>await uu(C,i),d={getUri:o?M:void 0};let D;return o&&(D={getUri:c,instructions:{learnMoreUrl:"https://www.subwallet.app/",steps:[{description:"wallet_connectors.subwallet.qr_code.step1.description",step:"install",title:"wallet_connectors.subwallet.qr_code.step1.title"},{description:"wallet_connectors.subwallet.qr_code.step2.description",step:"create",title:"wallet_connectors.subwallet.qr_code.step2.title"},{description:"wallet_connectors.subwallet.qr_code.step3.description",step:"scan",title:"wallet_connectors.subwallet.qr_code.step3.title"}]}}),{connector:C,mobile:d,qrCode:D,extension:{instructions:{learnMoreUrl:"https://www.subwallet.app/",steps:[{description:"wallet_connectors.subwallet.extension.step1.description",step:"install",title:"wallet_connectors.subwallet.extension.step1.title"},{description:"wallet_connectors.subwallet.extension.step2.description",step:"create",title:"wallet_connectors.subwallet.extension.step2.title"},{description:"wallet_connectors.subwallet.extension.step3.description",step:"refresh",title:"wallet_connectors.subwallet.extension.step3.title"}]}}}}}};function Y4(u){if(typeof window>"u"||typeof window.ethereum>"u")return;const E=window.ethereum.providers;return E?E.find(n=>n[u]):window.ethereum[u]?window.ethereum:void 0}function v4(u){return!!Y4(u)}function VE(u){if(typeof window>"u"||typeof window.ethereum>"u")return;const E=window.ethereum.providers,n=Y4(u);return n||(typeof E<"u"&&E.length>0?E[0]:window.ethereum)}function RE({chains:u,flag:E,options:n}){return new pu({chains:u,options:{getProvider:()=>VE(E),...n}})}var Jt=({chains:u,options:E,projectId:n,version:i="2"})=>({id:"walletConnect",name:"WalletConnect",iconUrl:async()=>(await x(async()=>{const{default:a}=await Promise.resolve().then(()=>xt);return{default:a}},void 0)).default,iconBackground:"#3b99fc",createConnector:()=>{const a=xu(),l=iu(i==="1"?{version:"1",chains:u,options:{qrcode:a,...E}}:{version:"2",chains:u,projectId:n,options:{showQrModal:a,...E}}),o=async()=>uu(l,i);return{connector:l,...a?{}:{mobile:{getUri:o},qrCode:{getUri:o}}}}}),Ht=({chains:u,...E})=>{var n;return{id:"phantom",name:"Phantom",iconUrl:async()=>(await x(async()=>{const{default:i}=await Promise.resolve().then(()=>yt);return{default:i}},void 0)).default,iconBackground:"#9A8AEE",installed:typeof window<"u"&&!!((n=window.phantom)!=null&&n.ethereum)||void 0,downloadUrls:{android:"https://play.google.com/store/apps/details?id=app.phantom",ios:"https://apps.apple.com/app/phantom-solana-wallet/1598432977",mobile:"https://phantom.app/download",qrCode:"https://phantom.app/download",chrome:"https://chrome.google.com/webstore/detail/phantom/bfnaelmomeimhlpmgjnjophhpkkoljpa",firefox:"https://addons.mozilla.org/firefox/addon/phantom-app/",browserExtension:"https://phantom.app/download"},createConnector:()=>{const i=()=>{var l;return typeof window<"u"?(l=window.phantom)==null?void 0:l.ethereum:void 0};return{connector:new pu({chains:u,options:{getProvider:i,...E}}),extension:{instructions:{steps:[{description:"wallet_connectors.phantom.extension.step1.description",step:"install",title:"wallet_connectors.phantom.extension.step1.title"},{description:"wallet_connectors.phantom.extension.step2.description",step:"create",title:"wallet_connectors.phantom.extension.step2.title"},{description:"wallet_connectors.phantom.extension.step3.description",step:"refresh",title:"wallet_connectors.phantom.extension.step3.title"}],learnMoreUrl:"https://help.phantom.app"}}}}}},Xt=({chains:u,projectId:E,walletConnectOptions:n,walletConnectVersion:i="2",...a})=>{const l=v4("isRainbow"),o=!l;return{id:"rainbow",name:"Rainbow",iconUrl:async()=>(await x(async()=>{const{default:C}=await Promise.resolve().then(()=>Tt);return{default:C}},void 0)).default,iconBackground:"#0c2f78",installed:o?void 0:l,downloadUrls:{android:"https://play.google.com/store/apps/details?id=me.rainbow&referrer=utm_source%3Drainbowkit&utm_source=rainbowkit",ios:"https://apps.apple.com/app/apple-store/id1457119021?pt=119997837&ct=rainbowkit&mt=8",mobile:"https://rainbow.download?utm_source=rainbowkit",qrCode:"https://rainbow.download?utm_source=rainbowkit&utm_medium=qrcode",browserExtension:"https://rainbow.me/extension?utm_source=rainbowkit"},createConnector:()=>{const C=o?iu({projectId:E,chains:u,version:i,options:n}):RE({flag:"isRainbow",chains:u,options:a}),M=async()=>{const c=await uu(C,i);return t0()?c:xu()?`rainbow://wc?uri=${encodeURIComponent(c)}&connector=rainbowkit`:`https://rnbwapp.com/wc?uri=${encodeURIComponent(c)}&connector=rainbowkit`};return{connector:C,mobile:{getUri:o?M:void 0},qrCode:o?{getUri:M,instructions:{learnMoreUrl:"https://learn.rainbow.me/connect-to-a-website-or-app?utm_source=rainbowkit&utm_medium=connector&utm_campaign=learnmore",steps:[{description:"wallet_connectors.rainbow.qr_code.step1.description",step:"install",title:"wallet_connectors.rainbow.qr_code.step1.title"},{description:"wallet_connectors.rainbow.qr_code.step2.description",step:"create",title:"wallet_connectors.rainbow.qr_code.step2.title"},{description:"wallet_connectors.rainbow.qr_code.step3.description",step:"scan",title:"wallet_connectors.rainbow.qr_code.step3.title"}]}}:void 0}}}};function w0(u){return!(!u?.isMetaMask||u.isBraveWallet&&!u._events&&!u._state||u.isApexWallet||u.isAvalanche||u.isBackpack||u.isBifrost||u.isBitKeep||u.isBitski||u.isBlockWallet||u.isCoinbaseWallet||u.isDawn||u.isEnkrypt||u.isExodus||u.isFrame||u.isFrontier||u.isGamestop||u.isHyperPay||u.isImToken||u.isKuCoinWallet||u.isMathWallet||u.isOkxWallet||u.isOKExWallet||u.isOneInchIOSWallet||u.isOneInchAndroidWallet||u.isOpera||u.isPhantom||u.isPortal||u.isRabby||u.isRainbow||u.isStatus||u.isTalisman||u.isTally||u.isTokenPocket||u.isTokenary||u.isTrust||u.isTrustWallet||u.isXDEFI||u.isZeal||u.isZerion)}var _t=({chains:u,projectId:E,walletConnectOptions:n,walletConnectVersion:i="2",...a})=>{var l,o;const C=typeof window<"u"&&((l=window.ethereum)==null?void 0:l.providers),M=typeof window<"u"&&typeof window.ethereum<"u"&&(((o=window.ethereum.providers)==null?void 0:o.some(w0))||window.ethereum.isMetaMask),c=!M;return{id:"metaMask",name:"MetaMask",iconUrl:async()=>(await x(async()=>{const{default:d}=await Promise.resolve().then(()=>kt);return{default:d}},void 0)).default,iconAccent:"#f6851a",iconBackground:"#fff",installed:c?void 0:M,downloadUrls:{android:"https://play.google.com/store/apps/details?id=io.metamask",ios:"https://apps.apple.com/us/app/metamask/id1438144202",mobile:"https://metamask.io/download",qrCode:"https://metamask.io/download",chrome:"https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn",edge:"https://microsoftedge.microsoft.com/addons/detail/metamask/ejbalbakoplchlghecdalmeeeajnimhm",firefox:"https://addons.mozilla.org/firefox/addon/ether-metamask",opera:"https://addons.opera.com/extensions/details/metamask-10",browserExtension:"https://metamask.io/download"},createConnector:()=>{const d=c?iu({projectId:E,chains:u,version:i,options:n}):new _4({chains:u,options:{getProvider:()=>C?C.find(w0):typeof window<"u"?window.ethereum:void 0,...a}}),D=async()=>{const L=await uu(d,i);return t0()?L:xu()?`metamask://wc?uri=${encodeURIComponent(L)}`:`https://metamask.app.link/wc?uri=${encodeURIComponent(L)}`};return{connector:d,mobile:{getUri:c?D:void 0},qrCode:c?{getUri:D,instructions:{learnMoreUrl:"https://metamask.io/faqs/",steps:[{description:"wallet_connectors.metamask.qr_code.step1.description",step:"install",title:"wallet_connectors.metamask.qr_code.step1.title"},{description:"wallet_connectors.metamask.qr_code.step2.description",step:"create",title:"wallet_connectors.metamask.qr_code.step2.title"},{description:"wallet_connectors.metamask.qr_code.step3.description",step:"refresh",title:"wallet_connectors.metamask.qr_code.step3.title"}]}}:void 0,extension:{instructions:{learnMoreUrl:"https://metamask.io/faqs/",steps:[{description:"wallet_connectors.metamask.extension.step1.description",step:"install",title:"wallet_connectors.metamask.extension.step1.title"},{description:"wallet_connectors.metamask.extension.step2.description",step:"create",title:"wallet_connectors.metamask.extension.step2.title"},{description:"wallet_connectors.metamask.extension.step3.description",step:"refresh",title:"wallet_connectors.metamask.extension.step3.title"}]}}}}}},qt=({chains:u,projectId:E,walletConnectOptions:n,walletConnectVersion:i="2",...a})=>{const o=!(typeof window<"u"&&typeof window.okxwallet<"u");return{id:"okx",name:"OKX Wallet",iconUrl:async()=>(await x(async()=>{const{default:C}=await Promise.resolve().then(()=>bt);return{default:C}},void 0)).default,iconAccent:"#000",iconBackground:"#000",downloadUrls:{android:"https://play.google.com/store/apps/details?id=com.okinc.okex.gp",ios:"https://itunes.apple.com/app/id1327268470?mt=8",mobile:"https://okx.com/download",qrCode:"https://okx.com/download",chrome:"https://chrome.google.com/webstore/detail/okx-wallet/mcohilncbfahbmgdjkbpemcciiolgcge",edge:"https://microsoftedge.microsoft.com/addons/detail/okx-wallet/pbpjkcldjiffchgbbndmhojiacbgflha",firefox:"https://addons.mozilla.org/firefox/addon/okexwallet/",browserExtension:"https://okx.com/download"},createConnector:()=>{const C=o?iu({projectId:E,chains:u,version:i,options:n}):new pu({chains:u,options:{getProvider:()=>window.okxwallet,...a}});return{connector:C,mobile:{getUri:o?async()=>{const M=await uu(C,i);return t0()?M:`okex://main/wc?uri=${encodeURIComponent(M)}`}:void 0},qrCode:o?{getUri:async()=>uu(C,i),instructions:{learnMoreUrl:"https://okx.com/web3/",steps:[{description:"wallet_connectors.okx.qr_code.step1.description",step:"install",title:"wallet_connectors.okx.qr_code.step1.title"},{description:"wallet_connectors.okx.qr_code.step2.description",step:"create",title:"wallet_connectors.okx.qr_code.step2.title"},{description:"wallet_connectors.okx.qr_code.step3.description",step:"scan",title:"wallet_connectors.okx.qr_code.step3.title"}]}}:void 0,extension:{instructions:{learnMoreUrl:"https://okx.com/web3/",steps:[{description:"wallet_connectors.okx.extension.step1.description",step:"install",title:"wallet_connectors.okx.extension.step1.title"},{description:"wallet_connectors.okx.extension.step2.description",step:"create",title:"wallet_connectors.okx.extension.step2.title"},{description:"wallet_connectors.okx.extension.step3.description",step:"refresh",title:"wallet_connectors.okx.extension.step3.title"}]}}}}}},Kt=({appName:u,chains:E,...n})=>{const i=v4("isCoinbaseWallet");return{id:"coinbase",name:"Coinbase Wallet",shortName:"Coinbase",iconUrl:async()=>(await x(async()=>{const{default:a}=await Promise.resolve().then(()=>Zt);return{default:a}},void 0)).default,iconAccent:"#2c5ff6",iconBackground:"#2c5ff6",installed:i||void 0,downloadUrls:{android:"https://play.google.com/store/apps/details?id=org.toshi",ios:"https://apps.apple.com/us/app/coinbase-wallet-store-crypto/id1278383455",mobile:"https://coinbase.com/wallet/downloads",qrCode:"https://coinbase-wallet.onelink.me/q5Sx/fdb9b250",chrome:"https://chrome.google.com/webstore/detail/coinbase-wallet-extension/hnfanknocfeofbddgcijnmhnfnkdnaad",browserExtension:"https://coinbase.com/wallet"},createConnector:()=>{const a=xu(),l=new q4({chains:E,options:{appName:u,headlessMode:!0,...n}});return{connector:l,...a?{}:{qrCode:{getUri:async()=>(await l.getProvider()).qrUrl,instructions:{learnMoreUrl:"https://coinbase.com/wallet/articles/getting-started-mobile",steps:[{description:"wallet_connectors.coinbase.qr_code.step1.description",step:"install",title:"wallet_connectors.coinbase.qr_code.step1.title"},{description:"wallet_connectors.coinbase.qr_code.step2.description",step:"create",title:"wallet_connectors.coinbase.qr_code.step2.title"},{description:"wallet_connectors.coinbase.qr_code.step3.description",step:"scan",title:"wallet_connectors.coinbase.qr_code.step3.title"}]}},extension:{instructions:{learnMoreUrl:"https://coinbase.com/wallet/articles/getting-started-extension",steps:[{description:"wallet_connectors.coinbase.extension.step1.description",step:"install",title:"wallet_connectors.coinbase.extension.step1.title"},{description:"wallet_connectors.coinbase.extension.step2.description",step:"create",title:"wallet_connectors.coinbase.extension.step2.title"},{description:"wallet_connectors.coinbase.extension.step3.description",step:"refresh",title:"wallet_connectors.coinbase.extension.step3.title"}]}}}}}}},GE=`{
  "connect_wallet": {
    "label": "اتصال المحفظة"
  },
  "intro": {
    "title": "ما هو المحفظة؟",
    "description": "تُستخدم المحفظة لإرسال واستلام وتخزين وعرض الأصول الرقمية. إنها أيضاً طريقة جديدة لتسجيل الدخول، دون الحاجة إلى إنشاء حسابات وكلمات مرور جديدة على كل موقع.",
    "digital_asset": {
      "title": "دار لأصولك الرقمية",
      "description": "تُستخدم المحافظ لإرسال واستلام وتخزين وعرض الأصول الرقمية مثل إيثيريوم والـ NFTs."
    },
    "login": {
      "title": "طريقة جديدة لتسجيل الدخول",
      "description": "بدلاً من إنشاء حسابات وكلمات مرور جديدة على كل موقع، فقط قم بتوصيل محفظتك."
    },
    "get": {
      "label": "احصل على محفظة"
    },
    "learn_more": {
      "label": "تعلم المزيد"
    }
  },
  "sign_in": {
    "label": "تحقق من حسابك",
    "description": "لإنهاء الاتصال، يجب عليك توقيع رسالة في محفظتك للتحقق من أنك صاحب هذا الحساب.",
    "message": {
      "send": "إرسال الرسالة",
      "preparing": "جارٍ تجهيز الرسالة...",
      "cancel": "إلغاء",
      "preparing_error": "خطأ في تجهيز الرسالة، يرجى المحاولة مرة أخرى!"
    },
    "signature": {
      "waiting": "انتظار التوقيع...",
      "verifying": "جار التحقق من التوقيع...",
      "signing_error": "خطأ في توقيع الرسالة، يرجى المحاولة مرة أخرى!",
      "verifying_error": "خطأ في التحقق من التوقيع، يرجى المحاولة مرة أخرى!",
      "oops_error": "عذرًا، حدث خطأ ما!"
    }
  },
  "connect": {
    "label": "اتصل",
    "title": "اتصال بالمحفظة",
    "new_to_ethereum": {
      "description": "جديد في محافظ Ethereum؟",
      "learn_more": {
        "label": "تعلم المزيد"
      }
    },
    "learn_more": {
      "label": "أعرف أكثر"
    },
    "recent": "الأخير",
    "status": {
      "opening": "جار فتح %{wallet}...",
      "connecting": "جارٍ الاتصال",
      "connect_mobile": "استمر في %{wallet}",
      "not_installed": "%{wallet} غير مثبت",
      "not_available": "%{wallet} غير متاح",
      "confirm": "تأكيد الاتصال في الامتداد",
      "confirm_mobile": "قبل طلب الاتصال في المحفظة"
    },
    "secondary_action": {
      "get": {
        "description": "لا يوجد لديك %{wallet}؟",
        "label": "احصل"
      },
      "install": {
        "label": "تثبيت"
      },
      "retry": {
        "label": "أعد المحاولة"
      }
    },
    "walletconnect": {
      "description": {
        "full": "هل تحتاج إلى النافذة الرسمية لـ WalletConnect؟",
        "compact": "هل تحتاج إلى النافذة لـ WalletConnect؟"
      },
      "open": {
        "label": "افتح"
      }
    }
  },
  "connect_scan": {
    "title": "المسح باستخدام %{wallet}",
    "fallback_title": "المسح باستخدام هاتفك"
  },
  "connector_group": {
    "recommended": "موصى به",
    "other": "آخر",
    "popular": "شائع",
    "more": "المزيد",
    "others": "الآخرين"
  },
  "get": {
    "title": "احصل على محفظة",
    "action": {
      "label": "احصل"
    },
    "mobile": {
      "description": "محفظة الموبايل"
    },
    "extension": {
      "description": "ملحق المتصفح"
    },
    "mobile_and_extension": {
      "description": "محفظة موبايل وملحق"
    },
    "mobile_and_desktop": {
      "description": "محفظة الموبايل والكمبيوتر"
    },
    "looking_for": {
      "title": "ليست هذه هي ما تبحث عنه؟",
      "mobile": {
        "description": "حدد محفظة على الشاشة الرئيسية للبدء باستخدام موفر محفظة مختلف."
      },
      "desktop": {
        "compact_description": "حدد محفظة على الشاشة الرئيسية للبدء باستخدام موفر محفظة مختلف.",
        "wide_description": "حدد محفظة على اليسار للبدء باستخدام موفر محفظة مختلف."
      }
    }
  },
  "get_options": {
    "title": "ابدأ مع %{wallet}",
    "short_title": "احصل على %{wallet}",
    "mobile": {
      "title": "%{wallet} للجوال",
      "description": "استخدم محفظة الموبايل لاستكشاف عالم Ethereum.",
      "download": {
        "label": "احصل على التطبيق"
      }
    },
    "extension": {
      "title": "%{wallet} لـ %{browser}",
      "description": "وصول لمحفظتك مباشرة من متصفح الويب المفضل لديك.",
      "download": {
        "label": "أضف إلى %{browser}"
      }
    },
    "desktop": {
      "title": "%{wallet} لـ %{platform}",
      "description": "قم بالوصول إلى محفظتك بشكل أصلي من كمبيوترك القوي.",
      "download": {
        "label": "أضف إلى %{platform}"
      }
    }
  },
  "get_mobile": {
    "title": "قم بالتثبيت %{wallet}",
    "description": "استخدم هاتفك للتحميل على iOS أو Android",
    "continue": {
      "label": "استمر"
    }
  },
  "get_instructions": {
    "mobile": {
      "connect": {
        "label": "اتصل"
      },
      "learn_more": {
        "label": "تعلم المزيد"
      }
    },
    "extension": {
      "refresh": {
        "label": "تحديث"
      },
      "learn_more": {
        "label": "تعلم المزيد"
      }
    },
    "desktop": {
      "connect": {
        "label": "اتصل"
      },
      "learn_more": {
        "label": "تعلم المزيد"
      }
    }
  },
  "chains": {
    "title": "تبديل الشبكات",
    "wrong_network": "تم اكتشاف شبكة غير صحيحة، قم بالتبديل أو القطع للمتابعة.",
    "confirm": "التأكيد في المحفظة",
    "switching_not_supported": "محفظتك لا تدعم التبديل بين الشبكات من %{appName}. جرب التبديل بين الشبكات من داخل المحفظة بدلاً من ذلك.",
    "switching_not_supported_fallback": "محفظتك لا تدعم تبديل الشبكات من هذا التطبيق. حاول تبديل الشبكات من داخل المحفظة بدلاً من ذلك.",
    "disconnect": "قطع الاتصال",
    "connected": "متصل"
  },
  "profile": {
    "disconnect": {
      "label": "قطع الاتصال"
    },
    "copy_address": {
      "label": "نسخ العنوان",
      "copied": "تم النسخ!"
    },
    "explorer": {
      "label": "عرض المزيد على المستكشف"
    },
    "transactions": {
      "description": "%{appName} ستظهر المعاملات هنا...",
      "description_fallback": "سوف تظهر معاملاتك هنا...",
      "recent": {
        "title": "المعاملات الأخيرة"
      },
      "clear": {
        "label": "مسح الكل"
      }
    }
  },
  "wallet_connectors": {
    "argent": {
      "qr_code": {
        "step1": {
          "description": "ضع أرجنت على شاشتك الرئيسية للوصول السريع إلى محفظتك.",
          "title": "افتح تطبيق Argent"
        },
        "step2": {
          "description": "أنشئ محفظة واسم مستخدم، أو استورد محفظة موجودة بالفعل.",
          "title": "إنشاء أو استيراد محفظة"
        },
        "step3": {
          "description": "بعد الفحص، سيظهر لك موجه الاتصال لتوصيل المحفظة الخاصة بك.",
          "title": "اضغط على زر فحص الكود الشريطي"
        }
      }
    },
    "bifrost": {
      "qr_code": {
        "step1": {
          "description": "نوصي بوضع محفظة Bifrost على الشاشة الرئيسية للوصول الأسرع.",
          "title": "افتح تطبيق محفظة Bifrost"
        },
        "step2": {
          "description": "أنشئ أو استورد محفظة باستخدام عبارة الاستعادة الخاصة بك.",
          "title": "إنشاء أو استيراد محفظة"
        },
        "step3": {
          "description": "بعد الفحص، سيظهر موجه الاتصال لك لتوصيل محفظتك.",
          "title": "اضغط على زر المسح"
        }
      }
    },
    "bitget": {
      "qr_code": {
        "step1": {
          "description": "نوصي بوضع محفظة Bitget على الشاشة الرئيسية للوصول الأسرع.",
          "title": "افتح تطبيق محفظة Bitget"
        },
        "step2": {
          "description": "تأكد من عمل نسخة احتياطية لمحفظتك باستخدام طريقة آمنة. لا تشارك عبارتك السرية مع أحد.",
          "title": "إنشاء أو استيراد محفظة"
        },
        "step3": {
          "description": "بعد الفحص، ستظهر لك موجه اتصال لتوصيل محفظتك.",
          "title": "اضغط على زر الفحص"
        }
      },
      "extension": {
        "step1": {
          "description": "نوصي بتثبيت محفظة Bitget على شريط المهام للوصول الأسرع إلى محفظتك.",
          "title": "قم بتثبيت امتداد محفظة Bitget"
        },
        "step2": {
          "description": "تأكد من نسخ محفظتك احتياطيًا باستخدام طريقة آمنة. لا تشارك عبارتك السرية مع أي شخص.",
          "title": "أنشئ محفظة أو استورد محفظة"
        },
        "step3": {
          "description": "بمجرد إعداد محفظتك، انقر أدناه لتحديث المتصفح وتحميل الامتداد.",
          "title": "قم بتحديث متصفحك"
        }
      }
    },
    "bitski": {
      "extension": {
        "step1": {
          "description": "نوصي بتثبيت Bitski على شريط المهام الخاص بك للوصول الأسرع إلى محفظتك.",
          "title": "قم بتثبيت امتداد Bitski"
        },
        "step2": {
          "description": "تأكد من الاحتفاظ بنسخة احتياطية من محفظتك باستخدام طريقة آمنة. لا تشارك عبارتك السرية مع أي شخص.",
          "title": "إنشاء أو استيراد محفظة"
        },
        "step3": {
          "description": "بعد إعداد المحفظة الخاصة بك، انقر أدناه لتحديث المتصفح وتحميل الإضافة.",
          "title": "تحديث المتصفح الخاص بك"
        }
      }
    },
    "coin98": {
      "qr_code": {
        "step1": {
          "description": "نوصي بوضع محفظة Coin98 على الشاشة الرئيسية لسرعة الوصول إلى محفظتك.",
          "title": "افتح تطبيق محفظة Coin98"
        },
        "step2": {
          "description": "يمكنك بسهولة نسخ محفظتك الاحتياطي باستخدام ميزة النسخ الاحتياطي على هاتفك.",
          "title": "إنشاء أو استيراد محفظة"
        },
        "step3": {
          "description": "بعد الفحص، ستظهر لك مطالبة بالاتصال لتوصيل محفظتك.",
          "title": "اضغط على زر WalletConnect"
        }
      },
      "extension": {
        "step1": {
          "description": "انقر في الجزء العلوي الأيمن من المتصفح وثبت Coin98 Wallet لسهولة الوصول.",
          "title": "قم بتثبيت امتداد Coin98 Wallet"
        },
        "step2": {
          "description": "أنشئ محفظة جديدة أو استورد واحدة موجودة بالفعل.",
          "title": "أنشئ محفظة أو استورد محفظة"
        },
        "step3": {
          "description": "بمجرد إعداد Coin98 Wallet ، انقر أدناه لتحديث المتصفح وتحميل الامتداد.",
          "title": "تحديث المتصفح الخاص بك"
        }
      }
    },
    "coinbase": {
      "qr_code": {
        "step1": {
          "description": "نوصي بوضع Coinbase Wallet على الشاشة الرئيسية لسهولة الوصول.",
          "title": "افتح تطبيق Coinbase Wallet"
        },
        "step2": {
          "description": "يمكنك بسهولة النسخ الاحتياطي لمحفظتك باستخدام ميزة النسخ الاحتياطي السحابي.",
          "title": "إنشاء أو استيراد محفظة"
        },
        "step3": {
          "description": "بعد الفحص، ستظهر لك مطالبة بالاتصال لتوصيل محفظتك.",
          "title": "اضغط على زر الفحص"
        }
      },
      "extension": {
        "step1": {
          "description": "نوصي بتثبيت محفظة Coinbase على شريط المهام الخاص بك للوصول الأسرع إلى محفظتك.",
          "title": "تثبيت امتداد محفظة Coinbase"
        },
        "step2": {
          "description": "تأكد من النسخ الاحتياطي لمحفظتك باستخدام طريقة آمنة. لا تشارك عبارتك السرية مع أي شخص.",
          "title": "إنشاء أو استيراد المحفظة"
        },
        "step3": {
          "description": "بمجرد إعداد محفظتك، انقر أدناه لتحديث المتصفح وتحميل الإضافة.",
          "title": "تحديث المتصفح الخاص بك"
        }
      }
    },
    "core": {
      "qr_code": {
        "step1": {
          "description": "نوصي بوضع Core على الشاشة الرئيسية للوصول السريع إلى محفظتك.",
          "title": "افتح تطبيق Core"
        },
        "step2": {
          "description": "يمكنك بسهولة النسخ الاحتياطي لمحفظتك باستخدام ميزة النسخ الاحتياطي على هاتفك.",
          "title": "إنشاء أو استيراد المحفظة"
        },
        "step3": {
          "description": "بعد الفحص، سيظهر لك موجه الاتصال لتوصيل محفظتك.",
          "title": "اضغط على زر WalletConnect"
        }
      },
      "extension": {
        "step1": {
          "description": "نوصي بتثبيت Core على شريط المهام الخاص بك للوصول الأسرع إلى محفظتك.",
          "title": "قم بتثبيت امتداد Core"
        },
        "step2": {
          "description": "تأكد من عمل نسخة احتياطية لمحفظتك باستخدام طريقة آمنة. لا تشارك عبارتك السرية مع أي شخص.",
          "title": "إنشاء أو استيراد محفظة"
        },
        "step3": {
          "description": "بمجرد إعداد محفظتك، انقر أدناه لتحديث المتصفح وتحميل الامتداد.",
          "title": "تحديث متصفحك"
        }
      }
    },
    "fox": {
      "qr_code": {
        "step1": {
          "description": "نوصي بوضع FoxWallet على شاشتك الرئيسية للوصول الأسرع.",
          "title": "افتح تطبيق FoxWallet"
        },
        "step2": {
          "description": "تأكد من الاحتفاظ بنسخة احتياطية من محفظتك باستخدام طريقة آمنة. لا تشارك عبارتك السرية مع أي شخص.",
          "title": "إنشاء محفظة أو استيراد محفظة"
        },
        "step3": {
          "description": "بعد الفحص، ستظهر لك موجه الاتصال لتتمكن من اتصال محفظتك.",
          "title": "اضغط على زر الفحص"
        }
      }
    },
    "frontier": {
      "qr_code": {
        "step1": {
          "description": "نوصي بوضع Frontier Wallet على شاشتك الرئيسية للوصول الأسرع.",
          "title": "افتح تطبيق Frontier Wallet"
        },
        "step2": {
          "description": "تأكد من نسخ محفظتك احتياطيا باستخدام طريقة آمنة. لا تشارك عبارتك السرية مع أي شخص.",
          "title": "إنشاء أو استيراد محفظة"
        },
        "step3": {
          "description": "بعد الفحص، ستظهر لك موجه الاتصال لربط محفظتك.",
          "title": "اضغط على زر الفحص"
        }
      },
      "extension": {
        "step1": {
          "description": "نوصي بتثبيت محفظة Frontier على شريط المهام للوصول الأسرع إلى محفظتك.",
          "title": "تثبيت امتداد محفظة Frontier"
        },
        "step2": {
          "description": "تأكد من نسخ محفظتك احتياطيا باستخدام طريقة آمنة. لا تشارك عبارتك السرية مع أي شخص.",
          "title": "إنشاء أو استيراد محفظة"
        },
        "step3": {
          "description": "بمجرد إعداد محفظتك، انقر أدناه لتحديث المتصفح وتحميل الإضافة.",
          "title": "قم بتحديث المتصفح الخاص بك"
        }
      }
    },
    "im_token": {
      "qr_code": {
        "step1": {
          "title": "افتح تطبيق imToken",
          "description": "ضع تطبيق imToken على الشاشة الرئيسية للوصول الأسرع إلى محفظتك."
        },
        "step2": {
          "title": "إنشاء أو استيراد محفظة",
          "description": "قم بإنشاء محفظة جديدة أو استيراد واحدة موجودة."
        },
        "step3": {
          "title": "اضغط على أيقونة الماسح الضوئي في الزاوية العليا اليمنى",
          "description": "اختر الاتصال الجديد، ثم امسح الرمز الشريطي وأكد الموجه للاتصال."
        }
      }
    },
    "metamask": {
      "qr_code": {
        "step1": {
          "title": "افتح تطبيق MetaMask",
          "description": "نوصي بوضع MetaMask على الشاشة الرئيسية لديك للوصول بشكل أسرع."
        },
        "step2": {
          "title": "إنشاء أو استيراد محفظة",
          "description": "تأكد من نسخ الحفاظ على محفظتك باستخدام طريقة آمنة. لا تشارك عبارتك السرية مع أي شخص."
        },
        "step3": {
          "title": "اضغط على زر المسح",
          "description": "بعد الفحص، ستظهر لك موجه اتصال لتوصيل محفظتك."
        }
      },
      "extension": {
        "step1": {
          "title": "قم بتثبيت امتداد MetaMask",
          "description": "نوصي بتثبيت MetaMask في شريط المهام للوصول الأسرع إلى محفظتك."
        },
        "step2": {
          "title": "إنشاء أو استيراد محفظة",
          "description": "تأكد من نسخ احتياطي لمحفظتك باستخدام طريقة آمنة. لا تشارك عبارتك السرية مع أي شخص."
        },
        "step3": {
          "title": "تحديث متصفحك",
          "description": "بمجرد إعداد محفظتك، انقر أدناه لتحديث المتصفح وتحميل الامتداد."
        }
      }
    },
    "okx": {
      "qr_code": {
        "step1": {
          "title": "افتح تطبيق محفظة OKX",
          "description": "نوصي بوضع محفظة OKX على الشاشة الرئيسية للوصول الأسرع."
        },
        "step2": {
          "title": "إنشاء أو استيراد محفظة",
          "description": "تأكد من نسخ احتياطي لمحفظتك باستخدام طريقة آمنة. لا تشارك عبارتك السرية مع أي شخص."
        },
        "step3": {
          "title": "اضغط على زر المسح",
          "description": "بعد الفحص، ستظهر لك مطالبة بالاتصال لتوصيل محفظتك."
        }
      },
      "extension": {
        "step1": {
          "title": "قم بتثبيت امتداد محفظة OKX",
          "description": "نوصي بتثبيت محفظة OKX على شريط المهام للوصول الأسرع إلى محفظتك."
        },
        "step2": {
          "title": "إنشاء أو استيراد محفظة",
          "description": "تأكد من حفظ نسخة احتياطية من محفظتك باستخدام طريقة آمنة. لا تشارك عبارتك السرية مع أي شخص."
        },
        "step3": {
          "title": "قم بتحديث المتصفح الخاص بك",
          "description": "بمجرد إعداد محفظتك، انقر أدناه لتحديث المتصفح وتحميل الإضافة."
        }
      }
    },
    "omni": {
      "qr_code": {
        "step1": {
          "title": "افتح تطبيق Omni",
          "description": "أضف Omni إلى شاشتك الرئيسية للوصول الأسرع إلى محفظتك."
        },
        "step2": {
          "title": "إنشاء أو استيراد محفظة",
          "description": "إنشاء محفظة جديدة أو استيراد واحدة موجودة."
        },
        "step3": {
          "title": "اضغط على أيقونة الرمز الاستجابة السريعة وامسحها",
          "description": "اضغط على الرمز QR على الشاشة الرئيسية الخاصة بك، امسح الرمز وأكد الموافقة للاتصال."
        }
      }
    },
    "token_pocket": {
      "qr_code": {
        "step1": {
          "title": "افتح تطبيق TokenPocket",
          "description": "نوصي بوضع TokenPocket على الشاشة الرئيسية للوصول السريع."
        },
        "step2": {
          "title": "إنشاء أو استيراد محفظة",
          "description": "تأكد من نسخ احتياطي لمحفظتك باستخدام طريقة آمنة. لا تشارك عبارتك السرية مع أي شخص."
        },
        "step3": {
          "title": "اضغط على زر المسح",
          "description": "بعد الفحص، ستظهر لك رسالة موجهة للاتصال بمحفظتك."
        }
      },
      "extension": {
        "step1": {
          "title": "قم بتثبيت امتداد TokenPocket",
          "description": "نوصي بتثبيت TokenPocket على شريط المهام الخاص بك للوصول الأسرع إلى محفظتك."
        },
        "step2": {
          "title": "قم بإنشاء محفظة أو استيراد محفظة",
          "description": "تأكد من الاحتفاظ بنسخة احتياطية من محفظتك باستخدام طريقة آمنة. لا تشارك عبارتك السرية مع أي شخص."
        },
        "step3": {
          "title": "قم بتحديث المتصفح الخاص بك",
          "description": "بمجرد إعداد محفظتك، انقر أدناه لتحديث المتصفح وتحميل الإضافة."
        }
      }
    },
    "trust": {
      "qr_code": {
        "step1": {
          "title": "افتح تطبيق Trust Wallet",
          "description": "ضع Trust Wallet على الشاشة الرئيسية للوصول السريع إلى محفظتك."
        },
        "step2": {
          "title": "أنشئ محفظة أو استورد محفظة",
          "description": "أنشئ محفظة جديدة أو استورد واحدة موجودة."
        },
        "step3": {
          "title": "اضغط على WalletConnect في الإعدادات",
          "description": "اختر الاتصال الجديد، ثم امسح الرمز الشريطي QR وأكد الموجه للاتصال."
        }
      },
      "extension": {
        "step1": {
          "title": "قم بتثبيت امتداد Trust Wallet",
          "description": "انقر في الجزء العلوي الأيمن من المتصفح وثبت Trust Wallet للوصول بسهولة."
        },
        "step2": {
          "title": "أنشئ محفظة أو استورد محفظة",
          "description": "أنشئ محفظة جديدة أو استورد واحدة موجودة."
        },
        "step3": {
          "title": "قم بتحديث متصفحك",
          "description": "بمجرد إعداد Trust Wallet، انقر أدناه لتحديث المتصفح وتحميل الإضافة."
        }
      }
    },
    "uniswap": {
      "qr_code": {
        "step1": {
          "title": "افتح تطبيق Uniswap",
          "description": "أضف محفظة Uniswap إلى شاشة الرئيسية للوصول الأسرع إلى محفظتك."
        },
        "step2": {
          "title": "إنشاء أو استيراد محفظة",
          "description": "قم بإنشاء محفظة جديدة أو استيراد واحدة موجودة."
        },
        "step3": {
          "title": "اضغط على الأيقونة QR واقرأ الرمز",
          "description": "اضغط على أيقونة QR على الشاشة الرئيسية، قراءة الرمز وتأكيد الرسالة الموجهة للاتصال."
        }
      }
    },
    "zerion": {
      "qr_code": {
        "step1": {
          "title": "افتح تطبيق Zerion",
          "description": "نوصي بوضع Zerion على شاشتك الرئيسية للوصول الأسرع."
        },
        "step2": {
          "title": "إنشاء أو استيراد محفظة",
          "description": "تأكد من حفظ نسخة احتياطية من محفظتك باستخدام طريقة آمنة. لا تشارك عبارتك السرية مع أي شخص."
        },
        "step3": {
          "title": "اضغط على زر المسح",
          "description": "بعد المسح، سوف يظهر لك نافذة الاتصال لتوصيل محفظتك."
        }
      },
      "extension": {
        "step1": {
          "title": "تثبيت امتداد Zerion",
          "description": "نوصي بتثبيت Zerion على شريط المهام الخاص بك للوصول الأسرع إلى محفظتك."
        },
        "step2": {
          "title": "إنشاء أو استيراد محفظة",
          "description": "تأكد من الاحتفاظ بنسخة احتياطية من محفظتك باستخدام طريقة آمنة. لا تشارك عبارتك السرية مع أي شخص."
        },
        "step3": {
          "title": "قم بتحديث المتصفح الخاص بك",
          "description": "بمجرد إعداد محفظتك، انقر أدناه لتحديث المتصفح وتحميل الإضافة."
        }
      }
    },
    "rainbow": {
      "qr_code": {
        "step1": {
          "title": "افتح تطبيق Rainbow",
          "description": "نوصي بوضع Rainbow على شاشة البداية للوصول الأسرع إلى محفظتك."
        },
        "step2": {
          "title": "إنشاء محفظة أو استيراد محفظة",
          "description": "يمكنك عمل نسخة احتياطية بسهولة لمحفظتك باستخدام ميزة النسخ الاحتياطي على هاتفك."
        },
        "step3": {
          "title": "اضغط على الزر الماسح الضوئي",
          "description": "بعد الفحص، سيظهر لك موجه اتصال لربط محفظتك."
        }
      }
    },
    "enkrypt": {
      "extension": {
        "step1": {
          "description": "نوصي بتثبيت محفظة Enkrypt على شريط المهام الخاص بك للوصول الأسرع إلى محفظتك.",
          "title": "تثبيت امتداد محفظة Enkrypt"
        },
        "step2": {
          "description": "تأكد من عمل نسخة احتياطية لمحفظتك باستخدام طريقة آمنة. لا تشارك عبارتك السرية مع أي شخص.",
          "title": "أنشئ أو استورد محفظة"
        },
        "step3": {
          "description": "بمجرد إعداد محفظتك، انقر أدناه لتحديث المتصفح وتحميل الإضافة.",
          "title": "حدث المتصفح الخاص بك"
        }
      }
    },
    "frame": {
      "extension": {
        "step1": {
          "description": "نوصي بتعليق Frame على شريط المهام للوصول السريع إلى محفظتك.",
          "title": "ثبت Frame والإضافة المصاحبة"
        },
        "step2": {
          "description": "تأكد من النسخ الاحتياطي لمحفظتك باستخدام طريقة آمنة. لا تشارك عبارتك السرية مع أي شخص.",
          "title": "أنشئ أو استورد محفظة"
        },
        "step3": {
          "description": "بمجرد إعداد محفظتك، انقر أدناه لتحديث المتصفح وتحميل الإضافة.",
          "title": "حدث المتصفح الخاص بك"
        }
      }
    },
    "one_key": {
      "extension": {
        "step1": {
          "title": "قم بتثبيت امتداد محفظة OneKey",
          "description": "نوصي بتثبيت محفظة OneKey على شريط المهام للوصول السريع إلى محفظتك."
        },
        "step2": {
          "title": "إنشاء أو استيراد محفظة",
          "description": "تأكد من نسخ احتياطي لمحفظتك باستخدام طريقة آمنة. لا تشارك عبارتك السرية مع أي شخص."
        },
        "step3": {
          "title": "تحديث المتصفح الخاص بك",
          "description": "بمجرد إعداد محفظتك، انقر أدناه لتحديث المتصفح وتحميل الامتداد."
        }
      }
    },
    "phantom": {
      "extension": {
        "step1": {
          "title": "قم بتثبيت امتداد Phantom",
          "description": "نوصي بتثبيت Phantom على شريط المهام للوصول الأسهل إلى محفظتك."
        },
        "step2": {
          "title": "إنشاء أو استيراد محفظة",
          "description": "تأكد من نسخ محفظتك احتياطيًا باستخدام طريقة آمنة. لا تشارك عبارة الاستعادة السرية الخاصة بك مع أي شخص."
        },
        "step3": {
          "title": "قم بتحديث المتصفح",
          "description": "بمجرد إعداد المحفظة، انقر أدناه لتحديث المتصفح وتحميل الإضافة."
        }
      }
    },
    "rabby": {
      "extension": {
        "step1": {
          "title": "ثبت امتداد Rabby",
          "description": "نوصي بتثبيت Rabby على شريط المهام للوصول الأسرع إلى محفظتك."
        },
        "step2": {
          "title": "أنشئ محفظة أو استورد محفظة",
          "description": "تأكد من نسخ محفظتك احتياطيًا باستخدام طريقة آمنة. لا تشارك العبارة السرية مع أي شخص."
        },
        "step3": {
          "title": "قم بتحديث المتصفح",
          "description": "بمجرد إعداد محفظتك، انقر أدناه لتحديث المتصفح وتحميل الإضافة."
        }
      }
    },
    "safeheron": {
      "extension": {
        "step1": {
          "title": "قم بتثبيت إضافة النواة",
          "description": "نوصي بتثبيت Safeheron على شريط المهام الخاص بك للوصول السريع إلى محفظتك."
        },
        "step2": {
          "title": "إنشاء أو استيراد محفظة",
          "description": "تأكد من نسخ محفظتك بطريقة آمنة. لا تشارك عبارتك السرية مع أي شخص."
        },
        "step3": {
          "title": "تحديث المتصفح الخاص بك",
          "description": "بمجرد إعداد محفظتك، انقر أدناه لتحديث المتصفح وتحميل الإضافة."
        }
      }
    },
    "taho": {
      "extension": {
        "step1": {
          "title": "تثبيت إضافة Taho",
          "description": "نوصي بتثبيت Taho على شريط المهام الخاص بك للوصول الأسرع إلى محفظتك."
        },
        "step2": {
          "title": "إنشاء محفظة أو استيراد محفظة",
          "description": "تأكد من النسخ الاحتياطي لمحفظتك باستخدام طريقة آمنة. لا تشارك عبارتك السرية مع أي شخص."
        },
        "step3": {
          "title": "تحديث المتصفح الخاص بك",
          "description": "بمجرد إعداد محفظتك، انقر أدناه لتحديث المتصفح وتحميل الإضافة."
        }
      }
    },
    "talisman": {
      "extension": {
        "step1": {
          "title": "تثبيت إضافة Talisman",
          "description": "نوصي بتثبيت Talisman على شريط المهام الخاص بك للوصول الأسرع إلى محفظتك."
        },
        "step2": {
          "title": "إنشاء محفظة Ethereum أو استيرادها",
          "description": "تأكد من النسخ الاحتياطي لمحفظتك باستخدام طريقة آمنة. لا تشارك عبارة الاستعادة الخاصة بك مع أي شخص."
        },
        "step3": {
          "title": "قم بتحديث المستعرض الخاص بك",
          "description": "بمجرد إعداد محفظتك، انقر أدناه لتحديث المستعرض وتحميل الإضافة."
        }
      }
    },
    "xdefi": {
      "extension": {
        "step1": {
          "title": "قم بتثبيت إضافة XDEFI Wallet",
          "description": "نوصي بتثبيت XDEFI Wallet على شريط المهام للوصول الأسرع إلى محفظتك."
        },
        "step2": {
          "title": "أنشئ محفظة أو استورد محفظة",
          "description": "تأكد من النسخ الاحتياطي لمحفظتك باستخدام طريقة آمنة. لا تشارك العبارة السرية الخاصة بك مع أي شخص."
        },
        "step3": {
          "title": "قم بتحديث المستعرض الخاص بك",
          "description": "بمجرد إعداد محفظتك، انقر أدناه لتحديث المتصفح وتحميل الإضافة."
        }
      }
    },
    "zeal": {
      "extension": {
        "step1": {
          "title": "قم بتثبيت امتداد Zeal",
          "description": "نوصي بتثبيت Zeal في شريط المهام الخاص بك للوصول الأسرع إلى محفظتك."
        },
        "step2": {
          "title": "إنشاء أو استيراد محفظة",
          "description": "تأكد من عمل نسخة احتياطية لمحفظتك باستخدام طريقة آمنة. لا تشارك عبارتك السرية مع أحد."
        },
        "step3": {
          "title": "قم بتحديث متصفحك",
          "description": "بمجرد إعداد محفظتك، انقر أدناه لتحديث المتصفح وتحميل الامتداد."
        }
      }
    },
    "safepal": {
      "extension": {
        "step1": {
          "title": "قم بتثبيت صيغة SafePal Wallet",
          "description": "انقر في أعلى يمين المتصفح وثبت صيغة SafePal Wallet لسهولة الوصول."
        },
        "step2": {
          "title": "أنشئ محفظة أو استورد محفظة",
          "description": "أنشئ محفظة جديدة أو استورد واحدة موجودة بالفعل."
        },
        "step3": {
          "title": "قم بتحديث متصفحك",
          "description": "بمجرد إعداد محفظة SafePal، انقر أدناه لتحديث المتصفح وتحميل الإضافة."
        }
      },
      "qr_code": {
        "step1": {
          "title": "افتح تطبيق محفظة SafePal",
          "description": "ضع محفظة SafePal على شاشة الرئيسية لسهولة الوصول إلى محفظتك."
        },
        "step2": {
          "title": "إنشاء أو استيراد محفظة",
          "description": "أنشئ محفظة جديدة أو استورد واحدة موجودة بالفعل."
        },
        "step3": {
          "title": "اضغط على WalletConnect في الإعدادات",
          "description": "اختر الاتصال الجديد، ثم امسح الرمز الشريطي وأكد الموجه للاتصال."
        }
      }
    },
    "desig": {
      "extension": {
        "step1": {
          "title": "قم بتثبيت إضافة Desig",
          "description": "نوصي بتثبيت Desig على شريط المهام الخاص بك للوصول الأسهل إلى محفظتك."
        },
        "step2": {
          "title": "إنشاء محفظة",
          "description": "تأكد من عمل نسخة احتياطية لمحفظتك باستخدام طريقة آمنة. لا تشارك عبارتك السرية مع أحد."
        },
        "step3": {
          "title": "قم بتحديث متصفحك",
          "description": "بمجرد إعداد محفظتك، انقر أدناه لتحديث المتصفح وتحميل الامتداد."
        }
      }
    },
    "subwallet": {
      "extension": {
        "step1": {
          "title": "قم بتثبيت إضافة SubWallet",
          "description": "نوصي بتثبيت SubWallet على شريط المهام الخاص بك للوصول الأسرع إلى محفظتك."
        },
        "step2": {
          "title": "إنشاء أو استيراد محفظة",
          "description": "تأكد من النسخ الاحتياطي لمحفظتك باستخدام طريقة آمنة. لا تشارك عبارة الاستعادة الخاصة بك مع أي شخص."
        },
        "step3": {
          "title": "قم بتحديث متصفحك",
          "description": "بمجرد إعداد محفظتك، انقر أدناه لتحديث المتصفح وتحميل الامتداد."
        }
      },
      "qr_code": {
        "step1": {
          "title": "افتح تطبيق SubWallet",
          "description": "نوصي بوضع SubWallet على شاشة الرئيسية الخاصة بك للوصول الأسرع."
        },
        "step2": {
          "title": "إنشاء أو استيراد محفظة",
          "description": "تأكد من عمل نسخة احتياطية لمحفظتك باستخدام طريقة آمنة. لا تشارك عبارتك السرية مع أحد."
        },
        "step3": {
          "title": "اضغط على زر المسح",
          "description": "بعد الفحص، سيظهر لك موجه الاتصال لتوصيل المحفظة الخاصة بك."
        }
      }
    },
    "clv": {
      "extension": {
        "step1": {
          "title": "قم بتثبيت إضافة CLV Wallet",
          "description": "نوصي بتثبيت CLV Wallet على شريط المهام الخاص بك للوصول الأسرع إلى محفظتك."
        },
        "step2": {
          "title": "إنشاء أو استيراد محفظة",
          "description": "تأكد من عمل نسخة احتياطية لمحفظتك باستخدام طريقة آمنة. لا تشارك عبارتك السرية مع أحد."
        },
        "step3": {
          "title": "قم بتحديث متصفحك",
          "description": "بمجرد إعداد محفظتك، انقر أدناه لتحديث المتصفح وتحميل الامتداد."
        }
      },
      "qr_code": {
        "step1": {
          "title": "افتح تطبيق محفظة CLV",
          "description": "نوصي بوضع محفظة CLV على الشاشة الرئيسية للوصول الأسرع."
        },
        "step2": {
          "title": "إنشاء أو استيراد محفظة",
          "description": "تأكد من عمل نسخة احتياطية لمحفظتك باستخدام طريقة آمنة. لا تشارك عبارتك السرية مع أحد."
        },
        "step3": {
          "title": "اضغط على زر المسح",
          "description": "بعد الفحص، سيظهر لك موجه الاتصال لتوصيل المحفظة الخاصة بك."
        }
      }
    },
    "okto": {
      "qr_code": {
        "step1": {
          "title": "افتح تطبيق Okto",
          "description": "أضف Okto إلى الشاشة الرئيسية للوصول السريع"
        },
        "step2": {
          "title": "أنشئ محفظة MPC",
          "description": "أنشئ حسابًا وقم بإنشاء محفظة"
        },
        "step3": {
          "title": "اضغط على WalletConnect في الإعدادات",
          "description": "اضغط على أيقونة فحص الشاشة في الجهة العليا اليمنى وأكد الإدخال للاتصال."
        }
      }
    },
    "ledger": {
      "desktop": {
        "step1": {
          "title": "افتح تطبيق Ledger Live",
          "description": "نوصي بوضع Ledger Live على شاشة الرئيسية لديك لسرعة الوصول."
        },
        "step2": {
          "title": "قم بإعداد Ledger الخاص بك",
          "description": "قم بإعداد Ledger جديد أو قم بالاتصال بواحد موجود ."
        },
        "step3": {
          "title": "اتصل",
          "description": "بعد المسح، سوف يظهر لك نافذة الاتصال لتوصيل محفظتك."
        }
      },
      "qr_code": {
        "step1": {
          "title": "افتح تطبيق Ledger Live",
          "description": "نوصي بوضع Ledger Live على شاشة الرئيسية لديك لسرعة الوصول."
        },
        "step2": {
          "title": "قم بإعداد Ledger الخاص بك",
          "description": "يمكنك إما المزامنة مع تطبيق سطح المكتب أو توصيل Ledger الخاص بك."
        },
        "step3": {
          "title": "مسح الرمز",
          "description": "اضغط على WalletConnect ثم انتقل إلى الفحص. بعد المسح، سوف يظهر لك نافذة الاتصال لتوصيل محفظتك."
        }
      }
    }
  }
}
`;const fE=Object.freeze(Object.defineProperty({__proto__:null,default:GE},Symbol.toStringTag,{value:"Module"})),b0=Object.freeze(Object.defineProperty({__proto__:null,default:hu},Symbol.toStringTag,{value:"Module"}));var PE=`{
  "connect_wallet": {
    "label": "Conectar la billetera"
  },
  "intro": {
    "title": "¿Qué es una billetera?",
    "description": "Una billetera se usa para enviar, recibir, almacenar y mostrar activos digitales. También es una nueva forma de iniciar sesión, sin necesidad de crear nuevas cuentas y contraseñas en cada sitio web.",
    "digital_asset": {
      "title": "Un hogar para tus Activos Digitales",
      "description": "Las carteras se utilizan para enviar, recibir, almacenar y mostrar activos digitales como Ethereum y NFTs."
    },
    "login": {
      "title": "Una nueva forma de iniciar sesión",
      "description": "En lugar de crear nuevas cuentas y contraseñas en cada sitio web, simplemente conecta tu cartera."
    },
    "get": {
      "label": "Obtener una billetera"
    },
    "learn_more": {
      "label": "Obtener más información"
    }
  },
  "sign_in": {
    "label": "Verifica tu cuenta",
    "description": "Para terminar de conectar, debes firmar un mensaje en tu billetera para verificar que eres el propietario de esta cuenta.",
    "message": {
      "send": "Enviar mensaje",
      "preparing": "Preparando mensaje...",
      "cancel": "Cancelar",
      "preparing_error": "Error al preparar el mensaje, ¡intenta de nuevo!"
    },
    "signature": {
      "waiting": "Esperando firma...",
      "verifying": "Verificando firma...",
      "signing_error": "Error al firmar el mensaje, ¡intenta de nuevo!",
      "verifying_error": "Error al verificar la firma, ¡intenta de nuevo!",
      "oops_error": "¡Ups! Algo salió mal."
    }
  },
  "connect": {
    "label": "Conectar",
    "title": "Conectar una billetera",
    "new_to_ethereum": {
      "description": "¿Eres nuevo en las billeteras Ethereum?",
      "learn_more": {
        "label": "Obtener más información"
      }
    },
    "learn_more": {
      "label": "Obtener más información"
    },
    "recent": "Reciente",
    "status": {
      "opening": "Abriendo %{wallet}...",
      "connecting": "Conectando",
      "connect_mobile": "Continuar en %{wallet}",
      "not_installed": "%{wallet} no está instalado",
      "not_available": "%{wallet} no está disponible",
      "confirm": "Confirma la conexión en la extensión",
      "confirm_mobile": "Aceptar la solicitud de conexión en la cartera"
    },
    "secondary_action": {
      "get": {
        "description": "¿No tienes %{wallet}?",
        "label": "OBTENER"
      },
      "install": {
        "label": "INSTALAR"
      },
      "retry": {
        "label": "REINTENTAR"
      }
    },
    "walletconnect": {
      "description": {
        "full": "¿Necesitas el modal oficial de WalletConnect?",
        "compact": "¿Necesitas el modal de WalletConnect?"
      },
      "open": {
        "label": "ABRIR"
      }
    }
  },
  "connect_scan": {
    "title": "Escanea con %{wallet}",
    "fallback_title": "Escanea con tu teléfono"
  },
  "connector_group": {
    "recommended": "Recomendado",
    "other": "Otro",
    "popular": "Popular",
    "more": "Más",
    "others": "Otros"
  },
  "get": {
    "title": "Obtener una billetera",
    "action": {
      "label": "OBTENER"
    },
    "mobile": {
      "description": "Billetera Móvil"
    },
    "extension": {
      "description": "Extensión de navegador"
    },
    "mobile_and_extension": {
      "description": "Billetera móvil y extensión"
    },
    "mobile_and_desktop": {
      "description": "Billetera Móvil y de Escritorio"
    },
    "looking_for": {
      "title": "¿No es lo que estás buscando?",
      "mobile": {
        "description": "Seleccione una billetera en la pantalla principal para comenzar con un proveedor de billetera diferente."
      },
      "desktop": {
        "compact_description": "Seleccione una cartera en la pantalla principal para comenzar con un proveedor de cartera diferente.",
        "wide_description": "Seleccione una cartera a la izquierda para comenzar con un proveedor de cartera diferente."
      }
    }
  },
  "get_options": {
    "title": "Comienza con %{wallet}",
    "short_title": "Obtener %{wallet}",
    "mobile": {
      "title": "%{wallet} para móvil",
      "description": "Use la billetera móvil para explorar el mundo de Ethereum.",
      "download": {
        "label": "Obtener la aplicación"
      }
    },
    "extension": {
      "title": "%{wallet} para %{browser}",
      "description": "Acceda a su billetera directamente desde su navegador web favorito.",
      "download": {
        "label": "Añadir a %{browser}"
      }
    },
    "desktop": {
      "title": "%{wallet} para %{platform}",
      "description": "Acceda a su billetera de forma nativa desde su potente escritorio.",
      "download": {
        "label": "Añadir a %{platform}"
      }
    }
  },
  "get_mobile": {
    "title": "Instalar %{wallet}",
    "description": "Escanee con su teléfono para descargar en iOS o Android",
    "continue": {
      "label": "Continuar"
    }
  },
  "get_instructions": {
    "mobile": {
      "connect": {
        "label": "Conectar"
      },
      "learn_more": {
        "label": "Obtener más información"
      }
    },
    "extension": {
      "refresh": {
        "label": "Actualizar"
      },
      "learn_more": {
        "label": "Obtener más información"
      }
    },
    "desktop": {
      "connect": {
        "label": "Conectar"
      },
      "learn_more": {
        "label": "Obtener más información"
      }
    }
  },
  "chains": {
    "title": "Cambiar redes",
    "wrong_network": "Se detectó la red incorrecta, cambia o desconéctate para continuar.",
    "confirm": "Confirmar en la cartera",
    "switching_not_supported": "Tu cartera no admite cambiar las redes desde %{appName}. Intenta cambiar las redes desde tu cartera.",
    "switching_not_supported_fallback": "Su billetera no admite el cambio de redes desde esta aplicación. Intente cambiar de red desde dentro de su billetera en su lugar.",
    "disconnect": "Desconectar",
    "connected": "Conectado"
  },
  "profile": {
    "disconnect": {
      "label": "Desconectar"
    },
    "copy_address": {
      "label": "Copiar dirección",
      "copied": "¡Copiado!"
    },
    "explorer": {
      "label": "Ver más en el explorador"
    },
    "transactions": {
      "description": "%{appName} transacciones aparecerán aquí...",
      "description_fallback": "Tus transacciones aparecerán aquí...",
      "recent": {
        "title": "Transacciones recientes"
      },
      "clear": {
        "label": "Borrar Todo"
      }
    }
  },
  "wallet_connectors": {
    "argent": {
      "qr_code": {
        "step1": {
          "description": "Coloque Argent en su pantalla de inicio para un acceso más rápido a su billetera.",
          "title": "Abra la aplicación Argent"
        },
        "step2": {
          "description": "Cree una billetera y un nombre de usuario, o importe una billetera existente.",
          "title": "Crear o Importar una Billetera"
        },
        "step3": {
          "description": "Después de escanear, aparecerá un mensaje de conexión para que conecte su billetera.",
          "title": "Toque el botón Escanear QR"
        }
      }
    },
    "bifrost": {
      "qr_code": {
        "step1": {
          "description": "Recomendamos poner Bifrost Wallet en su pantalla de inicio para un acceso más rápido.",
          "title": "Abra la aplicación Bifrost Wallet"
        },
        "step2": {
          "description": "Cree o importe una billetera usando su frase de recuperación.",
          "title": "Crear o Importar una Billetera"
        },
        "step3": {
          "description": "Después de escanear, aparecerá un aviso de conexión para que conecte su billetera.",
          "title": "Toque el botón de escaneo"
        }
      }
    },
    "bitget": {
      "qr_code": {
        "step1": {
          "description": "Recomendamos colocar Bitget Wallet en su pantalla de inicio para un acceso más rápido.",
          "title": "Abra la aplicación Bitget Wallet"
        },
        "step2": {
          "description": "Asegúrese de respaldar su billetera utilizando un método seguro. Nunca comparta su frase secreta con nadie.",
          "title": "Crear o Importar una Billetera"
        },
        "step3": {
          "description": "Después de escanear, aparecerá un aviso de conexión para que pueda conectar su billetera.",
          "title": "Toque el botón de escanear"
        }
      },
      "extension": {
        "step1": {
          "description": "Recomendamos anclar Bitget Wallet a su barra de tareas para un acceso más rápido a su billetera.",
          "title": "Instale la extensión de la Billetera Bitget"
        },
        "step2": {
          "description": "Asegúrate de respaldar tu billetera utilizando un método seguro. Nunca compartas tu frase secreta con nadie.",
          "title": "Crear o Importar una Billetera"
        },
        "step3": {
          "description": "Una vez que configures tu billetera, haz clic a continuación para refrescar el navegador y cargar la extensión.",
          "title": "Refrescar tu navegador"
        }
      }
    },
    "bitski": {
      "extension": {
        "step1": {
          "description": "Recomendamos anclar Bitski a tu barra de tareas para un acceso más rápido a tu billetera.",
          "title": "Instala la extensión Bitski"
        },
        "step2": {
          "description": "Asegúrate de respaldar tu billetera utilizando un método seguro. Nunca compartas tu frase secreta con nadie.",
          "title": "Crear o Importar una Billetera"
        },
        "step3": {
          "description": "Una vez que configure su billetera, haga clic abajo para actualizar el navegador y cargar la extensión.",
          "title": "Actualiza tu navegador"
        }
      }
    },
    "coin98": {
      "qr_code": {
        "step1": {
          "description": "Recomendamos poner Coin98 Wallet en la pantalla de inicio para un acceso más rápido a su billetera.",
          "title": "Abra la aplicación Coin98 Wallet"
        },
        "step2": {
          "description": "Puede respaldar fácilmente su billetera utilizando nuestra función de respaldo en su teléfono.",
          "title": "Crear o Importar una Billetera"
        },
        "step3": {
          "description": "Después de escanear, aparecerá un aviso de conexión para que conecte su billetera.",
          "title": "Toque el botón WalletConnect"
        }
      },
      "extension": {
        "step1": {
          "description": "Haga clic en la parte superior derecha de su navegador y fije Coin98 Wallet para un fácil acceso.",
          "title": "Instale la extensión Coin98 Wallet"
        },
        "step2": {
          "description": "Crea una nueva billetera o importa una existente.",
          "title": "Crear o Importar una billetera"
        },
        "step3": {
          "description": "Una vez que configures Coin98 Wallet, haz clic a continuación para refrescar el navegador y cargar la extensión.",
          "title": "Refresca tu navegador"
        }
      }
    },
    "coinbase": {
      "qr_code": {
        "step1": {
          "description": "Recomendamos poner Coinbase Wallet en tu pantalla de inicio para un acceso más rápido.",
          "title": "Abre la aplicación de la Billetera Coinbase"
        },
        "step2": {
          "description": "Puedes respaldar tu billetera fácilmente utilizando la función de respaldo en la nube.",
          "title": "Crear o Importar una Billetera"
        },
        "step3": {
          "description": "Después de escanear, aparecerá un aviso de conexión para que conectes tu billetera.",
          "title": "Pulsa el botón de escanear"
        }
      },
      "extension": {
        "step1": {
          "description": "Te recomendamos anclar la Billetera Coinbase a tu barra de tareas para un acceso más rápido a tu billetera.",
          "title": "Instala la extensión de la Billetera Coinbase"
        },
        "step2": {
          "description": "Asegúrate de respaldar tu billetera utilizando un método seguro. Nunca compartas tu frase secreta con nadie.",
          "title": "Crear o Importar una Billetera"
        },
        "step3": {
          "description": "Una vez que configure su billetera, haga clic abajo para refrescar el navegador y cargar la extensión.",
          "title": "Refresca tu navegador"
        }
      }
    },
    "core": {
      "qr_code": {
        "step1": {
          "description": "Recomendamos poner Core en su pantalla de inicio para un acceso más rápido a su billetera.",
          "title": "Abra la aplicación Core"
        },
        "step2": {
          "description": "Puedes respaldar fácilmente tu billetera utilizando nuestra función de respaldo en tu teléfono.",
          "title": "Crear o Importar una Billetera"
        },
        "step3": {
          "description": "Después de escanear, aparecerá un aviso de conexión para que conectes tu billetera.",
          "title": "Toque el botón WalletConnect"
        }
      },
      "extension": {
        "step1": {
          "description": "Recomendamos fijar Core a tu barra de tareas para acceder más rápido a tu billetera.",
          "title": "Instala la extensión Core"
        },
        "step2": {
          "description": "Asegúrate de hacer una copia de seguridad de tu billetera utilizando un método seguro. Nunca compartas tu frase secreta con nadie.",
          "title": "Crear o Importar una Billetera"
        },
        "step3": {
          "description": "Una vez que configures tu billetera, haz clic a continuación para refrescar el navegador y cargar la extensión.",
          "title": "Refresca tu navegador"
        }
      }
    },
    "fox": {
      "qr_code": {
        "step1": {
          "description": "Recomendamos poner FoxWallet en tu pantalla de inicio para un acceso más rápido.",
          "title": "Abre la aplicación FoxWallet"
        },
        "step2": {
          "description": "Asegúrate de respaldar tu billetera utilizando un método seguro. Nunca compartas tu frase secreta con nadie.",
          "title": "Crear o Importar una Billetera"
        },
        "step3": {
          "description": "Después de escanear, aparecerá una solicitud de conexión para que conectes tu billetera.",
          "title": "Toca el botón de escanear"
        }
      }
    },
    "frontier": {
      "qr_code": {
        "step1": {
          "description": "Recomendamos poner la Billetera Frontier en tu pantalla principal para un acceso más rápido.",
          "title": "Abre la aplicación de la Billetera Frontier"
        },
        "step2": {
          "description": "Asegúrate de respaldar tu billetera utilizando un método seguro. Nunca compartas tu frase secreta con nadie.",
          "title": "Crear o Importar una Billetera"
        },
        "step3": {
          "description": "Después de escanear, aparecerá un mensaje para que conectes tu billetera.",
          "title": "Haz clic en el botón de escaneo"
        }
      },
      "extension": {
        "step1": {
          "description": "Recomendamos anclar la billetera Frontier a tu barra de tareas para un acceso más rápido a tu billetera.",
          "title": "Instala la extensión de la billetera Frontier"
        },
        "step2": {
          "description": "Asegúrese de hacer una copia de seguridad de su billetera utilizando un método seguro. Nunca comparta su frase secreta con nadie.",
          "title": "Crear o Importar una Billetera"
        },
        "step3": {
          "description": "Una vez que configure su billetera, haga clic a continuación para actualizar el navegador y cargar la extensión.",
          "title": "Actualizar tu navegador"
        }
      }
    },
    "im_token": {
      "qr_code": {
        "step1": {
          "title": "Abrir la aplicación imToken",
          "description": "Pon la aplicación imToken en tu pantalla de inicio para un acceso más rápido a tu billetera."
        },
        "step2": {
          "title": "Crear o Importar una Billetera",
          "description": "Crea una nueva billetera o importa una existente."
        },
        "step3": {
          "title": "Toca el Icono del Escáner en la esquina superior derecha",
          "description": "Elija Nueva Conexión, luego escanee el código QR y confirme el aviso para conectar."
        }
      }
    },
    "metamask": {
      "qr_code": {
        "step1": {
          "title": "Abre la aplicación MetaMask",
          "description": "Recomendamos colocar MetaMask en tu pantalla de inicio para un acceso más rápido."
        },
        "step2": {
          "title": "Crear o Importar una Billetera",
          "description": "Asegúrate de respaldar tu billetera utilizando un método seguro. Nunca compartas tu frase secreta con nadie."
        },
        "step3": {
          "title": "Toca el botón de escanear",
          "description": "Después de escanear, aparecerá un aviso de conexión para que conectes tu billetera."
        }
      },
      "extension": {
        "step1": {
          "title": "Instala la extensión MetaMask",
          "description": "Recomendamos anclar MetaMask a tu barra de tareas para un acceso más rápido a tu billetera."
        },
        "step2": {
          "title": "Crear o Importar una Billetera",
          "description": "Asegúrate de hacer una copia de seguridad de tu billetera usando un método seguro. Nunca compartas tu frase secreta con nadie."
        },
        "step3": {
          "title": "Refresca tu navegador",
          "description": "Una vez que configures tu billetera, haz clic abajo para refrescar el navegador y cargar la extensión."
        }
      }
    },
    "okx": {
      "qr_code": {
        "step1": {
          "title": "Abre la aplicación OKX Wallet",
          "description": "Recomendamos colocar OKX Wallet en tu pantalla de inicio para un acceso más rápido."
        },
        "step2": {
          "title": "Crear o Importar una Billetera",
          "description": "Asegúrate de respaldar tu billetera usando un método seguro. Nunca compartas tu frase secreta con nadie."
        },
        "step3": {
          "title": "Toca el botón de escanear",
          "description": "Después de escanear, aparecerá un aviso de conexión para que conectes tu billetera."
        }
      },
      "extension": {
        "step1": {
          "title": "Instala la extensión de Billetera OKX",
          "description": "Recomendamos anclar la Billetera OKX a tu barra de tareas para un acceso más rápido a tu billetera."
        },
        "step2": {
          "title": "Crear o Importar una Billetera",
          "description": "Asegúrate de respaldar tu billetera usando un método seguro. Nunca compartas tu frase secreta con nadie."
        },
        "step3": {
          "title": "Refresca tu navegador",
          "description": "Una vez que configure su billetera, haga clic abajo para actualizar el navegador y cargar la extensión."
        }
      }
    },
    "omni": {
      "qr_code": {
        "step1": {
          "title": "Abra la aplicación Omni",
          "description": "Agregue Omni a su pantalla de inicio para un acceso más rápido a su billetera."
        },
        "step2": {
          "title": "Crear o Importar una Billetera",
          "description": "Crear una nueva billetera o importar una existente."
        },
        "step3": {
          "title": "Toque el icono de QR y escanee",
          "description": "Toca el icono QR en tu pantalla principal, escanea el código y confirma el aviso para conectar."
        }
      }
    },
    "token_pocket": {
      "qr_code": {
        "step1": {
          "title": "Abre la aplicación TokenPocket",
          "description": "Recomendamos colocar TokenPocket en tu pantalla principal para un acceso más rápido."
        },
        "step2": {
          "title": "Crear o importar una Billetera",
          "description": "Asegúrate de respaldar tu billetera utilizando un método seguro. Nunca compartas tu frase secreta con nadie."
        },
        "step3": {
          "title": "Toca el botón de escaneo",
          "description": "Después de escanear, aparecerá una solicitud de conexión para que puedas conectar tu billetera."
        }
      },
      "extension": {
        "step1": {
          "title": "Instala la extensión TokenPocket",
          "description": "Recomendamos anclar TokenPocket a tu barra de tareas para un acceso más rápido a tu billetera."
        },
        "step2": {
          "title": "Crear o Importar una Billetera",
          "description": "Asegúrate de respaldar tu billetera utilizando un método seguro. Nunca compartas tu frase secreta con nadie."
        },
        "step3": {
          "title": "Actualiza tu navegador",
          "description": "Una vez que configures tu billetera, haz clic a continuación para actualizar el navegador y cargar la extensión."
        }
      }
    },
    "trust": {
      "qr_code": {
        "step1": {
          "title": "Abre la aplicación Trust Wallet",
          "description": "Ubica Trust Wallet en tu pantalla de inicio para un acceso más rápido a tu billetera."
        },
        "step2": {
          "title": "Crear o Importar una Billetera",
          "description": "Crea una nueva billetera o importa una existente."
        },
        "step3": {
          "title": "Toca WalletConnect en Configuraciones",
          "description": "Elige Nueva Conexión, luego escanea el código QR y confirma el aviso para conectar."
        }
      },
      "extension": {
        "step1": {
          "title": "Instala la extensión de Trust Wallet",
          "description": "Haz clic en la parte superior derecha de tu navegador y fija Trust Wallet para un fácil acceso."
        },
        "step2": {
          "title": "Crea o Importa una billetera",
          "description": "Crea una nueva billetera o importa una existente."
        },
        "step3": {
          "title": "Refresca tu navegador",
          "description": "Una vez que configures Trust Wallet, haz clic abajo para refrescar el navegador y cargar la extensión."
        }
      }
    },
    "uniswap": {
      "qr_code": {
        "step1": {
          "title": "Abre la aplicación Uniswap",
          "description": "Agrega la billetera Uniswap a tu pantalla de inicio para un acceso más rápido a tu billetera."
        },
        "step2": {
          "title": "Crear o Importar una Billetera",
          "description": "Crea una nueva billetera o importa una existente."
        },
        "step3": {
          "title": "Toca el icono QR y escanea",
          "description": "Toca el icono QR en tu pantalla de inicio, escanea el código y confirma el prompt para conectar."
        }
      }
    },
    "zerion": {
      "qr_code": {
        "step1": {
          "title": "Abre la aplicación Zerion",
          "description": "Recomendamos poner Zerion en tu pantalla de inicio para un acceso más rápido."
        },
        "step2": {
          "title": "Crear o Importar una Billetera",
          "description": "Asegúrate de hacer una copia de seguridad de tu billetera utilizando un método seguro. Nunca compartas tu frase secreta con nadie."
        },
        "step3": {
          "title": "Toca el botón de escanear",
          "description": "Después de escanear, aparecerá un aviso de conexión para que conectes tu billetera."
        }
      },
      "extension": {
        "step1": {
          "title": "Instala la extensión Zerion",
          "description": "Recomendamos anclar Zerion a tu barra de tareas para un acceso más rápido a tu billetera."
        },
        "step2": {
          "title": "Crear o Importar una Billetera",
          "description": "Asegúrese de respaldar su billetera usando un método seguro. Nunca comparta su frase secreta con nadie."
        },
        "step3": {
          "title": "Actualiza tu navegador",
          "description": "Una vez que configures tu billetera, haz clic a continuación para actualizar el navegador y cargar la extensión."
        }
      }
    },
    "rainbow": {
      "qr_code": {
        "step1": {
          "title": "Abre la aplicación Rainbow",
          "description": "Recomendamos poner Rainbow en tu pantalla de inicio para un acceso más rápido a tu billetera."
        },
        "step2": {
          "title": "Crear o Importar una Billetera",
          "description": "Puedes respaldar fácilmente tu billetera usando nuestra función de respaldo en tu teléfono."
        },
        "step3": {
          "title": "Toca el botón de escanear",
          "description": "Después de escanear, aparecerá una solicitud de conexión para que conectes tu billetera."
        }
      }
    },
    "enkrypt": {
      "extension": {
        "step1": {
          "description": "Recomendamos anclar la Billetera Enkrypt a tu barra de tareas para un acceso más rápido a tu billetera.",
          "title": "Instala la extensión de Billetera Enkrypt"
        },
        "step2": {
          "description": "Asegúrate de respaldar tu billetera utilizando un método seguro. Nunca compartas tu frase secreta con nadie.",
          "title": "Crear o Importar una Billetera"
        },
        "step3": {
          "description": "Una vez que configures tu billetera, haz clic abajo para refrescar el navegador y cargar la extensión.",
          "title": "Refresca tu navegador"
        }
      }
    },
    "frame": {
      "extension": {
        "step1": {
          "description": "Recomendamos anclar Frame a tu barra de tareas para un acceso más rápido a tu billetera.",
          "title": "Instala Frame y la extensión complementaria"
        },
        "step2": {
          "description": "Asegúrate de respaldar tu billetera utilizando un método seguro. Nunca compartas tu frase secreta con nadie.",
          "title": "Crear o Importar una Billetera"
        },
        "step3": {
          "description": "Una vez que configures tu billetera, haz clic a continuación para refrescar el navegador y cargar la extensión.",
          "title": "Refresca tu navegador"
        }
      }
    },
    "one_key": {
      "extension": {
        "step1": {
          "title": "Instale la extensión de Billetera OneKey",
          "description": "Recomendamos anclar la Billetera OneKey a tu barra de tareas para un acceso más rápido a tu billetera."
        },
        "step2": {
          "title": "Crear o Importar una Billetera",
          "description": "Asegúrese de respaldar su billetera usando un método seguro. Nunca comparta su frase secreta con nadie."
        },
        "step3": {
          "title": "Actualiza tu navegador",
          "description": "Una vez que configures tu billetera, haz clic a continuación para actualizar el navegador y cargar la extensión."
        }
      }
    },
    "phantom": {
      "extension": {
        "step1": {
          "title": "Instala la extensión Phantom",
          "description": "Recomendamos fijar Phantom a tu barra de tareas para un acceso más fácil a tu billetera."
        },
        "step2": {
          "title": "Crear o Importar una Billetera",
          "description": "Asegúrese de respaldar su billetera usando un método seguro. Nunca comparta su frase secreta de recuperación con nadie."
        },
        "step3": {
          "title": "Actualiza tu navegador",
          "description": "Una vez que configures tu billetera, haz clic abajo para refrescar el navegador y cargar la extensión."
        }
      }
    },
    "rabby": {
      "extension": {
        "step1": {
          "title": "Instala la extensión Rabby",
          "description": "Recomendamos anclar Rabby a tu barra de tareas para un acceso más rápido a tu billetera."
        },
        "step2": {
          "title": "Crear o Importar una Billetera",
          "description": "Asegúrate de hacer una copia de seguridad de tu billetera utilizando un método seguro. Nunca compartas tu frase secreta con nadie."
        },
        "step3": {
          "title": "Actualiza tu navegador",
          "description": "Una vez que configures tu billetera, haz clic abajo para actualizar el navegador y cargar la extensión."
        }
      }
    },
    "safeheron": {
      "extension": {
        "step1": {
          "title": "Instala la extensión Core",
          "description": "Recomendamos anclar Safeheron a tu barra de tareas para un acceso más rápido a tu billetera."
        },
        "step2": {
          "title": "Crear o Importar una Billetera",
          "description": "Asegúrate de respaldar tu billetera utilizando un método seguro. Nunca compartas tu frase secreta con nadie."
        },
        "step3": {
          "title": "Refresca tu navegador",
          "description": "Una vez que configures tu billetera, haz clic abajo para refrescar el navegador y cargar la extensión."
        }
      }
    },
    "taho": {
      "extension": {
        "step1": {
          "title": "Instala la extensión de Taho",
          "description": "Recomendamos anclar Taho a tu barra de tareas para un acceso más rápido a tu billetera."
        },
        "step2": {
          "title": "Crea o Importa una Billetera",
          "description": "Asegúrate de respaldar tu billetera utilizando un método seguro. Nunca compartas tu frase secreta con nadie."
        },
        "step3": {
          "title": "Refresca tu navegador",
          "description": "Una vez que configures tu billetera, haz clic abajo para refrescar el navegador y cargar la extensión."
        }
      }
    },
    "talisman": {
      "extension": {
        "step1": {
          "title": "Instala la extensión de Talisman",
          "description": "Recomendamos anclar Talisman a tu barra de tareas para un acceso más rápido a tu billetera."
        },
        "step2": {
          "title": "Crea o importa una billetera Ethereum",
          "description": "Asegúrate de respaldar tu billetera usando un método seguro. Nunca compartas tu frase de recuperación con nadie."
        },
        "step3": {
          "title": "Recarga tu navegador",
          "description": "Una vez que configures tu billetera, haz clic abajo para refrescar el navegador y cargar la extensión."
        }
      }
    },
    "xdefi": {
      "extension": {
        "step1": {
          "title": "Instala la extensión de la billetera XDEFI",
          "description": "Recomendamos anclar XDEFI Wallet a su barra de tareas para un acceso más rápido a su billetera."
        },
        "step2": {
          "title": "Crear o Importar una Billetera",
          "description": "Asegúrese de respaldar su billetera utilizando un método seguro. Nunca comparta su frase secreta con nadie."
        },
        "step3": {
          "title": "Actualice su navegador",
          "description": "Una vez que configure su billetera, haga clic abajo para actualizar el navegador y cargar la extensión."
        }
      }
    },
    "zeal": {
      "extension": {
        "step1": {
          "title": "Instale la extensión Zeal",
          "description": "Recomendamos anclar Zeal a su barra de tareas para un acceso más rápido a su billetera."
        },
        "step2": {
          "title": "Crear o Importar una Billetera",
          "description": "Asegúrese de respaldar su billetera utilizando un método seguro. Nunca comparta su frase secreta con nadie."
        },
        "step3": {
          "title": "Refrescar tu navegador",
          "description": "Una vez que configures tu billetera, haz clic a continuación para refrescar el navegador y cargar la extensión."
        }
      }
    },
    "safepal": {
      "extension": {
        "step1": {
          "title": "Instale la extensión de la billetera SafePal",
          "description": "Haga clic en la esquina superior derecha de su navegador y ancle SafePal Wallet para un fácil acceso."
        },
        "step2": {
          "title": "Crear o Importar una billetera",
          "description": "Crea una nueva billetera o importa una existente."
        },
        "step3": {
          "title": "Refrescar tu navegador",
          "description": "Una vez que configure la Billetera SafePal, haga clic abajo para refrescar el navegador y cargar la extensión."
        }
      },
      "qr_code": {
        "step1": {
          "title": "Abra la aplicación Billetera SafePal",
          "description": "Coloque la Billetera SafePal en su pantalla de inicio para un acceso más rápido a su billetera."
        },
        "step2": {
          "title": "Crear o Importar una Billetera",
          "description": "Crea una nueva billetera o importa una existente."
        },
        "step3": {
          "title": "Toca WalletConnect en Configuraciones",
          "description": "Elija Nueva Conexión, luego escanee el código QR y confirme el aviso para conectar."
        }
      }
    },
    "desig": {
      "extension": {
        "step1": {
          "title": "Instala la extensión Desig",
          "description": "Recomendamos anclar Desig a tu barra de tareas para acceder más fácilmente a tu cartera."
        },
        "step2": {
          "title": "Crea una Cartera",
          "description": "Asegúrese de respaldar su billetera utilizando un método seguro. Nunca comparta su frase secreta con nadie."
        },
        "step3": {
          "title": "Refrescar tu navegador",
          "description": "Una vez que configures tu billetera, haz clic a continuación para refrescar el navegador y cargar la extensión."
        }
      }
    },
    "subwallet": {
      "extension": {
        "step1": {
          "title": "Instala la extensión SubWallet",
          "description": "Recomendamos anclar SubWallet a tu barra de tareas para acceder a tu cartera más rápidamente."
        },
        "step2": {
          "title": "Crear o Importar una Billetera",
          "description": "Asegúrate de respaldar tu billetera usando un método seguro. Nunca compartas tu frase de recuperación con nadie."
        },
        "step3": {
          "title": "Refrescar tu navegador",
          "description": "Una vez que configures tu billetera, haz clic a continuación para refrescar el navegador y cargar la extensión."
        }
      },
      "qr_code": {
        "step1": {
          "title": "Abre la aplicación SubWallet",
          "description": "Recomendamos colocar SubWallet en tu pantalla principal para un acceso más rápido."
        },
        "step2": {
          "title": "Crear o Importar una Billetera",
          "description": "Asegúrese de respaldar su billetera utilizando un método seguro. Nunca comparta su frase secreta con nadie."
        },
        "step3": {
          "title": "Toque el botón de escaneo",
          "description": "Después de escanear, aparecerá un mensaje de conexión para que conecte su billetera."
        }
      }
    },
    "clv": {
      "extension": {
        "step1": {
          "title": "Instala la extensión CLV Wallet",
          "description": "Recomendamos anclar la billetera CLV a tu barra de tareas para un acceso más rápido a tu billetera."
        },
        "step2": {
          "title": "Crear o Importar una Billetera",
          "description": "Asegúrese de respaldar su billetera utilizando un método seguro. Nunca comparta su frase secreta con nadie."
        },
        "step3": {
          "title": "Refrescar tu navegador",
          "description": "Una vez que configures tu billetera, haz clic a continuación para refrescar el navegador y cargar la extensión."
        }
      },
      "qr_code": {
        "step1": {
          "title": "Abra la aplicación CLV Wallet",
          "description": "Recomendamos colocar la billetera CLV en tu pantalla de inicio para un acceso más rápido."
        },
        "step2": {
          "title": "Crear o Importar una Billetera",
          "description": "Asegúrese de respaldar su billetera utilizando un método seguro. Nunca comparta su frase secreta con nadie."
        },
        "step3": {
          "title": "Toque el botón de escaneo",
          "description": "Después de escanear, aparecerá un mensaje de conexión para que conecte su billetera."
        }
      }
    },
    "okto": {
      "qr_code": {
        "step1": {
          "title": "Abra la aplicación Okto",
          "description": "Agrega Okto a tu pantalla de inicio para un acceso rápido"
        },
        "step2": {
          "title": "Crea una billetera MPC",
          "description": "Crea una cuenta y genera una billetera"
        },
        "step3": {
          "title": "Toca WalletConnect en Configuraciones",
          "description": "Toca el icono de Escanear QR en la parte superior derecha y confirma el mensaje para conectar."
        }
      }
    },
    "ledger": {
      "desktop": {
        "step1": {
          "title": "Abra la aplicación Ledger Live",
          "description": "Recomendamos poner Ledger Live en su pantalla de inicio para un acceso más rápido."
        },
        "step2": {
          "title": "Configure su Ledger",
          "description": "Configure un nuevo Ledger o conéctese a uno existente."
        },
        "step3": {
          "title": "Conectar",
          "description": "Después de escanear, aparecerá un aviso de conexión para que conectes tu billetera."
        }
      },
      "qr_code": {
        "step1": {
          "title": "Abra la aplicación Ledger Live",
          "description": "Recomendamos poner Ledger Live en su pantalla de inicio para un acceso más rápido."
        },
        "step2": {
          "title": "Configure su Ledger",
          "description": "Puedes sincronizar con la aplicación de escritorio o conectar tu Ledger."
        },
        "step3": {
          "title": "Escanea el código",
          "description": "Toca WalletConnect y luego cambia a Scanner. Después de escanear, aparecerá un aviso de conexión para que conectes tu billetera."
        }
      }
    }
  }
}
`;const JE=Object.freeze(Object.defineProperty({__proto__:null,default:PE},Symbol.toStringTag,{value:"Module"}));var HE=`{
  "connect_wallet": {
    "label": "Connecter le portefeuille"
  },
  "intro": {
    "title": "Qu'est-ce qu'un portefeuille?",
    "description": "Un portefeuille est utilisé pour envoyer, recevoir, stocker et afficher des actifs numériques. C'est aussi une nouvelle façon de se connecter, sans avoir besoin de créer de nouveaux comptes et mots de passe sur chaque site.",
    "digital_asset": {
      "title": "Un foyer pour vos actifs numériques",
      "description": "Les portefeuilles sont utilisés pour envoyer, recevoir, stocker et afficher des actifs numériques comme Ethereum et les NFTs."
    },
    "login": {
      "title": "Une nouvelle façon de se connecter",
      "description": "Au lieu de créer de nouveaux comptes et mots de passe sur chaque site Web, connectez simplement votre portefeuille."
    },
    "get": {
      "label": "Obtenir un portefeuille"
    },
    "learn_more": {
      "label": "En savoir plus"
    }
  },
  "sign_in": {
    "label": "Vérifiez votre compte",
    "description": "Pour terminer la connexion, vous devez signer un message dans votre portefeuille pour vérifier que vous êtes le propriétaire de ce compte.",
    "message": {
      "send": "Envoyer le message",
      "preparing": "Préparation du message...",
      "cancel": "Annuler",
      "preparing_error": "Erreur lors de la préparation du message, veuillez réessayer!"
    },
    "signature": {
      "waiting": "En attente de la signature...",
      "verifying": "Vérification de la signature...",
      "signing_error": "Erreur lors de la signature du message, veuillez réessayer!",
      "verifying_error": "Erreur lors de la vérification de la signature, veuillez réessayer!",
      "oops_error": "Oups, quelque chose a mal tourné!"
    }
  },
  "connect": {
    "label": "Connecter",
    "title": "Connecter un portefeuille",
    "new_to_ethereum": {
      "description": "Nouveau aux portefeuilles Ethereum?",
      "learn_more": {
        "label": "En savoir plus"
      }
    },
    "learn_more": {
      "label": "En savoir plus"
    },
    "recent": "Récents",
    "status": {
      "opening": "Ouverture %{wallet}...",
      "connecting": "Connect :)ing",
      "connect_mobile": "Continuer dans %{wallet}",
      "not_installed": "%{wallet} n'est pas installé",
      "not_available": "%{wallet} n'est pas disponible",
      "confirm": "Confirmez la connexion dans l'extension",
      "confirm_mobile": "Accepter la demande de connexion dans le portefeuille"
    },
    "secondary_action": {
      "get": {
        "description": "Vous n'avez pas de %{wallet}?",
        "label": "OBTENIR"
      },
      "install": {
        "label": "INSTALLER"
      },
      "retry": {
        "label": "RÉESSAYER"
      }
    },
    "walletconnect": {
      "description": {
        "full": "Vous avez besoin du modal officiel de WalletConnect ?",
        "compact": "Besoin du modal de WalletConnect ?"
      },
      "open": {
        "label": "OUVRIR"
      }
    }
  },
  "connect_scan": {
    "title": "Scannez avec %{wallet}",
    "fallback_title": "Scannez avec votre téléphone"
  },
  "connector_group": {
    "recommended": "Recommandé",
    "other": "Autre",
    "popular": "Populaire",
    "more": "Plus",
    "others": "Autres"
  },
  "get": {
    "title": "Obtenez un portefeuille",
    "action": {
      "label": "OBTENIR"
    },
    "mobile": {
      "description": "Portefeuille mobile"
    },
    "extension": {
      "description": "Extension de navigateur"
    },
    "mobile_and_extension": {
      "description": "Portefeuille mobile et extension"
    },
    "mobile_and_desktop": {
      "description": "Portefeuille mobile et de bureau"
    },
    "looking_for": {
      "title": "Ce n'est pas ce que vous cherchez ?",
      "mobile": {
        "description": "Sélectionnez un portefeuille sur l'écran principal pour commencer avec un autre fournisseur de portefeuille."
      },
      "desktop": {
        "compact_description": "Sélectionnez un portefeuille sur l'écran principal pour commencer avec un autre fournisseur de portefeuille.",
        "wide_description": "Sélectionnez un portefeuille sur la gauche pour commencer avec un autre fournisseur de portefeuille."
      }
    }
  },
  "get_options": {
    "title": "Commencez avec %{wallet}",
    "short_title": "Obtenez %{wallet}",
    "mobile": {
      "title": "%{wallet} pour mobile",
      "description": "Utilisez le portefeuille mobile pour explorer le monde d'Ethereum.",
      "download": {
        "label": "Obtenez l'application"
      }
    },
    "extension": {
      "title": "%{wallet} pour %{browser}",
      "description": "Accédez à votre portefeuille directement depuis votre navigateur web préféré.",
      "download": {
        "label": "Ajouter à %{browser}"
      }
    },
    "desktop": {
      "title": "%{wallet} pour %{platform}",
      "description": "Accédez à votre portefeuille nativement depuis votre puissant ordinateur de bureau.",
      "download": {
        "label": "Ajouter à %{platform}"
      }
    }
  },
  "get_mobile": {
    "title": "Installer %{wallet}",
    "description": "Scannez avec votre téléphone pour télécharger sur iOS ou Android",
    "continue": {
      "label": "Continuer"
    }
  },
  "get_instructions": {
    "mobile": {
      "connect": {
        "label": "Connecter"
      },
      "learn_more": {
        "label": "En savoir plus"
      }
    },
    "extension": {
      "refresh": {
        "label": "Rafraîchir"
      },
      "learn_more": {
        "label": "En savoir plus"
      }
    },
    "desktop": {
      "connect": {
        "label": "Connecter"
      },
      "learn_more": {
        "label": "En savoir plus"
      }
    }
  },
  "chains": {
    "title": "Changer de Réseaux",
    "wrong_network": "Mauvais réseau détecté, changez ou déconnectez-vous pour continuer.",
    "confirm": "Confirmer dans le portefeuille",
    "switching_not_supported": "Votre portefeuille ne supporte pas le changement de réseaux depuis %{appName}. Essayez de changer de réseau depuis votre portefeuille.",
    "switching_not_supported_fallback": "Votre portefeuille ne prend pas en charge le changement de réseaux à partir de cette application. Essayez de changer de réseau à partir de votre portefeuille à la place.",
    "disconnect": "Déconnecter",
    "connected": "Connecté"
  },
  "profile": {
    "disconnect": {
      "label": "Déconnecter"
    },
    "copy_address": {
      "label": "Copier l'adresse",
      "copied": "Copié !"
    },
    "explorer": {
      "label": "Voir plus sur l'explorateur"
    },
    "transactions": {
      "description": "%{appName} transactions apparaîtront ici...",
      "description_fallback": "Vos transactions apparaîtront ici...",
      "recent": {
        "title": "Transactions Récentes"
      },
      "clear": {
        "label": "Tout supprimer"
      }
    }
  },
  "wallet_connectors": {
    "argent": {
      "qr_code": {
        "step1": {
          "description": "Mettez Argent sur votre écran d'accueil pour un accès plus rapide à votre portefeuille.",
          "title": "Ouvrez l'application Argent"
        },
        "step2": {
          "description": "Créez un portefeuille et un nom d'utilisateur, ou importez un portefeuille existant.",
          "title": "Créer ou Importer un Portefeuille"
        },
        "step3": {
          "description": "Après avoir numérisé, une invite de connexion apparaîtra pour vous permettre de connecter votre portefeuille.",
          "title": "Appuyez sur le bouton Scan QR"
        }
      }
    },
    "bifrost": {
      "qr_code": {
        "step1": {
          "description": "Nous vous recommandons de mettre le portefeuille Bifrost sur votre écran d'accueil pour un accès plus rapide.",
          "title": "Ouvrez l'application Bifrost Wallet"
        },
        "step2": {
          "description": "Créez ou importez un portefeuille en utilisant votre phrase de récupération.",
          "title": "Créer ou Importer un portefeuille"
        },
        "step3": {
          "description": "Après votre scan, une invite de connexion apparaîtra pour vous permettre de connecter votre portefeuille.",
          "title": "Appuyez sur le bouton de scan"
        }
      }
    },
    "bitget": {
      "qr_code": {
        "step1": {
          "description": "Nous vous recommandons de placer Bitget Wallet sur votre écran d'accueil pour un accès plus rapide.",
          "title": "Ouvrez l'application Bitget Wallet"
        },
        "step2": {
          "description": "Assurez-vous de sauvegarder votre portefeuille en utilisant une méthode sécurisée. Ne partagez jamais votre phrase secrète avec quiconque.",
          "title": "Créer ou Importer un portefeuille"
        },
        "step3": {
          "description": "Après le scan, une incitation de connexion apparaîtra pour vous permettre de connecter votre portefeuille.",
          "title": "Appuyez sur le bouton de scan"
        }
      },
      "extension": {
        "step1": {
          "description": "Nous vous recommandons d'épingler Bitget Wallet à votre barre des tâches pour un accès plus rapide à votre portefeuille.",
          "title": "Installez l'extension de portefeuille Bitget"
        },
        "step2": {
          "description": "Assurez-vous de sauvegarder votre portefeuille en utilisant une méthode sécurisée. Ne partagez jamais votre phrase secrète avec personne.",
          "title": "Créez ou Importez un portefeuille"
        },
        "step3": {
          "description": "Une fois que vous avez configuré votre portefeuille, cliquez ci-dessous pour actualiser le navigateur et charger l'extension.",
          "title": "Rafraîchissez votre navigateur"
        }
      }
    },
    "bitski": {
      "extension": {
        "step1": {
          "description": "Nous recommandons d'épingler Bitski à votre barre des tâches pour un accès plus rapide à votre portefeuille.",
          "title": "Installez l'extension Bitski"
        },
        "step2": {
          "description": "Assurez-vous de sauvegarder votre portefeuille en utilisant une méthode sécurisée. Ne partagez jamais votre phrase secrète avec qui que ce soit.",
          "title": "Créer ou Importer un portefeuille"
        },
        "step3": {
          "description": "Une fois que vous avez configuré votre portefeuille, cliquez ci-dessous pour rafraîchir le navigateur et charger l'extension.",
          "title": "Rafraîchissez votre navigateur"
        }
      }
    },
    "coin98": {
      "qr_code": {
        "step1": {
          "description": "Nous vous recommandons de placer Coin98 Wallet sur votre écran d'accueil pour un accès plus rapide à votre portefeuille.",
          "title": "Ouvrez l'application Coin98 Wallet"
        },
        "step2": {
          "description": "Vous pouvez facilement sauvegarder votre portefeuille en utilisant notre fonction de sauvegarde sur votre téléphone.",
          "title": "Créer ou Importer un portefeuille"
        },
        "step3": {
          "description": "Après que vous ayez scanné, une invite de connexion apparaîtra pour vous permettre de connecter votre portefeuille.",
          "title": "Appuyez sur le bouton WalletConnect"
        }
      },
      "extension": {
        "step1": {
          "description": "Cliquez en haut à droite de votre navigateur et épinglez Coin98 Wallet pour un accès facile.",
          "title": "Installez l'extension Coin98 Wallet"
        },
        "step2": {
          "description": "Créez un nouveau portefeuille ou importez-en un existant.",
          "title": "Créer ou Importer un portefeuille"
        },
        "step3": {
          "description": "Une fois que vous avez configuré Coin98 Wallet, cliquez ci-dessous pour actualiser le navigateur et charger l'extension.",
          "title": "Rafraîchissez votre navigateur"
        }
      }
    },
    "coinbase": {
      "qr_code": {
        "step1": {
          "description": "Nous recommandons de placer Coinbase Wallet sur votre écran d'accueil pour un accès plus rapide.",
          "title": "Ouvrez l'application Coinbase Wallet"
        },
        "step2": {
          "description": "Vous pouvez facilement sauvegarder votre portefeuille en utilisant la fonction de sauvegarde cloud.",
          "title": "Créer ou Importer un portefeuille"
        },
        "step3": {
          "description": "Après avoir scanné, une invite de connexion s'affichera pour que vous puissiez connecter votre portefeuille.",
          "title": "Appuyez sur le bouton de scan"
        }
      },
      "extension": {
        "step1": {
          "description": "Nous recommandons d'épingler Coinbase Wallet à votre barre des tâches pour un accès plus rapide à votre portefeuille.",
          "title": "Installez l'extension Coinbase Wallet"
        },
        "step2": {
          "description": "Assurez-vous de sauvegarder votre portefeuille en utilisant une méthode sûre. Ne partagez jamais votre phrase secrète avec quiconque.",
          "title": "Créer ou Importer un portefeuille"
        },
        "step3": {
          "description": "Une fois que vous avez configuré votre portefeuille, cliquez ci-dessous pour actualiser le navigateur et charger l'extension.",
          "title": "Actualisez votre navigateur"
        }
      }
    },
    "core": {
      "qr_code": {
        "step1": {
          "description": "Nous recommandons de placer Core sur votre écran d'accueil pour un accès plus rapide à votre portefeuille.",
          "title": "Ouvrez l'application Core"
        },
        "step2": {
          "description": "Vous pouvez facilement sauvegarder votre portefeuille en utilisant notre fonction de sauvegarde sur votre téléphone.",
          "title": "Créer ou Importer un portefeuille"
        },
        "step3": {
          "description": "Après avoir scanné, une invite de connexion apparaîtra pour vous permettre de connecter votre portefeuille.",
          "title": "Appuyez sur le bouton WalletConnect"
        }
      },
      "extension": {
        "step1": {
          "description": "Nous recommandons d'épingler Core à votre barre des tâches pour un accès plus rapide à votre portefeuille.",
          "title": "Installez l'extension Core"
        },
        "step2": {
          "description": "Assurez-vous de sauvegarder votre portefeuille en utilisant une méthode sécurisée. Ne partagez jamais votre phrase secrète avec quiconque.",
          "title": "Créez ou Importer un Portefeuille"
        },
        "step3": {
          "description": "Une fois que vous avez configuré votre portefeuille, cliquez ci-dessous pour rafraîchir le navigateur et charger l'extension.",
          "title": "Rafraîchissez votre navigateur"
        }
      }
    },
    "fox": {
      "qr_code": {
        "step1": {
          "description": "Nous recommandons de mettre FoxWallet sur votre écran d'accueil pour un accès plus rapide.",
          "title": "Ouvrez l'application FoxWallet"
        },
        "step2": {
          "description": "Assurez-vous de sauvegarder votre portefeuille en utilisant une méthode sécurisée. Ne partagez jamais votre phrase secrète avec personne.",
          "title": "Créer ou Importer un portefeuille"
        },
        "step3": {
          "description": "Après avoir scanné, une invitation à la connexion apparaîtra pour vous permettre de connecter votre portefeuille.",
          "title": "Appuyez sur le bouton de scan"
        }
      }
    },
    "frontier": {
      "qr_code": {
        "step1": {
          "description": "Nous vous recommandons de placer le portefeuille Frontier sur votre écran d'accueil pour un accès plus rapide.",
          "title": "Ouvrez l'application Frontier Wallet"
        },
        "step2": {
          "description": "Assurez-vous de sauvegarder votre portefeuille en utilisant une méthode sécurisée. Ne partagez jamais votre phrase secrète avec personne.",
          "title": "Créer ou Importer un portefeuille"
        },
        "step3": {
          "description": "Après avoir scanné, une invite de connexion apparaîtra pour vous permettre de connecter votre portefeuille.",
          "title": "Appuyez sur le bouton de scan"
        }
      },
      "extension": {
        "step1": {
          "description": "Nous recommandons d'épingler Frontier Wallet à votre barre des tâches pour un accès plus rapide à votre portefeuille.",
          "title": "Installez l'extension Frontier Wallet"
        },
        "step2": {
          "description": "Assurez-vous de sauvegarder votre portefeuille en utilisant une méthode sécurisée. Ne partagez jamais votre phrase secrète avec personne.",
          "title": "Créez ou importez un portefeuille"
        },
        "step3": {
          "description": "Une fois que vous avez configuré votre portefeuille, cliquez ci-dessous pour actualiser le navigateur et charger l'extension.",
          "title": "Rafraîchissez votre navigateur"
        }
      }
    },
    "im_token": {
      "qr_code": {
        "step1": {
          "title": "Ouvrez l'application imToken",
          "description": "Placez l'application imToken sur votre écran d'accueil pour un accès plus rapide à votre portefeuille."
        },
        "step2": {
          "title": "Créez ou importez un portefeuille",
          "description": "Créez un nouveau portefeuille ou importez-en un existant ."
        },
        "step3": {
          "title": "Appuyez sur l'icône du scanner dans le coin supérieur droit",
          "description": "Choisissez Nouvelle Connexion, puis scannez le code QR et confirmez l'invite pour vous connecter."
        }
      }
    },
    "metamask": {
      "qr_code": {
        "step1": {
          "title": "Ouvrez l'application MetaMask",
          "description": "Nous vous recommandons de mettre MetaMask sur votre écran d'accueil pour un accès plus rapide."
        },
        "step2": {
          "title": "Créer ou Importer un Portefeuille",
          "description": "Veillez à sauvegarder votre portefeuille en utilisant une méthode sécurisée. Ne partagez jamais votre phrase secrète avec qui que ce soit."
        },
        "step3": {
          "title": "Appuyez sur le bouton de scan",
          "description": "Après avoir scanné, une invite de connexion apparaîtra pour vous permettre de connecter votre portefeuille."
        }
      },
      "extension": {
        "step1": {
          "title": "Installez l’extension de MetaMask",
          "description": "Nous recommandons d'épingler MetaMask à votre barre des tâches pour un accès plus rapide à votre portefeuille."
        },
        "step2": {
          "title": "Créer ou Importer un portefeuille",
          "description": "Assurez-vous de sauvegarder votre portefeuille en utilisant une méthode sécurisée. Ne partagez jamais votre phrase secrète avec quiconque."
        },
        "step3": {
          "title": "Rafraîchissez votre navigateur",
          "description": "Une fois que vous avez configuré votre portefeuille, cliquez ci-dessous pour rafraîchir le navigateur et charger l'extension."
        }
      }
    },
    "okx": {
      "qr_code": {
        "step1": {
          "title": "Ouvrez l'application OKX Wallet",
          "description": "Nous recommandons de mettre OKX Wallet sur votre écran d'accueil pour un accès plus rapide."
        },
        "step2": {
          "title": "Créer ou Importer un portefeuille",
          "description": "Assurez-vous de sauvegarder votre portefeuille en utilisant une méthode sécurisée. Ne partagez jamais votre phrase secrète avec quiconque."
        },
        "step3": {
          "title": "Appuyez sur le bouton de numérisation",
          "description": "Après avoir numérisé, une invite de connexion apparaîtra pour vous permettre de connecter votre portefeuille."
        }
      },
      "extension": {
        "step1": {
          "title": "Installez l'extension de portefeuille OKX",
          "description": "Nous vous recommandons d'épingler le portefeuille OKX à votre barre des tâches pour un accès plus rapide à votre portefeuille."
        },
        "step2": {
          "title": "Créer ou Importer un portefeuille",
          "description": "Assurez-vous de sauvegarder votre portefeuille en utilisant une méthode sécurisée. Ne partagez jamais votre phrase secrète avec quiconque."
        },
        "step3": {
          "title": "Rafraîchissez votre navigateur",
          "description": "Une fois que vous avez configuré votre portefeuille, cliquez ci-dessous pour actualiser le navigateur et charger l'extension."
        }
      }
    },
    "omni": {
      "qr_code": {
        "step1": {
          "title": "Ouvrez l'application Omni",
          "description": "Ajoutez Omni à votre écran d'accueil pour un accès plus rapide à votre portefeuille."
        },
        "step2": {
          "title": "Créer ou Importer un Portefeuille",
          "description": "Créez un nouveau portefeuille ou importez-en un existant."
        },
        "step3": {
          "title": "Touchez l'icône QR et scannez",
          "description": "Appuyez sur l'icône QR sur votre écran d'accueil, scannez le code et confirmez l'invite pour vous connecter."
        }
      }
    },
    "token_pocket": {
      "qr_code": {
        "step1": {
          "title": "Ouvrez l'application TokenPocket",
          "description": "Nous vous recommandons de mettre TokenPocket sur votre écran d'accueil pour un accès plus rapide."
        },
        "step2": {
          "title": "Créez ou Importer un portefeuille",
          "description": "Assurez-vous de sauvegarder votre portefeuille à l'aide d'une méthode sécurisée. Ne partagez jamais votre phrase secrète avec qui que ce soit."
        },
        "step3": {
          "title": "Appuyez sur le bouton de scan",
          "description": "Après votre scan, une invite de connexion apparaîtra pour vous permettre de connecter votre portefeuille."
        }
      },
      "extension": {
        "step1": {
          "title": "Installez l'extension TokenPocket",
          "description": "Nous recommandons d'épingler TokenPocket à votre barre des tâches pour un accès plus rapide à votre portefeuille."
        },
        "step2": {
          "title": "Créer ou Importer un portefeuille",
          "description": "Assurez-vous de sauvegarder votre portefeuille en utilisant une méthode sécurisée. Ne partagez jamais votre phrase secrète avec qui que ce soit."
        },
        "step3": {
          "title": "Rafraîchissez votre navigateur",
          "description": "Une fois que vous avez configuré votre portefeuille, cliquez ci-dessous pour rafraîchir le navigateur et charger l'extension."
        }
      }
    },
    "trust": {
      "qr_code": {
        "step1": {
          "title": "Ouvrez l'application Trust Wallet",
          "description": "Placez Trust Wallet sur votre écran d'accueil pour un accès plus rapide à votre portefeuille."
        },
        "step2": {
          "title": "Créer ou Importer un portefeuille",
          "description": "Créer un nouveau portefeuille ou en importer un existant."
        },
        "step3": {
          "title": "Appuyez sur WalletConnect dans les paramètres",
          "description": "Choisissez Nouvelle Connexion, puis scannez le code QR et confirmez l'invite pour vous connecter."
        }
      },
      "extension": {
        "step1": {
          "title": "Installez l'extension Trust Wallet",
          "description": "Cliquez en haut à droite de votre navigateur et épinglez Trust Wallet pour un accès facile."
        },
        "step2": {
          "title": "Créer ou importer un portefeuille",
          "description": "Créer un nouveau portefeuille ou en importer un existant."
        },
        "step3": {
          "title": "Rafraîchissez votre navigateur",
          "description": "Une fois que vous avez configuré Trust Wallet, cliquez ci-dessous pour rafraîchir le navigateur et charger l'extension."
        }
      }
    },
    "uniswap": {
      "qr_code": {
        "step1": {
          "title": "Ouvrez l'application Uniswap",
          "description": "Ajoutez Uniswap Wallet à votre écran d'accueil pour un accès plus rapide à votre portefeuille."
        },
        "step2": {
          "title": "Créez ou importez un portefeuille",
          "description": "Créez un nouveau portefeuille ou importez-en un existant."
        },
        "step3": {
          "title": "Tapez sur l'icône QR et scannez",
          "description": "Touchez l'icône QR sur votre écran d'accueil, scannez le code et confirmez l'invite pour vous connecter."
        }
      }
    },
    "zerion": {
      "qr_code": {
        "step1": {
          "title": "Ouvrez l'application Zerion",
          "description": "Nous vous recommandons de mettre Zerion sur votre écran d'accueil pour un accès plus rapide."
        },
        "step2": {
          "title": "Créer ou Importer un portefeuille",
          "description": "Assurez-vous de sauvegarder votre portefeuille en utilisant une méthode sécurisée. Ne partagez jamais votre phrase secrète avec personne."
        },
        "step3": {
          "title": "Appuyez sur le bouton de scan",
          "description": "Une fois que vous avez scanné, une invite de connexion apparaîtra pour que vous puissiez connecter votre portefeuille."
        }
      },
      "extension": {
        "step1": {
          "title": "Installer l'extension Zerion",
          "description": "Nous recommandons d'épingler Zerion à votre barre des tâches pour un accès plus rapide à votre portefeuille."
        },
        "step2": {
          "title": "Créez ou Importez un portefeuille",
          "description": "Assurez-vous de sauvegarder votre portefeuille en utilisant une méthode sécurisée. Ne partagez jamais votre phrase secrète avec quiconque."
        },
        "step3": {
          "title": "Rafraîchissez votre navigateur",
          "description": "Une fois que vous avez configuré votre portefeuille, cliquez ci-dessous pour rafraîchir le navigateur et charger l'extension."
        }
      }
    },
    "rainbow": {
      "qr_code": {
        "step1": {
          "title": "Ouvre l'application Rainbow",
          "description": "Nous vous recommandons de mettre Rainbow sur votre écran d'accueil pour un accès plus rapide à votre portefeuille."
        },
        "step2": {
          "title": "Créez ou Importez un portefeuille",
          "description": "Vous pouvez facilement sauvegarder votre portefeuille en utilisant notre fonction de sauvegarde sur votre téléphone."
        },
        "step3": {
          "title": "Appuyez sur le bouton de scan",
          "description": "Après avoir scanné, une invite de connexion apparaîtra pour que vous connectiez votre portefeuille."
        }
      }
    },
    "enkrypt": {
      "extension": {
        "step1": {
          "description": "Nous vous recommandons d'épingler Enkrypt Wallet à votre barre des tâches pour un accès plus rapide à votre portefeuille.",
          "title": "Installez l'extension Enkrypt Wallet"
        },
        "step2": {
          "description": "Assurez-vous de sauvegarder votre portefeuille en utilisant une méthode sécurisée. Ne partagez jamais votre phrase secrète avec quelqu'un.",
          "title": "Créer ou Importer un portefeuille"
        },
        "step3": {
          "description": "Une fois que vous avez configuré votre portefeuille, cliquez ci-dessous pour rafraîchir le navigateur et charger l’extension.",
          "title": "Rafraîchissez votre navigateur"
        }
      }
    },
    "frame": {
      "extension": {
        "step1": {
          "description": "Nous vous recommandons d'épingler Frame à votre barre des tâches pour un accès plus rapide à votre portefeuille.",
          "title": "Installez Frame & l'extension complémentaire"
        },
        "step2": {
          "description": "Assurez-vous de sauvegarder votre portefeuille à l'aide d'une méthode sécurisée. Ne partagez jamais votre phrase secrète avec personne.",
          "title": "Créer ou Importer un portefeuille"
        },
        "step3": {
          "description": "Une fois que vous avez configuré votre portefeuille, cliquez ci-dessous pour rafraîchir le navigateur et charger l'extension.",
          "title": "Rafraîchissez votre navigateur"
        }
      }
    },
    "one_key": {
      "extension": {
        "step1": {
          "title": "Installez l'extension OneKey Wallet",
          "description": "Nous vous recommandons d'épingler OneKey Wallet à votre barre des tâches pour un accès plus rapide à votre portefeuille."
        },
        "step2": {
          "title": "Créer ou Importer un portefeuille",
          "description": "Assurez-vous de sauvegarder votre portefeuille en utilisant une méthode sécurisée. Ne partagez jamais votre phrase secrète avec personne."
        },
        "step3": {
          "title": "Rafraîchissez votre navigateur",
          "description": "Une fois que vous avez configuré votre portefeuille, cliquez ci-dessous pour rafraîchir le navigateur et charger l'extension."
        }
      }
    },
    "phantom": {
      "extension": {
        "step1": {
          "title": "Installez l'extension Phantom",
          "description": "Nous vous recommandons d'épingler Phantom à votre barre des tâches pour un accès plus facile à votre portefeuille."
        },
        "step2": {
          "title": "Créer ou Importer un portefeuille",
          "description": "Assurez-vous de sauvegarder votre portefeuille en utilisant une méthode sécurisée. Ne partagez jamais votre phrase de récupération secrète avec personne."
        },
        "step3": {
          "title": "Rafraîchissez votre navigateur",
          "description": "Une fois que vous avez configuré votre portefeuille, cliquez ci-dessous pour rafraîchir le navigateur et charger l'extension."
        }
      }
    },
    "rabby": {
      "extension": {
        "step1": {
          "title": "Installez l'extension Rabby",
          "description": "Nous recommandons d'épingler Rabby à votre barre des tâches pour un accès plus rapide à votre portefeuille."
        },
        "step2": {
          "title": "Créer ou Importer un portefeuille",
          "description": "Assurez-vous de sauvegarder votre portefeuille en utilisant une méthode sécurisée. Ne partagez jamais votre phrase secrète avec qui que ce soit."
        },
        "step3": {
          "title": "Actualisez votre navigateur",
          "description": "Une fois que vous avez configuré votre portefeuille, cliquez ci-dessous pour actualiser le navigateur et charger l'extension."
        }
      }
    },
    "safeheron": {
      "extension": {
        "step1": {
          "title": "Installez l'extension Core",
          "description": "Nous recommandons d'épingler Safeheron à votre barre des tâches pour un accès plus rapide à votre portefeuille."
        },
        "step2": {
          "title": "Créer ou Importer un portefeuille",
          "description": "Assurez-vous de sauvegarder votre portefeuille en utilisant une méthode sécurisée. Ne partagez jamais votre phrase secrète avec quelqu'un."
        },
        "step3": {
          "title": "Rafraîchissez votre navigateur",
          "description": "Une fois que vous avez configuré votre portefeuille, cliquez ci-dessous pour rafraîchir le navigateur et charger l'extension."
        }
      }
    },
    "taho": {
      "extension": {
        "step1": {
          "title": "Installez l'extension Taho",
          "description": "Nous vous recommandons d'épingler Taho à votre barre des tâches pour un accès plus rapide à votre portefeuille."
        },
        "step2": {
          "title": "Créez ou Importez un portefeuille",
          "description": "Assurez-vous de sauvegarder votre portefeuille en utilisant une méthode sécurisée. Ne partagez jamais votre phrase secrète avec quelqu'un."
        },
        "step3": {
          "title": "Rafraîchissez votre navigateur",
          "description": "Une fois que vous avez configuré votre portefeuille, cliquez ci-dessous pour rafraîchir le navigateur et charger l'extension."
        }
      }
    },
    "talisman": {
      "extension": {
        "step1": {
          "title": "Installez l'extension Talisman",
          "description": "Nous vous recommandons d'épingler Talisman à votre barre des tâches pour un accès plus rapide à votre portefeuille."
        },
        "step2": {
          "title": "Créer ou importer un portefeuille Ethereum",
          "description": "Assurez-vous de sauvegarder votre portefeuille en utilisant une méthode sécurisée. Ne partagez jamais votre phrase de récupération avec personne."
        },
        "step3": {
          "title": "Rafraîchissez votre navigateur",
          "description": "Une fois que vous avez configuré votre portefeuille, cliquez ci-dessous pour rafraîchir le navigateur et charger l'extension."
        }
      }
    },
    "xdefi": {
      "extension": {
        "step1": {
          "title": "Installez l'extension du portefeuille XDEFI",
          "description": "Nous vous recommandons d'épingler XDEFI Wallet à votre barre des tâches pour un accès plus rapide à votre portefeuille."
        },
        "step2": {
          "title": "Créer ou Importer un portefeuille",
          "description": "Assurez-vous de sauvegarder votre portefeuille en utilisant une méthode sécurisée. Ne partagez jamais votre phrase secrète avec qui que ce soit."
        },
        "step3": {
          "title": "Rafraîchissez votre navigateur",
          "description": "Une fois que vous avez configuré votre portefeuille, cliquez ci-dessous pour rafraîchir le navigateur et charger l'extension."
        }
      }
    },
    "zeal": {
      "extension": {
        "step1": {
          "title": "Installez l'extension Zeal",
          "description": "Nous vous recommandons d'épingler Zeal à votre barre des tâches pour un accès plus rapide à votre portefeuille."
        },
        "step2": {
          "title": "Créer ou Importer un Portefeuille",
          "description": "Assurez-vous de sauvegarder votre portefeuille en utilisant une méthode sécurisée. Ne partagez jamais votre phrase secrète avec quiconque."
        },
        "step3": {
          "title": "Rafraîchissez votre navigateur",
          "description": "Une fois que vous avez configuré votre portefeuille, cliquez ci-dessous pour actualiser le navigateur et charger l'extension."
        }
      }
    },
    "safepal": {
      "extension": {
        "step1": {
          "title": "Installez l'extension SafePal Wallet",
          "description": "Cliquez en haut à droite de votre navigateur et épinglez SafePal Wallet pour un accès facile."
        },
        "step2": {
          "title": "Créer ou Importer un portefeuille",
          "description": "Créez un nouveau portefeuille ou importez-en un existant."
        },
        "step3": {
          "title": "Rafraîchissez votre navigateur",
          "description": "Une fois que vous avez configuré SafePal Wallet, cliquez ci-dessous pour rafraîchir le navigateur et charger l'extension."
        }
      },
      "qr_code": {
        "step1": {
          "title": "Ouvrez l'application SafePal Wallet",
          "description": "Mettez SafePal Wallet sur votre écran d'accueil pour un accès plus rapide à votre portefeuille."
        },
        "step2": {
          "title": "Créer ou Importer un Portefeuille",
          "description": "Créez un nouveau portefeuille ou importez-en un existant."
        },
        "step3": {
          "title": "Appuyez sur WalletConnect dans les paramètres",
          "description": "Choisissez Nouvelle Connexion, puis scannez le code QR et confirmez l'invite pour vous connecter."
        }
      }
    },
    "desig": {
      "extension": {
        "step1": {
          "title": "Installez l'extension Desig",
          "description": "Nous vous recommandons d'épingler Desig à votre barre des tâches pour un accès plus facile à votre portefeuille."
        },
        "step2": {
          "title": "Créer un Portefeuille",
          "description": "Assurez-vous de sauvegarder votre portefeuille en utilisant une méthode sécurisée. Ne partagez jamais votre phrase secrète avec quiconque."
        },
        "step3": {
          "title": "Rafraîchissez votre navigateur",
          "description": "Une fois que vous avez configuré votre portefeuille, cliquez ci-dessous pour actualiser le navigateur et charger l'extension."
        }
      }
    },
    "subwallet": {
      "extension": {
        "step1": {
          "title": "Installez l'extension SubWallet",
          "description": "Nous vous recommandons d'épingler SubWallet à votre barre des tâches pour un accès plus rapide à votre portefeuille."
        },
        "step2": {
          "title": "Créer ou Importer un Portefeuille",
          "description": "Assurez-vous de sauvegarder votre portefeuille en utilisant une méthode sécurisée. Ne partagez jamais votre phrase de récupération avec personne."
        },
        "step3": {
          "title": "Rafraîchissez votre navigateur",
          "description": "Une fois que vous avez configuré votre portefeuille, cliquez ci-dessous pour actualiser le navigateur et charger l'extension."
        }
      },
      "qr_code": {
        "step1": {
          "title": "Ouvrez l'application SubWallet",
          "description": "Nous vous recommandons de mettre SubWallet sur votre écran d'accueil pour un accès plus rapide."
        },
        "step2": {
          "title": "Créer ou Importer un Portefeuille",
          "description": "Assurez-vous de sauvegarder votre portefeuille en utilisant une méthode sécurisée. Ne partagez jamais votre phrase secrète avec quiconque."
        },
        "step3": {
          "title": "Appuyez sur le bouton de scan",
          "description": "Après avoir numérisé, une invite de connexion apparaîtra pour vous permettre de connecter votre portefeuille."
        }
      }
    },
    "clv": {
      "extension": {
        "step1": {
          "title": "Installez l'extension CLV Wallet",
          "description": "Nous vous recommandons d'épingler CLV Wallet à votre barre des tâches pour un accès plus rapide à votre portefeuille."
        },
        "step2": {
          "title": "Créer ou Importer un Portefeuille",
          "description": "Assurez-vous de sauvegarder votre portefeuille en utilisant une méthode sécurisée. Ne partagez jamais votre phrase secrète avec quiconque."
        },
        "step3": {
          "title": "Rafraîchissez votre navigateur",
          "description": "Une fois que vous avez configuré votre portefeuille, cliquez ci-dessous pour actualiser le navigateur et charger l'extension."
        }
      },
      "qr_code": {
        "step1": {
          "title": "Ouvrez l'application CLV Wallet",
          "description": "Nous vous recommandons de mettre CLV Wallet sur votre écran d'accueil pour un accès plus rapide."
        },
        "step2": {
          "title": "Créer ou Importer un Portefeuille",
          "description": "Assurez-vous de sauvegarder votre portefeuille en utilisant une méthode sécurisée. Ne partagez jamais votre phrase secrète avec quiconque."
        },
        "step3": {
          "title": "Appuyez sur le bouton de scan",
          "description": "Après avoir numérisé, une invite de connexion apparaîtra pour vous permettre de connecter votre portefeuille."
        }
      }
    },
    "okto": {
      "qr_code": {
        "step1": {
          "title": "Ouvrez l'application Okto",
          "description": "Ajoutez Okto à votre écran d'accueil pour un accès rapide"
        },
        "step2": {
          "title": "Créer un portefeuille MPC",
          "description": "Créez un compte et générez un portefeuille"
        },
        "step3": {
          "title": "Appuyez sur WalletConnect dans les paramètres",
          "description": "Touchez l'icône 'Scan QR' en haut à droite et confirmez l'invite pour vous connecter."
        }
      }
    },
    "ledger": {
      "desktop": {
        "step1": {
          "title": "Ouvrez l'application Ledger Live",
          "description": "Nous vous recommandons de mettre Ledger Live sur votre écran d'accueil pour un accès plus rapide."
        },
        "step2": {
          "title": "Configurez votre Ledger",
          "description": "Configurez un nouveau Ledger ou connectez-vous à un existant."
        },
        "step3": {
          "title": "Connecter",
          "description": "Une fois que vous avez scanné, une invite de connexion apparaîtra pour que vous puissiez connecter votre portefeuille."
        }
      },
      "qr_code": {
        "step1": {
          "title": "Ouvrez l'application Ledger Live",
          "description": "Nous vous recommandons de mettre Ledger Live sur votre écran d'accueil pour un accès plus rapide."
        },
        "step2": {
          "title": "Configurez votre Ledger",
          "description": "Vous pouvez soit synchroniser avec l'application de bureau, soit connecter votre Ledger."
        },
        "step3": {
          "title": "Scannez le code",
          "description": "Appuyez sur WalletConnect puis passez au Scanner. Une fois que vous avez scanné, une invite de connexion apparaîtra pour que vous puissiez connecter votre portefeuille."
        }
      }
    }
  }
}
`;const XE=Object.freeze(Object.defineProperty({__proto__:null,default:HE},Symbol.toStringTag,{value:"Module"}));var _E=`{
  "connect_wallet": {
    "label": "वॉलेट को कनेक्ट करें"
  },
  "intro": {
    "title": "वॉलेट क्या है?",
    "description": "एक वॉलेट का उपयोग डिजिटल संपत्तियों को भेजने, प्राप्त करने, संग्रहित करने और प्रदर्शित करने के लिए किया जाता है। यह एक नया तरीका भी है लॉग इन करने का, हर वेबसाइट पर नए खाते और पासवर्ड बनाने की जरूरत के बिना।",
    "digital_asset": {
      "title": "अपने डिजिटल संपत्तियों के लिए एक घर",
      "description": "वॉलेट का उपयोग Ethereum और NFTs जैसी डिजिटल संपत्तियों को भेजने, प्राप्त करने, संग्रहित करने और प्रदर्शित करने के लिए किया जाता है."
    },
    "login": {
      "title": "लॉग इन करने का एक नया तरीका",
      "description": "हर वेबसाइट पर नए खाते और पासवर्ड बनाने की बजाय, बस अपना वॉलेट कनेक्ट करें."
    },
    "get": {
      "label": "एक वॉलेट प्राप्त करें"
    },
    "learn_more": {
      "label": "और जानें"
    }
  },
  "sign_in": {
    "label": "अपने खाते की पुष्टि करें",
    "description": "जुड़ने को पूरा करने के लिए, आपको अपने बटुए में एक संदेश पर हस्ताक्षर करना होगा ताकि पुष्टि हो सके कि आप इस खाते के मालिक हैं।",
    "message": {
      "send": "संदेश भेजें",
      "preparing": "संदेश तैयार कर रहा है...",
      "cancel": "रद्द करें",
      "preparing_error": "संदेश तैयार करते समय त्रुटि, कृपया पुनः प्रयास करें!"
    },
    "signature": {
      "waiting": "हस्ताक्षर का इंतजार कर रहा है...",
      "verifying": "हस्ताक्षर की पुष्टि की जा रही है...",
      "signing_error": "संदेश पर हस्ताक्षर करते समय त्रुटि, कृपया पुनः प्रयास करें!",
      "verifying_error": "हस्ताक्षर की पुष्टि में त्रुटि, कृपया पुनः प्रयास करें!",
      "oops_error": "ओह, कुछ गलत हो गया!"
    }
  },
  "connect": {
    "label": "कनेक्ट करें",
    "title": "वॉलेट को कनेक्ट करें",
    "new_to_ethereum": {
      "description": "Ethereum वॉलेट्स में नए हैं?",
      "learn_more": {
        "label": "और जानें"
      }
    },
    "learn_more": {
      "label": "और जानें।"
    },
    "recent": "हाल ही में",
    "status": {
      "opening": "%{wallet}खोल रहा है...",
      "connecting": "जोड़ रहा है",
      "connect_mobile": "जारी रखें %{wallet}",
      "not_installed": "%{wallet} स्थापित नहीं है",
      "not_available": "%{wallet} उपलब्ध नहीं है",
      "confirm": "एक्सटेंशन में कनेक्शन की पुष्टि करें",
      "confirm_mobile": "वॉलेट में कनेक्शन अनुरोध स्वीकार करें"
    },
    "secondary_action": {
      "get": {
        "description": "क्या आपके पास %{wallet}नहीं है ?",
        "label": "प्राप्त करें"
      },
      "install": {
        "label": "स्थापित करें"
      },
      "retry": {
        "label": "पुनः प्रयास करें"
      }
    },
    "walletconnect": {
      "description": {
        "full": "क्या आपको आधिकारिक WalletConnect मोडल की आवश्यकता है?",
        "compact": "क्या आपको WalletConnect मोडल की आवश्यकता है?"
      },
      "open": {
        "label": "खोलें"
      }
    }
  },
  "connect_scan": {
    "title": "स्कैन करें विथ %{wallet}",
    "fallback_title": "अपने फोन से स्कैन करें"
  },
  "connector_group": {
    "recommended": "अनुशंसित",
    "other": "अन्य",
    "popular": "लोकप्रिय",
    "more": "अधिक",
    "others": "अन्य लोग"
  },
  "get": {
    "title": "एक वॉलेट प्राप्त करें",
    "action": {
      "label": "प्राप्त करें"
    },
    "mobile": {
      "description": "मोबाइल वॉलेट"
    },
    "extension": {
      "description": "ब्राउज़र एक्सटेंशन"
    },
    "mobile_and_extension": {
      "description": "मोबाइल वॉलेट और एक्सटेंशन"
    },
    "mobile_and_desktop": {
      "description": "मोबाइल और डेस्कटॉप वॉलेट"
    },
    "looking_for": {
      "title": "क्या आपको जो चाहिए वह नहीं मिल रहा है?",
      "mobile": {
        "description": "मुख्य स्क्रीन पर एक बटुआ चुनें ताकि आप एक अलग बटुआ प्रदाता के साथ शुरू कर सकें।"
      },
      "desktop": {
        "compact_description": "मुख्य स्क्रीन पर एक बटुआ चुनें ताकि आप एक अलग बटुआ प्रदाता के साथ शुरू कर सकें।",
        "wide_description": "बाएं एक बटुआ चुनें ताकि आप एक अलग बटुआ प्रदाता के साथ शुरू कर सकें।"
      }
    }
  },
  "get_options": {
    "title": "%{wallet}के साथ शुरू करें",
    "short_title": "%{wallet}प्राप्त करें",
    "mobile": {
      "title": "मोबाइल के लिए %{wallet}",
      "description": "मोबाइल वॉलेट का उपयोग करके Ethereum की दुनिया का अन्वेषण करें।",
      "download": {
        "label": "ऐप प्राप्त करें"
      }
    },
    "extension": {
      "title": "%{wallet} के लिए %{browser}",
      "description": "अपने पसंदीदा वेब ब्राउज़र से अपने वॉलेट तक पहुंचें।",
      "download": {
        "label": "करें जोड़ें %{browser}"
      }
    },
    "desktop": {
      "title": "%{wallet} के लिए %{platform}",
      "description": "अपने शक्तिशाली डेस्कटॉप से आपके वॉलेट की स्वतंत्रता द्वारा पहुंच।",
      "download": {
        "label": "को जोड़ें %{platform}"
      }
    }
  },
  "get_mobile": {
    "title": "स्थापित करें %{wallet}",
    "description": "iOS या Android पर डाउनलोड करने के लिए अपने फोन से स्कैन करें",
    "continue": {
      "label": "जारी रखें"
    }
  },
  "get_instructions": {
    "mobile": {
      "connect": {
        "label": "जोड़ें"
      },
      "learn_more": {
        "label": "और जानें"
      }
    },
    "extension": {
      "refresh": {
        "label": "ताज़ा करें"
      },
      "learn_more": {
        "label": "और जानें"
      }
    },
    "desktop": {
      "connect": {
        "label": "कनेक्ट करें"
      },
      "learn_more": {
        "label": "और जानें"
      }
    }
  },
  "chains": {
    "title": "नेटवर्क स्विच करें",
    "wrong_network": "गलत नेटवर्क का पता चला, जारी रखने के लिए स्विच करें या कनेक्ट करें।",
    "confirm": "वॉलेट में पुष्टि करें",
    "switching_not_supported": "आपका वॉलेट नेटवर्क्स को %{appName}से स्विच करना समर्थन नहीं करता . बजाय अपने वॉलेट के भीतर से नेटवर्क स्विच करने का प्रयास करें।",
    "switching_not_supported_fallback": "आपका वॉलेट इस एप से नेटवर्क्स स्विच करने का समर्थन नहीं करता। बजाय उसके, अपना वॉलेट द्वारा नेटवर्क्स स्विच करने की कोशिश करें।",
    "disconnect": "डिकनेक्ट",
    "connected": "कनेक्ट किया गया"
  },
  "profile": {
    "disconnect": {
      "label": "डिकनेक्ट"
    },
    "copy_address": {
      "label": "पता कॉपी करें",
      "copied": "कॉपी कर दिया गया!"
    },
    "explorer": {
      "label": "एक्सप्लोरर पर अधिक देखें"
    },
    "transactions": {
      "description": "%{appName} लेन - देन यहां दिखाई देंगे...",
      "description_fallback": "आपके लेन-देन यहां दिखाई देंगे...",
      "recent": {
        "title": "हाल के लेन - देन"
      },
      "clear": {
        "label": "सभी को हटाएं"
      }
    }
  },
  "wallet_connectors": {
    "argent": {
      "qr_code": {
        "step1": {
          "description": "अपने वॉलेट को जल्दी से एक्सेस करने के लिए आपके होम स्क्रीन पर Argent डालें।",
          "title": "Argent ऐप खोलें"
        },
        "step2": {
          "description": "वॉलेट और उपयोगकर्ता नाम बनाएं, या मौजूदा वॉलेट को आयात करें।",
          "title": "वॉलेट बनाएं या आयात करें"
        },
        "step3": {
          "description": "जैसे ही आप स्कैन करेंगे, एक कनेक्शन संकेत आपके वॉलेट को कनेक्ट करने के लिए प्रकट होगा।",
          "title": "QR स्कैन बटन को टैप करें"
        }
      }
    },
    "bifrost": {
      "qr_code": {
        "step1": {
          "description": "हम आपको सलाह देते हैं कि Bifrost Wallet को अपने होम स्क्रीन पर लगाएं, ताकि त्वरित एक्सेस को सुनिश्चित किया जा सके।",
          "title": "Bifrost Wallet ऐप को खोलें"
        },
        "step2": {
          "description": "अपने रिकवरी फ़्रेज़ का उपयोग करके एक वॉलेट बनाएं या इंपोर्ट करें।",
          "title": "वॉलेट बनाएं या इंपोर्ट करें"
        },
        "step3": {
          "description": "स्कैन करने के बाद, आपके वॉलेट को कनेक्ट करने के लिए एक कनेक्शन संकेत दिखाई देगा।",
          "title": "स्कैन बटन को टैप करें"
        }
      }
    },
    "bitget": {
      "qr_code": {
        "step1": {
          "description": "हम इसे सुझाव देते हैं कि आप अपने होम स्क्रीन पर Bitget वॉलेट को रखें ताकि जल्दी एक्सेस कर सकें।",
          "title": "Bitget वॉलेट एप को खोलें"
        },
        "step2": {
          "description": "अपने वॉलेट का बैकअप एक सुरक्षित तरीके से लेने के लिए सुनिश्चित करें। किसी के साथ भी अपना गुप्त वाक्यांश साझा न करें।",
          "title": "वॉलेट बनाएं या आयात करें"
        },
        "step3": {
          "description": "स्कैन करने के बाद, आपके वॉलेट को कनेक्ट करने का एक संकेत दिखाई देगा।",
          "title": "स्कैन बटन पर टैप करें"
        }
      },
      "extension": {
        "step1": {
          "description": "हम इसे सुझाव देते हैं कि आप Bitget वॉलेट को आपके टास्कबार में पिन करें ताकि आपके वॉलेट तक जल्दी पहुंच सकें।",
          "title": "Bitget Wallet एक्सटेंशन स्थापित करें"
        },
        "step2": {
          "description": "सुनिश्चित करें कि आप अपने वॉलेट का बैकअप किसी सुरक्षित तरीके से ले रहे हैं। अपनी गुप्त वाक्यांश को कभी किसी के साथ साझा न करें।",
          "title": "एक वॉलेट बनाएं या आयात करें"
        },
        "step3": {
          "description": "एक बार जब आप अपना वॉलेट सेटअप कर लेते हैं, तो नीचे क्लिक करें ताकि ब्राउज़र को ताज़ा करें और एक्सटेंशन लोड करें।",
          "title": "अपने ब्राउज़र को ताज़ा करें"
        }
      }
    },
    "bitski": {
      "extension": {
        "step1": {
          "description": "हम आपको अपने वॉलेट तक जल्दी पहुंचने के लिए Bitski को अपने टास्कबार में पिन करने की सलाह देते हैं।",
          "title": "Bitski एक्सटेंशन स्थापित करें"
        },
        "step2": {
          "description": "सुनिश्चित करें कि आप एक सुरक्षित तरीके से अपने वॉलेट का बैकअप बना रहे हैं। कभी भी किसी के साथ अपने गोपनीय वाक्यांश को साझा न करें।",
          "title": "एक वॉलेट बनाएं या आयात करें"
        },
        "step3": {
          "description": "एक बार जब आप अपना वॉलेट सेट कर लेते हैं, तो ब्राउज़र को ताज़ा करने और एक्सटेंशन को लोड करने के लिए नीचे क्लिक करें।",
          "title": "अपने ब्राउज़र को ताज़ा करें"
        }
      }
    },
    "coin98": {
      "qr_code": {
        "step1": {
          "description": "हम आपके वॉलेट तक तेजी से पहुंचने के लिए अपने होम स्क्रीन पर Coin98 वॉलेट रखने की सलाह देते हैं।",
          "title": "Coin98 वॉलेट ऐप को खोलें"
        },
        "step2": {
          "description": "आप अपने फोन पर हमारे बैकअप फीचर का उपयोग करके आसानी से अपने वॉलेट का बैकअप कर सकते हैं।",
          "title": "वॉलेट बनाएं या आयात करें"
        },
        "step3": {
          "description": "स्कैन करने के बाद, आपके वॉलेट को कनेक्ट करने के लिए एक कनेक्शन प्रांप्ट दिखाई देगा।",
          "title": "WalletConnect बटन पर टैप करें"
        }
      },
      "extension": {
        "step1": {
          "description": "अपने ब्राउज़र के ऊपरी दाएं हिस्से पर क्लिक करें और आसानी से पहुंच के लिए Coin98 वॉलेट को पिन करें।",
          "title": "Coin98 वॉलेट एक्सटेंशन स्थापित करें"
        },
        "step2": {
          "description": "नया बटुआ बनाएं या मौजूदा को आयात करें।",
          "title": "एक बटुआ बनाएं या आयात करें"
        },
        "step3": {
          "description": "एक बार जब आप Coin98 वॉलेट सेट करते हैं, तो नीचे क्लिक करके ब्राउजर को ताजा करें और एक्सटेंशन को लोड करें।",
          "title": "अपने ब्राउज़र को ताज़ा करें"
        }
      }
    },
    "coinbase": {
      "qr_code": {
        "step1": {
          "description": "हम आपको सलाह देते हैं कि आपकी मुख्य बिल्ड स्क्रीन पर Coinbase वॉलेट को रखें जिससे आपकी पहुंच तेज हो।",
          "title": "Coinbase वॉलेट ऐप खोलें"
        },
        "step2": {
          "description": "आप बादल बैकअप सुविधा का उपयोग करके आसानी से अपने वॉलेट का बैकअप ले सकते हैं।",
          "title": "एक वॉलेट बनाएं या आयात करें"
        },
        "step3": {
          "description": "जैसे ही आप स्कैन करते हैं, आपको अपने वॉलेट से कनेक्ट करने के लिए एक कनेक्शन संकेत दिखाई देगा।",
          "title": "स्कैन बटन को छूना"
        }
      },
      "extension": {
        "step1": {
          "description": "हमारा सिफारिश है कि आप अपने वॉलेट तक जल्दी पहुंचने के लिए Coinbase वॉलेट को अपने टास्कबार पर पिन पर रखें।",
          "title": "Coinbase वॉलेट एक्सटेंशन स्थापित करें"
        },
        "step2": {
          "description": "सुरक्षित विधि का उपयोग करके अपने बटुए का बैकअप लेना सुनिश्चित करें। अपना गुप्त पुनर्प्राप्ति वाक्यांश कभी भी किसी के साथ साझा न करें।",
          "title": "वॉलेट बनाएं या आयात करें"
        },
        "step3": {
          "description": "एक बार जब आप अपना वॉलेट सेट अप करते हैं, तो ब्राउज़र को ताजगी देने और एक्सटेंशन को लोड करने के लिए नीचे क्लिक करें.",
          "title": "अपना ब्राउज़र ताजा करें"
        }
      }
    },
    "core": {
      "qr_code": {
        "step1": {
          "description": "हम आपकी वॉलेट के तेज एक्सेस के लिए Core को आपके होम स्क्रीन पर डालने की सलाह देते हैं.",
          "title": "Core एप खोलें"
        },
        "step2": {
          "description": "आप आसानी से अपने फ़ोन पर हमारे बैकअप फीचर का उपयोग करके अपना वॉलेट बैकअप कर सकते हैं.",
          "title": "वॉलेट बनाएं या आयात करें"
        },
        "step3": {
          "description": "स्कैन करने के बाद, आपके वॉलेट को कनेक्ट करने के लिए आपके लिए कनेक्शन प्राम्प्ट प्रकट होगा.",
          "title": "WalletConnect बटन को छूने के साथ"
        }
      },
      "extension": {
        "step1": {
          "description": "हम अपने वॉलेट के लिए तेज एक्सेस के लिए कोर को अपने टास्कबार में पिन करने की सिफारिश करते हैं।",
          "title": "कोर एक्सटेंशन स्थापित करें"
        },
        "step2": {
          "description": "सुनिश्चित करें कि आप अपने वॉलेट का बैकअप एक सुरक्षित तरीके से ले। कभी भी किसी के साथ अपनी गुप्त वाक्यांश साझा न करें।",
          "title": "एक वॉलेट बनाएं या आयात करें"
        },
        "step3": {
          "description": "एक बार जब आप अपने वॉलेट की स्थापना कर लें, तो नीचे क्लिक करें ताकि ब्राउज़र को ताज़ा कर सकें और एक्सटेंशन को लोड कर सकें।",
          "title": "अपने ब्राउज़र को ताज़ा करें"
        }
      }
    },
    "fox": {
      "qr_code": {
        "step1": {
          "description": "हम FoxWallet को अपने होम स्क्रीन पर रखने की सिफारिश करते हैं ताकि त्वरित एक्सेस मिल सके।",
          "title": "FoxWallet ऐप खोलें"
        },
        "step2": {
          "description": "सुनिश्चित करें कि आप एक सुरक्षित तरीके का उपयोग करके अपने वॉलेट का बैकअप ले रहे हैं। कभी भी किसी के साथ अपना गुप्त वाक्यांश साझा न करें।",
          "title": "वॉलेट बनाएं या आयात करें"
        },
        "step3": {
          "description": "जब आप स्कैन करेंगे, तो आपके वॉलेट को कनेक्ट करने के लिए एक कनेक्शन संकेत प्रकट होगा।",
          "title": "स्कैन बटन पर टैप करें"
        }
      }
    },
    "frontier": {
      "qr_code": {
        "step1": {
          "description": "हमारी सिफारिश है कि आप अपने होम स्क्रीन पर फ्रंटियर वॉलेट रखें जिससे कि आपको त्वरित पहुंच मिले।",
          "title": "फ्रंटियर वॉलेट ऐप को खोलें"
        },
        "step2": {
          "description": "सुनिश्चित करें कि आप एक सुरक्षित तरीके का उपयोग करके अपने वॉलेट का बैकअप ले रहे हैं। कभी भी किसी के साथ अपना गुप्त वाक्यांश साझा न करें।",
          "title": "वॉलेट बनाएं या आयात करें"
        },
        "step3": {
          "description": "जब आप स्कैन करते हैं, तो आपके वॉलेट को कनेक्ट करने के लिए एक कनेक्शन संकेत प्रकट होगा।",
          "title": "स्कैन बटन को टैप करें"
        }
      },
      "extension": {
        "step1": {
          "description": "हम आपके वॉलेट की तेजी से पहुंच के लिए Frontier Wallet को अपने टास्कबार में पिन करने की सिफारिश करते हैं।",
          "title": "Frontier Wallet एक्सटेंशन इंस्टॉल करें"
        },
        "step2": {
          "description": "सुनिश्चित करें कि आप एक सुरक्षित तरीके से अपना वॉलेट बैकअप कर रहे हैं। कभी भी किसी के साथ अपना गुप्त वाक्यांश साझा न करें।",
          "title": "वॉलेट बनाएं या आयात करें"
        },
        "step3": {
          "description": "वॉलेट सेटअप होने के बाद, ब्राउज़र को रिफ्रेश करने के लिए नीचे क्लिक करें और एक्सटेंशन लोड करें।",
          "title": "अपना ब्राउज़र रिफ्रेश करें"
        }
      }
    },
    "im_token": {
      "qr_code": {
        "step1": {
          "title": "imToken ऐप खोलें",
          "description": "अपने वॉलेट के तेजी से पहुँच के लिए imToken एप्लीकेशन को अपने होम स्क्रीन पर रखें।"
        },
        "step2": {
          "title": "वॉलेट बनाएं या आयात करें",
          "description": "एक नया वॉलेट बनाएं या मौजूदा एक को आयात करें।"
        },
        "step3": {
          "title": "ऊपरी दाएं कोने में स्कैनर आइकॉन पर टैप करें",
          "description": "नया कनेक्शन चुनें, फिर QR कोड स्कैन करें और कनेक्ट करने के लिए प्रॉम्प्ट की पुष्टि करें।"
        }
      }
    },
    "metamask": {
      "qr_code": {
        "step1": {
          "title": "MetaMask ऐप को खोलें",
          "description": "हम आपको MetaMask को आपकी होम स्क्रीन पर रखने की सलाह देते हैं, इससे आपको त्वरित पहुँच मिलेगी।"
        },
        "step2": {
          "title": "एक वॉलेट बनाएं या इम्पोर्ट करें",
          "description": "सुरक्षित विधि का उपयोग करके अपने बटुए का बैकअप लेना सुनिश्चित करें। अपना गुप्त वाक्यांश कभी भी किसी के साथ साझा न करें।"
        },
        "step3": {
          "title": "स्कैन बटन पर टैप करें",
          "description": "स्कैन करने के बाद, आपके वॉलेट को कनेक्ट करने के लिए एक कनेक्शन प्रॉम्प्ट दिखाई देगा।"
        }
      },
      "extension": {
        "step1": {
          "title": "MetaMask एक्सटेंशन स्थापित करें",
          "description": "हम अपने वॉलेट तक जल्दी से पहुँचने के लिए MetaMask को अपने टास्कबार में पिन करने की सलाह देते हैं।"
        },
        "step2": {
          "title": "वॉलेट बनाएं या आयात करें",
          "description": "अपने वॉलेट का बैकअप एक सुरक्षित तरीके से लेना सुनिश्चित करें। अपनी गुप्त वाक्यांश को किसी के साथ शेयर न करें।"
        },
        "step3": {
          "title": "अपना ब्राउज़र ताज़ा करें",
          "description": "एक बार जब आप अपना वॉलेट सेट अप करते हैं, तो ब्राउजर को ताज़ा करने और एक्सटेंशन को लोड करने के लिए नीचे क्लिक करें।"
        }
      }
    },
    "okx": {
      "qr_code": {
        "step1": {
          "title": "OKX Wallet ऐप खोलें",
          "description": "हम आपको OKX Wallet को अपने होम स्क्रीन पर रखने की सलाह देते हैं, जिससे आप जल्दी से पहुंच सकें।"
        },
        "step2": {
          "title": "वॉलेट बनाएं या आयात करें",
          "description": "अपने वॉलेट का बैकअप एक सुरक्षित तरीके से लेने का यकीन करें। कभी भी किसी के साथ अपने गुप्त वाक्यांश साझा न करें।"
        },
        "step3": {
          "title": "स्कैन बटन पर टैप करें",
          "description": "जब आप स्कैन करते हैं, तो आपके वॉलेट को कनेक्ट करने के लिए एक कनेक्शन संकेत प्रकट होगा।"
        }
      },
      "extension": {
        "step1": {
          "title": "OKX वॉलेट एक्सटेंशन स्थापित करें",
          "description": "हम अपने वॉलेट तक तेज़ी से पहुंचने के लिए आपको OKX वॉलेट को अपने कार्यपट्टी में पिन करने की सलाह देते हैं।"
        },
        "step2": {
          "title": "वॉलेट बनाएं या आयात करें",
          "description": "अपने वॉलेट का बैकअप एक सुरक्षित तरीके से लेने का यकीन करें। कभी भी किसी के साथ अपने गुप्त वाक्यांश साझा न करें।"
        },
        "step3": {
          "title": "अपने ब्राउज़र को ताज़ा करें",
          "description": "जब आप अपना वॉलेट सेट अप कर लेते हैं, तो नीचे क्लिक करके ब्राउज़र को ताजा करें और एक्सटेंशन को लोड करें।"
        }
      }
    },
    "omni": {
      "qr_code": {
        "step1": {
          "title": "Omni ऐप को खोलें",
          "description": "अपने वॉलेट तक अधिक जल्दी पहुंचने के लिए Omni को अपने होम स्क्रीन पर जोड़ें।"
        },
        "step2": {
          "title": "वॉलेट बनाएं या आयात करें",
          "description": "एक नया वॉलेट बनाएं या मौजूदा एक को आयात करें।"
        },
        "step3": {
          "title": "QR आइकन पर टैप करें और स्कैन करें",
          "description": "अपने होम स्क्रीन पर QR आइकन पर टैप करें, कोड स्कैन करें और कनेक्ट करने के लिए प्रॉम्प्ट की पुष्टि करें।"
        }
      }
    },
    "token_pocket": {
      "qr_code": {
        "step1": {
          "title": "TokenPocket ऐप को खोलें",
          "description": "हम आपको TokenPocket को अपने होम स्क्रीन पर रखने की सलाह देते हैं ताकि आपको तेज एक्सेस मिल सके।"
        },
        "step2": {
          "title": "एक वॉलेट बनाएँ या आयात करें",
          "description": "सुरक्षित विधि का उपयोग करके अपने बटुए का बैकअप लेना सुनिश्चित करें। अपना गुप्त वाक्यांश कभी भी किसी के साथ साझा न करें।"
        },
        "step3": {
          "title": "स्कैन बटन पर टैप करें",
          "description": "एक बार स्कैन करने के बाद, आपके लिए एक कनेक्शन प्रॉम्प्ट प्रकट होगा ताकि आप अपने वॉलेट को कनेक्ट कर सकें।"
        }
      },
      "extension": {
        "step1": {
          "title": "TokenPocket एक्सटेंशन स्थापित करें",
          "description": "हम अपने वॉलेट तक त्वरित पहुंच के लिए TokenPocket को अपने taskbar पर pin करने की सिफारिश करते हैं।"
        },
        "step2": {
          "title": "वॉलेट बनाएं या आयात करें",
          "description": "सुनिश्चित करें कि आप अपने वॉलेट का बैकअप एक सुरक्षित तरीके से लेते हैं। कभी किसी के साथ अपना गुप्त वाक्यांश साझा न करें।"
        },
        "step3": {
          "title": "अपना ब्राउज़र ताज़ा करें",
          "description": "एक बार जब आप अपना वॉलेट सेटअप कर लेते हैं, तो नीचे क्लिक करें ताज़ा ब्राउज़र  लोड करें और एक्सटेंशन अप करें।"
        }
      }
    },
    "trust": {
      "qr_code": {
        "step1": {
          "title": "Trust Wallet ऐप खोलें",
          "description": "अपने वॉलेट तक तेज़ी से पहुंचने के लिए Trust Wallet को अपने होम स्क्रीन पर रखें।"
        },
        "step2": {
          "title": "वॉलेट बनाएं या आयात करें",
          "description": "एक नया वॉलेट बनाएं या मौजूदा वॉलेट आयात करें।"
        },
        "step3": {
          "title": "सेटिंग्स में WalletConnect को टैप करें",
          "description": "नया कनेक्शन चुनें, फिर QR कोड स्कैन करें और प्रम्प्ट की पुष्टि करें।"
        }
      },
      "extension": {
        "step1": {
          "title": "Trust Wallet एक्सटेंशन को इंस्टॉल करें",
          "description": "अपने ब्राउज़र के ऊपरी दाएं कोने पर क्लिक करें और Trust Wallet को आसानी से प्रवेश के लिए पिन करें।"
        },
        "step2": {
          "title": "एक वॉलेट बनाएं या आयात करें",
          "description": "एक नया वॉलेट बनाएं या मौजूदा वॉलेट आयात करें।"
        },
        "step3": {
          "title": "अपने ब्राउज़र को ताज़ा करें",
          "description": "एक बार Trust Wallet सेट अप करने के बाद, नीचे क्लिक करें ब्राउज़र को ताज़ा करने और एक्सटेंशन लोड करने के लिए।"
        }
      }
    },
    "uniswap": {
      "qr_code": {
        "step1": {
          "title": "Uniswap ऐप को खोलें",
          "description": "अपने होम स्क्रीन पर Uniswap वॉलेट जोड़ें, इससे आपके वॉलेट तक तेजी से पहुंचने की सुविधा होगी।"
        },
        "step2": {
          "title": "वॉलेट बनाएं या आयात करें",
          "description": "एक नया वॉलेट बनाएं या मौजूदा वॉलेट को आयात करें।"
        },
        "step3": {
          "title": "QR आइकन पर टैप करें और स्कैन करें",
          "description": "अपने होमस्क्रीन पर QR आइकन पर टैप करें, कोड स्कैन करें और प्रम्प्ट को कनेक्ट करने की पुष्टि करें।"
        }
      }
    },
    "zerion": {
      "qr_code": {
        "step1": {
          "title": "Zerion ऐप को खोलें",
          "description": "हम सलाह देते हैं कि आप Zerion को अपने होम स्क्रीन पर रखें, इससे तेजी से एक्सेस करने में आसानी होगी।"
        },
        "step2": {
          "title": "एक वॉलेट बनाएं या आयात करें",
          "description": "सुरक्षित विधि का उपयोग करके अपने बटुए का बैकअप लेना सुनिश्चित करें। अपना गुप्त वाक्यांश कभी भी किसी के साथ साझा न करें।"
        },
        "step3": {
          "title": "स्कैन बटन को टैप करें",
          "description": "आप स्कैन करने के बाद, एक कनेक्शन प्रोम्प्ट आपके बटुए को कनेक्ट करने के लिए प्रकट होगा।"
        }
      },
      "extension": {
        "step1": {
          "title": "Zerion एक्सटेंशन स्थापित करें",
          "description": "हमारी सिफारिश है कि आप अपने वॉलेट तक जल्दी पहुँचने के लिए Zerion को अपने टास्कबार में पिन करें।"
        },
        "step2": {
          "title": "वॉलेट बनाएं या आयात करें",
          "description": "सुनिश्चित करें कि आप एक सुरक्षित विधि का उपयोग करके अपने वॉलेट का बैकअप ले रहे हैं। अपना गुप्त वाक्य कभी किसी के साथ साझा न करें।"
        },
        "step3": {
          "title": "अपना ब्राउज़र ताज़ा करें",
          "description": "एक बार जब आप अपने वॉलेट की स्थापना कर लें, तो ब्राउज़र को ताज़ा करने और एक्सटेंशन को लोड करने के लिए नीचे क्लिक करें।"
        }
      }
    },
    "rainbow": {
      "qr_code": {
        "step1": {
          "title": "Rainbow ऐप को खोलें",
          "description": "हम अपने वॉलेट के तेज एक्सेस के लिए Rainbow को अपने होम स्क्रीन पर रखने की सलाह देते हैं।"
        },
        "step2": {
          "title": "वॉलेट बनाएं या आयात करें",
          "description": "आप अपने फ़ोन पर हमारे बैकअप फीचर का उपयोग करके अपने वॉलेट का बैकअप आसानी से ले सकते हैं।"
        },
        "step3": {
          "title": "स्कैन बटन पर टैप करें",
          "description": "जब आप स्कैन करते हैं, तो आपकी वॉलेट से कनेक्ट करने के लिए एक कनेक्शन संकेत दिखाई देगा।"
        }
      }
    },
    "enkrypt": {
      "extension": {
        "step1": {
          "description": "हम अपनी वॉलेट तक तेज़ी से पहुँच के लिए Enkrypt वॉलेट को अपने टास्कबार में पिन करने की सलाह देते हैं।",
          "title": "Enkrypt वॉलेट एक्सटेंशन स्थापित करें"
        },
        "step2": {
          "description": "सुनिश्चित करें कि आप अपनी वॉलेट का बैकअप एक सुरक्षित तरीके से ले। अपनी गुप्त वाक्यांश को कभी भी किसी के साथ साझा न करें।",
          "title": "एक वॉलेट बनाएं या आयात करें"
        },
        "step3": {
          "description": "एक बार जब आप अपनी वॉलेट सेट कर लें, तो नीचे क्लिक करें ब्राउज़र को ताज़ा करने और एक्सटेंशन लोड करने के लिए।",
          "title": "अपने ब्राउज़र को ताज़ा करें"
        }
      }
    },
    "frame": {
      "extension": {
        "step1": {
          "description": "हम अपनी वॉलेट तक तेज़ी से पहुँच के लिए Frame को अपने टास्कबार में पिन करने की सलाह देते हैं।",
          "title": "Frame और साथी एक्सटेंशन स्थापित करें"
        },
        "step2": {
          "description": "अपने वॉलेट का बैकअप एक सुरक्षित तरीके से लेना सुनिश्चित करें। कभी भी अपनी गुप्त वाक्यांश को किसी के साथ साझा न करें।",
          "title": "वॉलेट बनाएं या आयात करें"
        },
        "step3": {
          "description": "एक बार जब आप अपने वॉलेट की सेटअप कर लेते हैं, तो नीचे क्लिक करके ब्राउज़र को ताज़ा करें और एक्सटेंशन को लोड करें।",
          "title": "अपना ब्राउज़र ताज़ा करें"
        }
      }
    },
    "one_key": {
      "extension": {
        "step1": {
          "title": "OneKey Wallet एक्सटेंशन स्थापित करें",
          "description": "हम आपको अपने वॉलेट की तेज एक्सेस के लिए OneKey Wallet को अपने टास्कबार में पिन करने की सलाह देते हैं।"
        },
        "step2": {
          "title": "वॉलेट बनाएं या आयात करें",
          "description": "सुनिश्चित करें कि आप अपने वॉलेट का बैकअप एक सुरक्षित तरीके से ले रहे हैं। अपना गुप्त वाक्यांश किसी के साथ भी साझा न करें।"
        },
        "step3": {
          "title": "अपने ब्राउज़र को ताज़ा करें",
          "description": "एक बार जब आप अपना वॉलेट सेट अप कर लेते हैं, तो ब्राउज़र को ताज़ा करने और एक्सटेंशन को लोड करने के लिए नीचे क्लिक करें।"
        }
      }
    },
    "phantom": {
      "extension": {
        "step1": {
          "title": "फैंटम एक्सटेंशन स्थापित करें",
          "description": "हम आपके वॉलेट के आसान उपयोग के लिए फैंटम को अपने टास्कबार में पिन करने की सलाह देते हैं।"
        },
        "step2": {
          "title": "एक वॉलेट बनाएं या आयात करें",
          "description": "सुनिश्चित करें कि आप अपने वॉलेट का बैकअप एक सुरक्षित तरीके से ले रहे हैं। अपना गुप्त वसूली वाक्यांश किसी के साथ भी साझा न करें।"
        },
        "step3": {
          "title": "अपने ब्राउज़र को ताज़ा करें",
          "description": "एक बार जब आप अपना वॉलेट सेट कर लें, तो ब्राउज़र को ताजगी देने और एक्सटेंशन को लोड करने के लिए नीचे क्लिक करें।"
        }
      }
    },
    "rabby": {
      "extension": {
        "step1": {
          "title": "Rabby एक्सटेंशन स्थापित करें",
          "description": "हम आपको सलाह देते हैं कि अपने वॉलेट की जल्दी से पहुँच के लिए Rabby को अपने टास्कबार में पिन करें।"
        },
        "step2": {
          "title": "वॉलेट बनाएं या आयात करें",
          "description": "सुनिश्चित करें कि आप अपने वॉलेट का बैकअप एक सुरक्षित तरीके से लेते हैं। कभी भी किसी के साथ अपना गुप्त वाक्यांश साझा न करें।"
        },
        "step3": {
          "title": "अपना ब्राउज़र ताज़ा करें",
          "description": "जब आप अपना वॉलेट सेट अप कर लेते हैं, तो ब्राउज़र को ताज़ा करने और एक्सटेंशन लोड करने के लिए नीचे क्लिक करें।"
        }
      }
    },
    "safeheron": {
      "extension": {
        "step1": {
          "title": "कोर एक्सटेंशन स्थापित करें",
          "description": "हम आपको सलाह देते हैं कि अपने वॉलेट की जल्दी से पहुँच के लिए Safeheron को अपने टास्कबार में पिन करें।"
        },
        "step2": {
          "title": "वॉलेट बनाएं या आयात करें",
          "description": "सुनिश्चित करें कि आप एक सुरक्षित तरीके से अपना वॉलेट बैकअप कर रहे हैं। कभी भी किसी के साथ अपने गुप्त वाक्यांश को साझा न करें।"
        },
        "step3": {
          "title": "अपने ब्राउज़र को ताज़ा करें",
          "description": "एक बार जब आप अपने वॉलेट को सेट अप करते हैं, तो नीचे क्लिक करें ताकि ब्राउज़र को ताज़ा करें और एक्सटेंशन को लोड करें।"
        }
      }
    },
    "taho": {
      "extension": {
        "step1": {
          "title": "ताहो एक्सटेंशन स्थापित करें",
          "description": "हम आपके वॉलेट तक त्वरित पहुँच के लिए ताहो को अपने टास्कबार में पिन करने की सलाह देते हैं।"
        },
        "step2": {
          "title": "एक वॉलेट बनाएँ या आयात करें",
          "description": "सुनिश्चित करें कि आप एक सुरक्षित तरीके से अपना वॉलेट बैकअप कर रहे हैं। कभी भी किसी के साथ अपने गुप्त वाक्यांश को साझा न करें।"
        },
        "step3": {
          "title": "अपने ब्राउज़र को ताज़ा करें",
          "description": "एक बार जब आप अपना बटुआ सेट कर लेते हैं, तो नीचे क्लिक करके ब्राउज़र को ताज़ा करें और एक्सटेंशन को लोड करें।"
        }
      }
    },
    "talisman": {
      "extension": {
        "step1": {
          "title": "तालिसमान एक्सटेंशन स्थापित करें",
          "description": "हम आपके बटुए के त्वरित पहुँच के लिए तालिसमान को अपने टास्कबार में पिन करने की सिफारिश करते हैं।"
        },
        "step2": {
          "title": "एक ईथेरियम बटुए बनाएं या आयात करें",
          "description": "अपने बटुए का बैकअप एक सुरक्षित तरीके से लेने का ध्यान रखें। कभी भी अपनी वसूली वाक्यांश को किसी के साथ साझा न करें।"
        },
        "step3": {
          "title": "अपने ब्राउज़र को ताज़ा करें",
          "description": "एक बार जब आप अपना बटुआ सेट कर लेते हैं, तो नीचे क्लिक करके ब्राउज़र को ताज़ा करें और एक्सटेंशन को लोड करें।"
        }
      }
    },
    "xdefi": {
      "extension": {
        "step1": {
          "title": "XDEFI वॉलेट एक्सटेंशन स्थापित करें",
          "description": "हम आपकी वॉलेट की जल्दी से पहुँच के लिए XDEFI Wallet को अपने टास्कबार में पिन करने की सलाह देते हैं।"
        },
        "step2": {
          "title": "एक वॉलेट बनाएं या आयात करें",
          "description": "निश्चित रूप से अपने वॉलेट का बैकअप किसी सुरक्षित तरीके से लें। अपनी गोपनीय वाक्यांश को किसी के साथ शेयर ना करें।"
        },
        "step3": {
          "title": "अपने ब्राउज़र को ताज़ा करें",
          "description": "एक बार जब आपने अपनी वॉलेट सेट अप कर ली हो, तो ब्राउज़र को ताज़ा करने और एक्सटेंशन को लोड करने के लिए नीचे क्लिक करें।"
        }
      }
    },
    "zeal": {
      "extension": {
        "step1": {
          "title": "Zeal एक्सटेंशन स्थापित करें",
          "description": "हम आपको अपने वॉलेट तक जल्दी पहुँचने के लिए Zeal को अपने टास्कबार में पिन करने की सलाह देते हैं।"
        },
        "step2": {
          "title": "वॉलेट बनाएं या आयात करें",
          "description": "अपने वॉलेट का बैकअप एक सुरक्षित तरीके से लेने के लिए सुनिश्चित करें। किसी के साथ भी अपना गुप्त वाक्यांश साझा न करें।"
        },
        "step3": {
          "title": "अपने ब्राउज़र को ताज़ा करें",
          "description": "एक बार जब आप अपना वॉलेट सेटअप कर लेते हैं, तो नीचे क्लिक करें ताकि ब्राउज़र को ताज़ा करें और एक्सटेंशन लोड करें।"
        }
      }
    },
    "safepal": {
      "extension": {
        "step1": {
          "title": "SafePal Wallet एक्सटेंशन स्थापित करें",
          "description": "अपने ब्राउज़र के शीर्ष दाएं में क्लिक करें और SafePal Wallet को आसानी से पहुंच के लिए पिन करें।"
        },
        "step2": {
          "title": "एक बटुआ बनाएं या आयात करें",
          "description": "नया बटुआ बनाएं या मौजूदा को आयात करें।"
        },
        "step3": {
          "title": "अपने ब्राउज़र को ताज़ा करें",
          "description": "एक बार जब आप SafePal वॉलेट सेट अप कर लेते हैं, तो नीचे क्लिक करें ताकि ब्राउज़र को रिफ्रेश करें और एक्सटेंशन लोड करें।"
        }
      },
      "qr_code": {
        "step1": {
          "title": "SafePal वॉलेट ऐप खोलें",
          "description": "अपने वॉलेट तक जल्दी पहुंचने के लिए SafePal वॉलेट को अपनी होम स्क्रीन पर रखें।"
        },
        "step2": {
          "title": "वॉलेट बनाएं या आयात करें",
          "description": "नया बटुआ बनाएं या मौजूदा को आयात करें।"
        },
        "step3": {
          "title": "सेटिंग्स में WalletConnect को टैप करें",
          "description": "नया कनेक्शन चुनें, फिर QR कोड स्कैन करें और कनेक्ट करने के लिए प्रॉम्प्ट की पुष्टि करें।"
        }
      }
    },
    "desig": {
      "extension": {
        "step1": {
          "title": "Desig एक्सटेंशन स्थापित करें",
          "description": "हम आपको अपने वॉलेट के लिए आसानी से पहुंच पाने के लिए Desig को अपने टास्कबार में पिन करने की सलाह देते हैं।"
        },
        "step2": {
          "title": "एक वॉलेट बनाएँ",
          "description": "अपने वॉलेट का बैकअप एक सुरक्षित तरीके से लेने के लिए सुनिश्चित करें। किसी के साथ भी अपना गुप्त वाक्यांश साझा न करें।"
        },
        "step3": {
          "title": "अपने ब्राउज़र को ताज़ा करें",
          "description": "एक बार जब आप अपना वॉलेट सेटअप कर लेते हैं, तो नीचे क्लिक करें ताकि ब्राउज़र को ताज़ा करें और एक्सटेंशन लोड करें।"
        }
      }
    },
    "subwallet": {
      "extension": {
        "step1": {
          "title": "SubWallet एक्सटेंशन स्थापित करें",
          "description": "हम आपको अपने वॉलेट तक तेजी से पहुंचने के लिए SubWallet को अपने टास्कबार में पिन करने की सलाह देते हैं।"
        },
        "step2": {
          "title": "वॉलेट बनाएं या आयात करें",
          "description": "अपने बटुए का बैकअप एक सुरक्षित तरीके से लेने का ध्यान रखें। कभी भी अपनी वसूली वाक्यांश को किसी के साथ साझा न करें।"
        },
        "step3": {
          "title": "अपने ब्राउज़र को ताज़ा करें",
          "description": "एक बार जब आप अपना वॉलेट सेटअप कर लेते हैं, तो नीचे क्लिक करें ताकि ब्राउज़र को ताज़ा करें और एक्सटेंशन लोड करें।"
        }
      },
      "qr_code": {
        "step1": {
          "title": "SubWallet ऐप खोलें",
          "description": "हम आपको तेजी से पहुंचने के लिए SubWallet को अपने होम स्क्रीन पर रखने की सलाह देते हैं।"
        },
        "step2": {
          "title": "वॉलेट बनाएं या आयात करें",
          "description": "अपने वॉलेट का बैकअप एक सुरक्षित तरीके से लेने के लिए सुनिश्चित करें। किसी के साथ भी अपना गुप्त वाक्यांश साझा न करें।"
        },
        "step3": {
          "title": "स्कैन बटन को टैप करें",
          "description": "जैसे ही आप स्कैन करेंगे, एक कनेक्शन संकेत आपके वॉलेट को कनेक्ट करने के लिए प्रकट होगा।"
        }
      }
    },
    "clv": {
      "extension": {
        "step1": {
          "title": "CLV Wallet एक्सटेंशन स्थापित करें",
          "description": "हम आपको अपने वॉलेट तक तेजी से पहुंचने के लिए CLV Wallet को अपने टास्कबार में पिन करने की सलाह देते हैं।"
        },
        "step2": {
          "title": "वॉलेट बनाएं या आयात करें",
          "description": "अपने वॉलेट का बैकअप एक सुरक्षित तरीके से लेने के लिए सुनिश्चित करें। किसी के साथ भी अपना गुप्त वाक्यांश साझा न करें।"
        },
        "step3": {
          "title": "अपने ब्राउज़र को ताज़ा करें",
          "description": "एक बार जब आप अपना वॉलेट सेटअप कर लेते हैं, तो नीचे क्लिक करें ताकि ब्राउज़र को ताज़ा करें और एक्सटेंशन लोड करें।"
        }
      },
      "qr_code": {
        "step1": {
          "title": "CLV वॉलेट ऐप खोलें",
          "description": "हम तीव्र पहुंच के लिए आपके होम स्क्रीन पर CLV वॉलेट रखने की सलाह देते हैं।"
        },
        "step2": {
          "title": "वॉलेट बनाएं या आयात करें",
          "description": "अपने वॉलेट का बैकअप एक सुरक्षित तरीके से लेने के लिए सुनिश्चित करें। किसी के साथ भी अपना गुप्त वाक्यांश साझा न करें।"
        },
        "step3": {
          "title": "स्कैन बटन को टैप करें",
          "description": "जैसे ही आप स्कैन करेंगे, एक कनेक्शन संकेत आपके वॉलेट को कनेक्ट करने के लिए प्रकट होगा।"
        }
      }
    },
    "okto": {
      "qr_code": {
        "step1": {
          "title": "Okto ऐप को खोलें",
          "description": "त्वरित पहुंच के लिए अपने होम स्क्रीन पर Okto जोड़ें"
        },
        "step2": {
          "title": "एक MPC वॉलेट बनाएं",
          "description": "एक खाता बनाएं और वॉलेट उत्पन्न करें"
        },
        "step3": {
          "title": "सेटिंग्स में WalletConnect को टैप करें",
          "description": "ऊपरी दाएँ में स्कैन QR आइकन को टैप करें और कनेक्ट करने के लिए संकेत दें।"
        }
      }
    },
    "ledger": {
      "desktop": {
        "step1": {
          "title": "लेजर लाइव ऐप खोलें",
          "description": "हम तेज एक्सेस के लिए अपने होम स्क्रीन पर Ledger Live डालने की सिफारिश करते हैं।"
        },
        "step2": {
          "title": "अपना लेजर सेट करें",
          "description": "एक नया लेजर सेट अप करें या मौजूदा वाले से कनेक्ट करें।"
        },
        "step3": {
          "title": "कनेक्ट करें",
          "description": "स्कैन करने के बाद, आपके वॉलेट को कनेक्ट करने के लिए एक कनेक्शन प्रॉम्प्ट दिखाई देगा।"
        }
      },
      "qr_code": {
        "step1": {
          "title": "लेजर लाइव ऐप खोलें",
          "description": "हम तेज एक्सेस के लिए अपने होम स्क्रीन पर Ledger Live डालने की सिफारिश करते हैं।"
        },
        "step2": {
          "title": "अपना लेजर सेट करें",
          "description": "आप डेस्कटॉप ऐप के साथ सिंक कर सकते हैं या अपने Ledger को कनेक्ट कर सकते हैं।"
        },
        "step3": {
          "title": "कोड स्कैन करें",
          "description": "WalletConnect पर टैप करें फिर स्कैनर पर स्विच करें। जब आप स्कैन करेंगे, तो आपके वॉलेट को कनेक्ट करने के लिए एक कनेक्शन संकेत प्रकट होगा।"
        }
      }
    }
  }
}
`;const qE=Object.freeze(Object.defineProperty({__proto__:null,default:_E},Symbol.toStringTag,{value:"Module"}));var KE=`{
  "connect_wallet": {
    "label": "Hubungkan Dompet"
  },
  "intro": {
    "title": "Apa itu Dompet?",
    "description": "Sebuah dompet digunakan untuk mengirim, menerima, menyimpan, dan menampilkan aset digital. Ini juga cara baru untuk masuk, tanpa perlu membuat akun dan kata sandi baru di setiap situs web.",
    "digital_asset": {
      "title": "Sebuah Rumah untuk Aset Digital Anda",
      "description": "Dompet digunakan untuk mengirim, menerima, menyimpan, dan menampilkan aset digital seperti Ethereum dan NFTs."
    },
    "login": {
      "title": "Cara Baru untuk Masuk",
      "description": "Alih-alih membuat akun dan kata sandi baru di setiap situs web, cukup hubungkan dompet Anda."
    },
    "get": {
      "label": "Dapatkan Dompet"
    },
    "learn_more": {
      "label": "Pelajari lebih lanjut"
    }
  },
  "sign_in": {
    "label": "Verifikasi akun Anda",
    "description": "Untuk menyelesaikan koneksi, Anda harus menandatangani sebuah pesan di dompet Anda untuk memastikan bahwa Anda adalah pemilik dari akun ini.",
    "message": {
      "send": "Kirim pesan",
      "preparing": "Mempersiapkan pesan...",
      "cancel": "Batal",
      "preparing_error": "Kesalahan dalam mempersiapkan pesan, silakan coba lagi!"
    },
    "signature": {
      "waiting": "Menunggu tanda tangan...",
      "verifying": "Memverifikasi tanda tangan...",
      "signing_error": "Kesalahan dalam menandatangani pesan, silakan coba lagi!",
      "verifying_error": "Kesalahan dalam memverifikasi tanda tangan, silakan coba lagi!",
      "oops_error": "Ups, ada yang salah!"
    }
  },
  "connect": {
    "label": "Hubungkan",
    "title": "Hubungkan Dompet",
    "new_to_ethereum": {
      "description": "Baru dalam dompet Ethereum?",
      "learn_more": {
        "label": "Pelajari lebih lanjut"
      }
    },
    "learn_more": {
      "label": "Pelajari lebih lanjut"
    },
    "recent": "Terkini",
    "status": {
      "opening": "Membuka %{wallet}...",
      "connecting": "Menghubungkan",
      "connect_mobile": "Lanjutkan di %{wallet}",
      "not_installed": "%{wallet} tidak terpasang",
      "not_available": "%{wallet} tidak tersedia",
      "confirm": "Konfirmasikan koneksi di ekstensi",
      "confirm_mobile": "Terima permintaan koneksi di dompet"
    },
    "secondary_action": {
      "get": {
        "description": "Tidak memiliki %{wallet}?",
        "label": "DAPATKAN"
      },
      "install": {
        "label": "PASANG"
      },
      "retry": {
        "label": "COBA LAGI"
      }
    },
    "walletconnect": {
      "description": {
        "full": "Perlu modal resmi WalletConnect?",
        "compact": "Perlu modal WalletConnect?"
      },
      "open": {
        "label": "BUKA"
      }
    }
  },
  "connect_scan": {
    "title": "Pindai dengan %{wallet}",
    "fallback_title": "Pindai dengan ponsel Anda"
  },
  "connector_group": {
    "recommended": "Direkomendasikan",
    "other": "Lainnya",
    "popular": "Populer",
    "more": "Lebih Banyak",
    "others": "Lainnya"
  },
  "get": {
    "title": "Dapatkan Dompet",
    "action": {
      "label": "DAPATKAN"
    },
    "mobile": {
      "description": "Dompet Mobile"
    },
    "extension": {
      "description": "Ekstensi Browser"
    },
    "mobile_and_extension": {
      "description": "Dompet Mobile dan Ekstensi"
    },
    "mobile_and_desktop": {
      "description": "Dompet Seluler dan Desktop"
    },
    "looking_for": {
      "title": "Bukan yang Anda cari?",
      "mobile": {
        "description": "Pilih dompet di layar utama untuk memulai dengan penyedia dompet yang berbeda."
      },
      "desktop": {
        "compact_description": "Pilih dompet di layar utama untuk memulai dengan penyedia dompet yang berbeda.",
        "wide_description": "Pilih dompet di sebelah kiri untuk memulai dengan penyedia dompet yang berbeda."
      }
    }
  },
  "get_options": {
    "title": "Mulai dengan %{wallet}",
    "short_title": "Dapatkan %{wallet}",
    "mobile": {
      "title": "%{wallet} untuk Mobile",
      "description": "Gunakan dompet mobile untuk menjelajahi dunia Ethereum.",
      "download": {
        "label": "Dapatkan aplikasinya"
      }
    },
    "extension": {
      "title": "%{wallet} untuk %{browser}",
      "description": "Akses dompet Anda langsung dari browser web favorit Anda.",
      "download": {
        "label": "Tambahkan ke %{browser}"
      }
    },
    "desktop": {
      "title": "%{wallet} untuk %{platform}",
      "description": "Akses dompet Anda secara native dari desktop yang kuat Anda.",
      "download": {
        "label": "Tambahkan ke %{platform}"
      }
    }
  },
  "get_mobile": {
    "title": "Instal %{wallet}",
    "description": "Pindai dengan ponsel Anda untuk mengunduh di iOS atau Android",
    "continue": {
      "label": "Lanjutkan"
    }
  },
  "get_instructions": {
    "mobile": {
      "connect": {
        "label": "Hubungkan"
      },
      "learn_more": {
        "label": "Pelajari lebih lanjut"
      }
    },
    "extension": {
      "refresh": {
        "label": "Segarkan"
      },
      "learn_more": {
        "label": "Pelajari lebih lanjut"
      }
    },
    "desktop": {
      "connect": {
        "label": "Hubungkan"
      },
      "learn_more": {
        "label": "Pelajari lebih lanjut"
      }
    }
  },
  "chains": {
    "title": "Alihkan Jaringan",
    "wrong_network": "Jaringan yang salah terdeteksi, alihkan atau diskonek untuk melanjutkan.",
    "confirm": "Konfirmasi di Dompet",
    "switching_not_supported": "Dompet Anda tidak mendukung pengalihan jaringan dari %{appName}. Coba alihkan jaringan dari dalam dompet Anda.",
    "switching_not_supported_fallback": "Wallet Anda tidak mendukung penggantian jaringan dari aplikasi ini. Cobalah ganti jaringan dari dalam wallet Anda.",
    "disconnect": "Putuskan koneksi",
    "connected": "Terkoneksi"
  },
  "profile": {
    "disconnect": {
      "label": "Putuskan koneksi"
    },
    "copy_address": {
      "label": "Salin Alamat",
      "copied": "Tersalin!"
    },
    "explorer": {
      "label": "Lihat lebih banyak di penjelajah"
    },
    "transactions": {
      "description": "%{appName} transaksi akan muncul di sini...",
      "description_fallback": "Transaksi Anda akan muncul di sini...",
      "recent": {
        "title": "Transaksi Terbaru"
      },
      "clear": {
        "label": "Hapus Semua"
      }
    }
  },
  "wallet_connectors": {
    "argent": {
      "qr_code": {
        "step1": {
          "description": "Letakkan Argent di layar utama Anda untuk akses lebih cepat ke dompet Anda.",
          "title": "Buka aplikasi Argent"
        },
        "step2": {
          "description": "Buat dompet dan nama pengguna, atau impor dompet yang ada.",
          "title": "Buat atau Impor Dompet"
        },
        "step3": {
          "description": "Setelah Anda memindai, akan muncul petunjuk koneksi untuk Anda menghubungkan dompet Anda.",
          "title": "Tekan tombol Scan QR"
        }
      }
    },
    "bifrost": {
      "qr_code": {
        "step1": {
          "description": "Kami merekomendasikan untuk menempatkan Bifrost Wallet di layar utama anda untuk akses yang lebih cepat.",
          "title": "Buka aplikasi Bifrost Wallet"
        },
        "step2": {
          "description": "Buat atau impor sebuah dompet menggunakan frasa pemulihan Anda.",
          "title": "Buat atau Impor sebuah Wallet"
        },
        "step3": {
          "description": "Setelah Anda memindai, sebuah pesan akan muncul untuk menghubungkan dompet Anda.",
          "title": "Tekan tombol scan"
        }
      }
    },
    "bitget": {
      "qr_code": {
        "step1": {
          "description": "Kami menyarankan untuk meletakkan Bitget Wallet di layar depan Anda untuk akses yang lebih cepat.",
          "title": "Buka aplikasi Bitget Wallet"
        },
        "step2": {
          "description": "Pastikan untuk mencadangkan wallet Anda menggunakan metode yang aman. Jangan pernah berbagi frasa rahasia Anda dengan siapa pun.",
          "title": "Buat atau Impor Wallet"
        },
        "step3": {
          "description": "Setelah Anda pindai, akan muncul petunjuk untuk menghubungkan wallet Anda.",
          "title": "Tekan tombol pindai"
        }
      },
      "extension": {
        "step1": {
          "description": "Kami menyarankan untuk memasang Bitget Wallet ke taskbar Anda untuk akses yang lebih cepat ke wallet Anda.",
          "title": "Instal ekstensi Dompet Bitget"
        },
        "step2": {
          "description": "Pastikan untuk mencadangkan dompet Anda menggunakan metode yang aman. Jangan pernah membagikan frasa rahasia Anda kepada siapa pun.",
          "title": "Buat atau Impor Dompet"
        },
        "step3": {
          "description": "Setelah Anda menyiapkan dompet Anda, klik di bawah ini untuk menyegarkan browser dan memuat ekstensi.",
          "title": "Segarkan browser Anda"
        }
      }
    },
    "bitski": {
      "extension": {
        "step1": {
          "description": "Kami merekomendasikan untuk memasang Bitski ke taskbar Anda untuk akses dompet Anda yang lebih cepat.",
          "title": "Pasang ekstensi Bitski"
        },
        "step2": {
          "description": "Pastikan untuk mencadangkan dompet Anda menggunakan metode yang aman. Jangan pernah berbagi frasa rahasia Anda dengan siapa pun.",
          "title": "Buat atau Impor Dompet"
        },
        "step3": {
          "description": "Setelah Anda menyiapkan dompet Anda, klik di bawah ini untuk menyegarkan browser dan memuat ekstensi.",
          "title": "Segarkan browser Anda"
        }
      }
    },
    "coin98": {
      "qr_code": {
        "step1": {
          "description": "Kami merekomendasikan untuk menaruh Coin98 Wallet di layar utama Anda untuk akses wallet Anda lebih cepat.",
          "title": "Buka aplikasi Coin98 Wallet"
        },
        "step2": {
          "description": "Anda dapat dengan mudah mencadangkan wallet Anda menggunakan fitur cadangan kami di telepon Anda.",
          "title": "Buat atau Impor Wallet"
        },
        "step3": {
          "description": "Setelah Anda melakukan pemindaian, akan muncul prompt koneksi untuk Anda menghubungkan wallet Anda.",
          "title": "Ketuk tombol WalletConnect"
        }
      },
      "extension": {
        "step1": {
          "description": "Klik di pojok kanan atas browser Anda dan sematkan Coin98 Wallet untuk akses mudah.",
          "title": "Pasang ekstensi Coin98 Wallet"
        },
        "step2": {
          "description": "Buat dompet baru atau impor yang sudah ada.",
          "title": "Buat atau Impor sebuah dompet"
        },
        "step3": {
          "description": "Setelah Anda menyiapkan Coin98 Wallet, klik di bawah ini untuk menyegarkan browser dan memuat ekstensi.",
          "title": "Segarkan browser Anda"
        }
      }
    },
    "coinbase": {
      "qr_code": {
        "step1": {
          "description": "Kami merekomendasikan memasang Coinbase Wallet di layar utama Anda untuk akses yang lebih cepat.",
          "title": "Buka aplikasi Coinbase Wallet"
        },
        "step2": {
          "description": "Anda dapat dengan mudah mencadangkan dompet Anda menggunakan fitur cadangan awan.",
          "title": "Buat atau Impor sebuah Dompet"
        },
        "step3": {
          "description": "Setelah Anda memindai, akan muncul sebuah petunjuk koneksi untuk Anda menyambungkan dompet Anda.",
          "title": "Ketuk tombol pindai"
        }
      },
      "extension": {
        "step1": {
          "description": "Kami merekomendasikan untuk menempel Coinbase Wallet ke taskbar Anda untuk akses lebih cepat ke dompet Anda.",
          "title": "Instal ekstensi Coinbase Wallet"
        },
        "step2": {
          "description": "Pastikan untuk mencadangkan dompet Anda menggunakan metode yang aman. Jangan pernah membagikan frase pemulihan rahasia Anda kepada siapa pun.",
          "title": "Buat atau Import Wallet"
        },
        "step3": {
          "description": "Setelah Anda menyiapkan wallet Anda, klik di bawah ini untuk menyegarkan browser dan memuat ekstensi.",
          "title": "Segarkan browser Anda"
        }
      }
    },
    "core": {
      "qr_code": {
        "step1": {
          "description": "Kami merekomendasikan untuk meletakkan Core di layar utama Anda untuk akses lebih cepat ke wallet Anda.",
          "title": "Buka aplikasi Core"
        },
        "step2": {
          "description": "Anda dapat dengan mudah mencadangkan wallet Anda dengan menggunakan fitur cadangan kami di telepon Anda.",
          "title": "Buat atau Import Wallet"
        },
        "step3": {
          "description": "Setelah Anda memindai, akan muncul petunjuk koneksi untuk Anda menyambungkan wallet Anda.",
          "title": "Ketuk tombol WalletConnect"
        }
      },
      "extension": {
        "step1": {
          "description": "Kami merekomendasikan untuk menempelkan Core pada taskbar Anda untuk akses ke dompet Anda lebih cepat.",
          "title": "Pasang ekstensi Core"
        },
        "step2": {
          "description": "Pastikan untuk mencadangkan dompet Anda menggunakan metode yang aman. Jangan pernah membagikan frase rahasia Anda kepada siapa pun.",
          "title": "Buat atau Impor Dompet"
        },
        "step3": {
          "description": "Setelah Anda menyiapkan dompet Anda, klik di bawah ini untuk menyegarkan browser dan memuat ekstensi.",
          "title": "Segarkan browser Anda"
        }
      }
    },
    "fox": {
      "qr_code": {
        "step1": {
          "description": "Kami merekomendasikan untuk menaruh FoxWallet pada layar utama Anda untuk akses lebih cepat.",
          "title": "Buka aplikasi FoxWallet"
        },
        "step2": {
          "description": "Pastikan untuk mencadangkan dompet Anda menggunakan metode yang aman. Jangan pernah membagikan frase rahasia Anda kepada siapa pun.",
          "title": "Buat atau Impor Wallet"
        },
        "step3": {
          "description": "Setelah Anda memindai, prompt koneksi akan muncul untuk Anda hubungkan dompet Anda.",
          "title": "Ketuk tombol pindai"
        }
      }
    },
    "frontier": {
      "qr_code": {
        "step1": {
          "description": "Kami merekomendasikan untuk meletakkan Frontier Wallet di layar awal Anda untuk akses yang lebih cepat.",
          "title": "Buka aplikasi Frontier Wallet"
        },
        "step2": {
          "description": "Pastikan untuk mencadangkan dompet Anda menggunakan metode yang aman. Jangan pernah membagikan frase rahasia Anda kepada siapa pun.",
          "title": "Buat atau Impor Wallet"
        },
        "step3": {
          "description": "Setelah Anda memindai, prompt koneksi akan muncul untuk Anda menghubungkan dompet Anda.",
          "title": "Ketuk tombol pindai"
        }
      },
      "extension": {
        "step1": {
          "description": "Kami menyarankan menempelkan Frontier Wallet ke taskbar Anda untuk akses yang lebih cepat ke dompet Anda.",
          "title": "Instal ekstensi Frontier Wallet"
        },
        "step2": {
          "description": "Pastikan untuk mencadangkan dompet Anda menggunakan metode yang aman. Jangan pernah berbagi frasa rahasia Anda dengan siapa pun.",
          "title": "Buat atau Impor Dompet"
        },
        "step3": {
          "description": "Setelah Anda menyiapkan dompet Anda, klik di bawah ini untuk menyegarkan browser dan memuat ekstensi.",
          "title": "Segarkan browser Anda"
        }
      }
    },
    "im_token": {
      "qr_code": {
        "step1": {
          "title": "Buka aplikasi imToken",
          "description": "Letakkan aplikasi imToken di layar utama Anda untuk akses yang lebih cepat ke dompet Anda."
        },
        "step2": {
          "title": "Buat atau Impor Dompet",
          "description": "Buat dompet baru atau impor yang sudah ada."
        },
        "step3": {
          "title": "Ketuk Ikon Scanner di pojok kanan atas",
          "description": "Pilih Koneksi Baru, lalu pindai kode QR dan konfirmasi petunjuk untuk terhubung."
        }
      }
    },
    "metamask": {
      "qr_code": {
        "step1": {
          "title": "Buka aplikasi MetaMask",
          "description": "Kami merekomendasikan untuk meletakkan MetaMask di layar beranda Anda untuk akses yang lebih cepat."
        },
        "step2": {
          "title": "Buat atau Impor Dompet",
          "description": "Pastikan untuk mencadangkan dompet Anda menggunakan metode yang aman. Jangan pernah membagikan frase rahasia Anda kepada siapa pun."
        },
        "step3": {
          "title": "Ketuk tombol pindai",
          "description": "Setelah Anda memindai, petunjuk koneksi akan muncul untuk Anda menyambungkan dompet Anda."
        }
      },
      "extension": {
        "step1": {
          "title": "Pasang ekstensi MetaMask",
          "description": "Kami menyarankan untuk memasang MetaMask pada taskbar Anda untuk akses wallet lebih cepat."
        },
        "step2": {
          "title": "Buat atau Impor Wallet",
          "description": "Pastikan untuk mencadangkan wallet Anda menggunakan metode yang aman. Jangan pernah membagikan frase rahasia Anda kepada siapa pun."
        },
        "step3": {
          "title": "Segarkan browser Anda",
          "description": "Setelah Anda menyiapkan wallet Anda, klik di bawah ini untuk menyegarkan browser dan memuat ekstensi."
        }
      }
    },
    "okx": {
      "qr_code": {
        "step1": {
          "title": "Buka aplikasi OKX Wallet",
          "description": "Kami menyarankan untuk menaruh OKX Wallet di layar utama Anda untuk akses lebih cepat."
        },
        "step2": {
          "title": "Buat atau Impor Wallet",
          "description": "Pastikan untuk mencadangkan dompet Anda menggunakan metode yang aman. Jangan pernah membagikan frasa rahasia Anda kepada siapa pun."
        },
        "step3": {
          "title": "Ketuk tombol scan",
          "description": "Setelah Anda memindai, prompt koneksi akan muncul untuk Anda hubungkan dompet Anda."
        }
      },
      "extension": {
        "step1": {
          "title": "Instal ekstensi OKX Wallet",
          "description": "Kami menyarankan untuk menempelkan OKX Wallet ke taskbar Anda untuk akses lebih cepat ke dompet Anda."
        },
        "step2": {
          "title": "Buat atau Impor Dompet",
          "description": "Pastikan untuk mencadangkan dompet Anda menggunakan metode yang aman. Jangan pernah membagikan frasa rahasia Anda kepada siapa pun."
        },
        "step3": {
          "title": "Segarkan browser Anda",
          "description": "Setelah Anda mengatur wallet Anda, klik di bawah ini untuk menyegarkan browser dan memuat ekstensi."
        }
      }
    },
    "omni": {
      "qr_code": {
        "step1": {
          "title": "Buka aplikasi Omni",
          "description": "Tambahkan Omni ke layar utama Anda untuk akses yang lebih cepat ke wallet Anda."
        },
        "step2": {
          "title": "Buat atau Impor Wallet",
          "description": "Buat wallet baru atau impor yang sudah ada."
        },
        "step3": {
          "title": "Ketuk ikon QR dan scan",
          "description": "Ketuk ikon QR di layar utama Anda, pindai kode dan konfirmasi petunjuk untuk terhubung."
        }
      }
    },
    "token_pocket": {
      "qr_code": {
        "step1": {
          "title": "Buka aplikasi TokenPocket",
          "description": "Kami sarankan meletakkan TokenPocket di layar utama Anda untuk akses yang lebih cepat."
        },
        "step2": {
          "title": "Buat atau impor Dompet",
          "description": "Pastikan untuk mencadangkan dompet Anda menggunakan metode yang aman. Jangan pernah membagikan frase pemulihan rahasia Anda kepada siapa pun."
        },
        "step3": {
          "title": "Ketuk tombol pindai",
          "description": "Setelah Anda memindai, Indikasi sambungan akan muncul untuk Anda menghubungkan dompet Anda."
        }
      },
      "extension": {
        "step1": {
          "title": "Instal ekstensi TokenPocket",
          "description": "Kami merekomendasikan penambatan TokenPocket ke taskbar Anda untuk akses dompet Anda lebih cepat."
        },
        "step2": {
          "title": "Buat atau Impor Wallet",
          "description": "Pastikan untuk mencadangkan dompet Anda menggunakan metode yang aman. Jangan pernah membagi frasa rahasia Anda dengan siapa pun."
        },
        "step3": {
          "title": "Segarkan browser Anda",
          "description": "Setelah Anda mengatur dompet Anda, klik di bawah ini untuk menyegarkan browser dan memuat ekstensi."
        }
      }
    },
    "trust": {
      "qr_code": {
        "step1": {
          "title": "Buka aplikasi Trust Wallet",
          "description": "Pasang Trust Wallet di layar utama Anda untuk akses dompet Anda lebih cepat."
        },
        "step2": {
          "title": "Buat atau Impor Wallet",
          "description": "Buat dompet baru atau impor yang sudah ada."
        },
        "step3": {
          "title": "Ketuk WalletConnect di Pengaturan",
          "description": "Pilih Koneksi Baru, kemudian pindai kode QR dan konfirmasi perintah untuk terhubung."
        }
      },
      "extension": {
        "step1": {
          "title": "Instal ekstensi Trust Wallet",
          "description": "Klik di pojok kanan atas browser Anda dan sematkan Trust Wallet untuk akses mudah."
        },
        "step2": {
          "title": "Buat atau Impor dompet",
          "description": "Buat dompet baru atau impor yang sudah ada."
        },
        "step3": {
          "title": "Segarkan browser Anda",
          "description": "Setelah Anda mengatur Trust Wallet, klik di bawah untuk menyegarkan browser dan memuat ekstensi."
        }
      }
    },
    "uniswap": {
      "qr_code": {
        "step1": {
          "title": "Buka aplikasi Uniswap",
          "description": "Tambahkan Uniswap Wallet ke layar utama Anda untuk akses ke wallet Anda lebih cepat."
        },
        "step2": {
          "title": "Buat atau Impor Wallet",
          "description": "Buat wallet baru atau impor yang sudah ada."
        },
        "step3": {
          "title": "Ketuk ikon QR dan pindai",
          "description": "Ketuk ikon QR di layar utama Anda, pindai kode dan konfirmasi prompt untuk terhubung."
        }
      }
    },
    "zerion": {
      "qr_code": {
        "step1": {
          "title": "Buka aplikasi Zerion",
          "description": "Kami merekomendasikan untuk meletakkan Zerion di layar utama Anda untuk akses lebih cepat."
        },
        "step2": {
          "title": "Buat atau Impor Dompet",
          "description": "Pastikan untuk mencadangkan dompet Anda menggunakan metode yang aman. Jangan pernah membagikan frase pemulihan rahasia Anda kepada siapa pun."
        },
        "step3": {
          "title": "Ketuk tombol scan",
          "description": "Setelah Anda scan, muncul prompt koneksi untuk Anda menghubungkan dompet Anda."
        }
      },
      "extension": {
        "step1": {
          "title": "Instal ekstensi Zerion",
          "description": "Kami menyarankan untuk menempelkan Zerion ke taskbar Anda untuk akses lebih cepat ke dompet Anda."
        },
        "step2": {
          "title": "Buat atau Impor Wallet",
          "description": "Pastikan untuk mencadangkan wallet Anda menggunakan metode yang aman. Jangan pernah berbagi frasa rahasia Anda dengan siapa pun."
        },
        "step3": {
          "title": "Segarkan browser Anda",
          "description": "Setelah Anda mengatur wallet Anda, klik di bawah untuk menyegarkan browser dan memuat ekstensi."
        }
      }
    },
    "rainbow": {
      "qr_code": {
        "step1": {
          "title": "Buka aplikasi Rainbow",
          "description": "Kami menyarankan menempatkan Rainbow di layar home Anda untuk akses yang lebih cepat ke wallet Anda."
        },
        "step2": {
          "title": "Buat atau Impor Wallet",
          "description": "Anda dapat dengan mudah mencadangkan wallet Anda menggunakan fitur cadangan kami di telepon Anda."
        },
        "step3": {
          "title": "Tekan tombol scan",
          "description": "Setelah Anda memindai, akan muncul pesan untuk menghubungkan dompet Anda."
        }
      }
    },
    "enkrypt": {
      "extension": {
        "step1": {
          "description": "Kami menyarankan untuk memasang Enkrypt Wallet ke taskbar Anda untuk akses dompet yang lebih cepat.",
          "title": "Instal ekstensi Enkrypt Wallet"
        },
        "step2": {
          "description": "Pastikan untuk mencadangkan dompet Anda menggunakan metode yang aman. Jangan pernah berbagi frase rahasia Anda dengan siapa pun.",
          "title": "Buat atau Impor Dompet"
        },
        "step3": {
          "description": "Setelah Anda menyiapkan dompet, klik di bawah ini untuk memuat ulang peramban dan meload ekstensi.",
          "title": "Segarkan browser Anda"
        }
      }
    },
    "frame": {
      "extension": {
        "step1": {
          "description": "Kami menyarankan untuk memasang Frame ke taskbar Anda untuk akses dompet yang lebih cepat.",
          "title": "Instal Frame & ekstensi pendamping"
        },
        "step2": {
          "description": "Pastikan untuk mencadangkan wallet Anda menggunakan metode yang aman. Jangan pernah membagikan frase rahasia Anda kepada siapa pun.",
          "title": "Buat atau Impor Wallet"
        },
        "step3": {
          "description": "Setelah Anda menyetel wallet Anda, klik di bawah ini untuk menyegarkan browser dan memuat ekstensi.",
          "title": "Segarkan browser Anda"
        }
      }
    },
    "one_key": {
      "extension": {
        "step1": {
          "title": "Instal ekstensi OneKey Wallet",
          "description": "Kami menyarankan untuk menempelkan OneKey Wallet ke taskbar Anda untuk akses wallet yang lebih cepat."
        },
        "step2": {
          "title": "Buat atau Impor Wallet",
          "description": "Pastikan untuk mencadangkan dompet Anda menggunakan metode yang aman. Jangan pernah membagikan frase rahasia Anda kepada siapa pun."
        },
        "step3": {
          "title": "Segarkan browser Anda",
          "description": "Setelah Anda menyiapkan dompet Anda, klik di bawah ini untuk menyegarkan browser dan memuat ekstensi."
        }
      }
    },
    "phantom": {
      "extension": {
        "step1": {
          "title": "Instal ekstensi Phantom",
          "description": "Kami menyarankan untuk mem-pin Phantom ke taskbar Anda untuk akses dompet yang lebih mudah."
        },
        "step2": {
          "title": "Buat atau Impor Dompet",
          "description": "Pastikan untuk mencadangkan dompet Anda menggunakan metode yang aman. Jangan pernah membagikan frase pemulihan rahasia Anda kepada siapa pun."
        },
        "step3": {
          "title": "Segarkan browser Anda",
          "description": "Setelah Anda menyiapkan dompet Anda, klik di bawah ini untuk menyegarkan browser dan memuat ekstensi."
        }
      }
    },
    "rabby": {
      "extension": {
        "step1": {
          "title": "Instal ekstensi Rabby",
          "description": "Kami merekomendasikan menempelkan Rabby ke taskbar Anda untuk akses lebih cepat ke wallet Anda."
        },
        "step2": {
          "title": "Buat atau Impor Wallet",
          "description": "Pastikan untuk mencadangkan wallet Anda dengan metode yang aman. Jangan pernah berbagi frase rahasia Anda dengan siapa pun."
        },
        "step3": {
          "title": "Segarkan browser Anda",
          "description": "Setelah Anda menyiapkan wallet Anda, klik di bawah ini untuk menyegarkan browser dan memuat ekstensi."
        }
      }
    },
    "safeheron": {
      "extension": {
        "step1": {
          "title": "Instal ekstensi Core",
          "description": "Kami merekomendasikan menempelkan Safeheron ke taskbar Anda untuk akses lebih cepat ke wallet Anda."
        },
        "step2": {
          "title": "Buat atau Impor Wallet",
          "description": "Pastikan untuk mencadangkan dompet Anda dengan metode yang aman. Jangan pernah berbagi frasa rahasia Anda dengan siapa pun."
        },
        "step3": {
          "title": "Segarkan browser Anda",
          "description": "Setelah Anda mengatur dompet Anda, klik di bawah untuk menyegarkan browser dan memuat ekstensi."
        }
      }
    },
    "taho": {
      "extension": {
        "step1": {
          "title": "Instal ekstensi Taho",
          "description": "Kami merekomendasikan pengepinan Taho ke taskbar Anda untuk akses yang lebih cepat ke dompet Anda."
        },
        "step2": {
          "title": "Buat atau Impor Dompet",
          "description": "Pastikan untuk mencadangkan dompet Anda dengan metode yang aman. Jangan pernah berbagi frasa rahasia Anda dengan siapa pun."
        },
        "step3": {
          "title": "Segarkan browser Anda",
          "description": "Setelah Anda menyiapkan dompet Anda, klik di bawah ini untuk menyegarkan browser dan memuat ekstensi."
        }
      }
    },
    "talisman": {
      "extension": {
        "step1": {
          "title": "Instal ekstensi Talisman",
          "description": "Kami merekomendasikan menempelkan Talisman ke taskbar Anda untuk akses dompet Anda lebih cepat."
        },
        "step2": {
          "title": "Buat atau Impor Dompet Ethereum",
          "description": "Pastikan untuk mencadangkan dompet Anda menggunakan metode yang aman. Jangan pernah berbagi frase pemulihan Anda dengan siapa pun."
        },
        "step3": {
          "title": "Segarkan browser Anda",
          "description": "Setelah Anda menyiapkan dompet Anda, klik di bawah ini untuk menyegarkan browser dan memuat ekstensi."
        }
      }
    },
    "xdefi": {
      "extension": {
        "step1": {
          "title": "Instal ekstensi Dompet XDEFI",
          "description": "Kami merekomendasikan menempelkan XDEFI Wallet ke taskbar Anda untuk akses lebih cepat ke dompet Anda."
        },
        "step2": {
          "title": "Buat atau Impor Dompet",
          "description": "Pastikan untuk mencadangkan dompet Anda dengan metode yang aman. Jangan pernah berbagi frase rahasia Anda dengan siapa pun."
        },
        "step3": {
          "title": "Segarkan browser Anda",
          "description": "Setelah Anda menyiapkan dompet Anda, klik di bawah ini untuk menyegarkan browser dan memuat ekstensi."
        }
      }
    },
    "zeal": {
      "extension": {
        "step1": {
          "title": "Instal ekstensi Zeal",
          "description": "Kami merekomendasikan untuk mem-pin Zeal ke taskbar Anda untuk akses wallet lebih cepat."
        },
        "step2": {
          "title": "Buat atau Impor Dompet",
          "description": "Pastikan untuk mencadangkan wallet Anda menggunakan metode yang aman. Jangan pernah berbagi frasa rahasia Anda dengan siapa pun."
        },
        "step3": {
          "title": "Segarkan browser Anda",
          "description": "Setelah Anda menyiapkan dompet Anda, klik di bawah ini untuk menyegarkan browser dan memuat ekstensi."
        }
      }
    },
    "safepal": {
      "extension": {
        "step1": {
          "title": "Pasang ekstensi SafePal Wallet",
          "description": "Klik di pojok kanan atas browser Anda dan pin SafePal Wallet untuk akses mudah."
        },
        "step2": {
          "title": "Buat atau Impor sebuah dompet",
          "description": "Buat dompet baru atau impor yang sudah ada."
        },
        "step3": {
          "title": "Segarkan browser Anda",
          "description": "Setelah Anda menyiapkan SafePal Wallet, klik di bawah ini untuk menyegarkan browser dan memuat ekstensi."
        }
      },
      "qr_code": {
        "step1": {
          "title": "Buka aplikasi SafePal Wallet",
          "description": "Letakkan SafePal Wallet di layar utama Anda untuk akses yang lebih cepat ke wallet Anda."
        },
        "step2": {
          "title": "Buat atau Impor Dompet",
          "description": "Buat dompet baru atau impor yang sudah ada."
        },
        "step3": {
          "title": "Ketuk WalletConnect di Pengaturan",
          "description": "Pilih Koneksi Baru, lalu pindai kode QR dan konfirmasi petunjuk untuk terhubung."
        }
      }
    },
    "desig": {
      "extension": {
        "step1": {
          "title": "Instal ekstensi Desig",
          "description": "Kami merekomendasikan menempelkan Desig ke taskbar Anda untuk akses dompet Anda lebih mudah."
        },
        "step2": {
          "title": "Buat Dompet",
          "description": "Pastikan untuk mencadangkan wallet Anda menggunakan metode yang aman. Jangan pernah berbagi frasa rahasia Anda dengan siapa pun."
        },
        "step3": {
          "title": "Segarkan browser Anda",
          "description": "Setelah Anda menyiapkan dompet Anda, klik di bawah ini untuk menyegarkan browser dan memuat ekstensi."
        }
      }
    },
    "subwallet": {
      "extension": {
        "step1": {
          "title": "Instal ekstensi SubWallet",
          "description": "Kami merekomendasikan menempelkan SubWallet ke taskbar Anda untuk akses dompet Anda lebih cepat."
        },
        "step2": {
          "title": "Buat atau Impor Dompet",
          "description": "Pastikan untuk mencadangkan dompet Anda menggunakan metode yang aman. Jangan pernah berbagi frase pemulihan Anda dengan siapa pun."
        },
        "step3": {
          "title": "Segarkan browser Anda",
          "description": "Setelah Anda menyiapkan dompet Anda, klik di bawah ini untuk menyegarkan browser dan memuat ekstensi."
        }
      },
      "qr_code": {
        "step1": {
          "title": "Buka aplikasi SubWallet",
          "description": "Kami merekomendasikan menaruh SubWallet di layar utama Anda untuk akses lebih cepat."
        },
        "step2": {
          "title": "Buat atau Impor Dompet",
          "description": "Pastikan untuk mencadangkan wallet Anda menggunakan metode yang aman. Jangan pernah berbagi frasa rahasia Anda dengan siapa pun."
        },
        "step3": {
          "title": "Tekan tombol scan",
          "description": "Setelah Anda memindai, akan muncul petunjuk koneksi untuk Anda menghubungkan dompet Anda."
        }
      }
    },
    "clv": {
      "extension": {
        "step1": {
          "title": "Instal ekstensi CLV Wallet",
          "description": "Kami merekomendasikan menempelkan CLV Wallet ke taskbar Anda untuk akses dompet Anda lebih cepat."
        },
        "step2": {
          "title": "Buat atau Impor Dompet",
          "description": "Pastikan untuk mencadangkan wallet Anda menggunakan metode yang aman. Jangan pernah berbagi frasa rahasia Anda dengan siapa pun."
        },
        "step3": {
          "title": "Segarkan browser Anda",
          "description": "Setelah Anda menyiapkan dompet Anda, klik di bawah ini untuk menyegarkan browser dan memuat ekstensi."
        }
      },
      "qr_code": {
        "step1": {
          "title": "Buka aplikasi CLV Wallet",
          "description": "Kami sarankan untuk menempatkan CLV Wallet di layar utama Anda untuk akses yang lebih cepat."
        },
        "step2": {
          "title": "Buat atau Impor Dompet",
          "description": "Pastikan untuk mencadangkan wallet Anda menggunakan metode yang aman. Jangan pernah berbagi frasa rahasia Anda dengan siapa pun."
        },
        "step3": {
          "title": "Tekan tombol scan",
          "description": "Setelah Anda memindai, akan muncul petunjuk koneksi untuk Anda menghubungkan dompet Anda."
        }
      }
    },
    "okto": {
      "qr_code": {
        "step1": {
          "title": "Buka aplikasi Okto",
          "description": "Tambahkan Okto ke layar utama Anda untuk akses cepat"
        },
        "step2": {
          "title": "Buat Wallet MPC",
          "description": "Buat akun dan generate wallet"
        },
        "step3": {
          "title": "Ketuk WalletConnect di Pengaturan",
          "description": "Ketuk ikon Scan QR di pojok kanan atas dan konfirmasi prompt untuk terhubung."
        }
      }
    },
    "ledger": {
      "desktop": {
        "step1": {
          "title": "Buka aplikasi Ledger Live",
          "description": "Kami merekomendasikan menempatkan Ledger Live di layar utama Anda untuk akses lebih cepat."
        },
        "step2": {
          "title": "Atur Ledger Anda",
          "description": "Atur Ledger baru atau hubungkan ke Ledger yang sudah ada."
        },
        "step3": {
          "title": "Hubungkan",
          "description": "Setelah Anda scan, muncul prompt koneksi untuk Anda menghubungkan dompet Anda."
        }
      },
      "qr_code": {
        "step1": {
          "title": "Buka aplikasi Ledger Live",
          "description": "Kami merekomendasikan menempatkan Ledger Live di layar utama Anda untuk akses lebih cepat."
        },
        "step2": {
          "title": "Atur Ledger Anda",
          "description": "Anda dapat melakukan sinkronisasi dengan aplikasi desktop atau menghubungkan Ledger Anda."
        },
        "step3": {
          "title": "Pindai kode",
          "description": "Ketuk WalletConnect lalu Beralih ke Scanner. Setelah Anda scan, muncul prompt koneksi untuk Anda menghubungkan dompet Anda."
        }
      }
    }
  }
}
`;const $E=Object.freeze(Object.defineProperty({__proto__:null,default:KE},Symbol.toStringTag,{value:"Module"}));var un=`{
  "connect_wallet": {
    "label": "ウォレットを接続"
  },
  "intro": {
    "title": "ウォレットとは何ですか？",
    "description": "ウォレットは、デジタルアセットを送信、受信、保存、表示するために使用されます。また、各ウェブサイトで新たなアカウントやパスワードを作成する必要なく、ログインする新しい方法でもあります。",
    "digital_asset": {
      "title": "あなたのデジタル資産のための家",
      "description": "ウォレットは、EthereumやNFTのようなデジタル資産を送信、受信、保存、表示するために使用されます。"
    },
    "login": {
      "title": "新しいログイン方法",
      "description": "すべてのウェブサイトで新しいアカウントとパスワードを作成する代わりに、ウォレットを接続します。"
    },
    "get": {
      "label": "ウォレットを取得する"
    },
    "learn_more": {
      "label": "詳しくはこちら"
    }
  },
  "sign_in": {
    "label": "アカウントを確認する",
    "description": "接続を完了するには、このアカウントの所有者であることを証明するためにウォレットでメッセージに署名する必要があります。",
    "message": {
      "send": "メッセージを送信",
      "preparing": "メッセージの準備中...",
      "cancel": "キャンセル",
      "preparing_error": "メッセージの準備中にエラーが発生しました、再試行してください！"
    },
    "signature": {
      "waiting": "署名を待っています...",
      "verifying": "署名を検証中...",
      "signing_error": "メッセージの署名中にエラーが発生しました、再試行してください！",
      "verifying_error": "署名の検証中にエラーが発生しました、再試行してください！",
      "oops_error": "おっと、何かが間違っていました！"
    }
  },
  "connect": {
    "label": "接続",
    "title": "ウォレットを接続する",
    "new_to_ethereum": {
      "description": "Ethereumのウォレットが初めてですか？",
      "learn_more": {
        "label": "詳しくはこちら"
      }
    },
    "learn_more": {
      "label": "詳しくはこちら"
    },
    "recent": "最近利用しました",
    "status": {
      "opening": "%{wallet}を開いています...",
      "connecting": "接続中",
      "connect_mobile": "%{wallet}で続行",
      "not_installed": "%{wallet} はインストールされていません",
      "not_available": "%{wallet} は利用できません",
      "confirm": "エクステンションで接続を確認してください",
      "confirm_mobile": "ウォレットでの接続リクエストを承認する"
    },
    "secondary_action": {
      "get": {
        "description": "%{wallet}がありませんか？",
        "label": "取得"
      },
      "install": {
        "label": "インストール"
      },
      "retry": {
        "label": "再試行"
      }
    },
    "walletconnect": {
      "description": {
        "full": "公式のWalletConnectモーダルが必要ですか？",
        "compact": "WalletConnectモーダルが必要ですか？"
      },
      "open": {
        "label": "開く"
      }
    }
  },
  "connect_scan": {
    "title": "%{wallet}でスキャン",
    "fallback_title": "携帯電話でスキャンしてください"
  },
  "connector_group": {
    "recommended": "おすすめのウォレット",
    "other": "その他",
    "popular": "人気のウォレット",
    "more": "もっと",
    "others": "その他"
  },
  "get": {
    "title": "ウォレットを取得",
    "action": {
      "label": "取得"
    },
    "mobile": {
      "description": "モバイルウォレット"
    },
    "extension": {
      "description": "ブラウザ拡張"
    },
    "mobile_and_extension": {
      "description": "モバイルウォレットと拡張機能"
    },
    "mobile_and_desktop": {
      "description": "モバイルとデスクトップウォレット"
    },
    "looking_for": {
      "title": "お探しのウォレットがありませんか？",
      "mobile": {
        "description": "メイン画面でウォレットを選択し、異なるウォレットプロバイダーで始めてください。"
      },
      "desktop": {
        "compact_description": "メイン画面でウォレットを選択し、異なるウォレットプロバイダーで始めてください。",
        "wide_description": "左側のウォレットを選択して、別のウォレットプロバイダーで始めてください。"
      }
    }
  },
  "get_options": {
    "title": "%{wallet}で始める",
    "short_title": "%{wallet}を取得する",
    "mobile": {
      "title": "モバイル用 %{wallet}",
      "description": "モバイルウォレットを使用して、イーサリアムの世界を探索します。",
      "download": {
        "label": "アプリを取得"
      }
    },
    "extension": {
      "title": "%{wallet} for %{browser}",
      "description": "お好きなウェブブラウザからウォレットに直接アクセスします。",
      "download": {
        "label": "%{browser}に追加"
      }
    },
    "desktop": {
      "title": "%{wallet} for %{platform}",
      "description": "あなたの強力なデスクトップからネイティブにウォレットにアクセスします。",
      "download": {
        "label": "%{platform}に追加する"
      }
    }
  },
  "get_mobile": {
    "title": "%{wallet}をインストール",
    "description": "iOSまたはAndroidでダウンロードするために電話でスキャン",
    "continue": {
      "label": "続行"
    }
  },
  "get_instructions": {
    "mobile": {
      "connect": {
        "label": "接続"
      },
      "learn_more": {
        "label": "詳しくはこちら"
      }
    },
    "extension": {
      "refresh": {
        "label": "更新"
      },
      "learn_more": {
        "label": "詳しくはこちら"
      }
    },
    "desktop": {
      "connect": {
        "label": "接続"
      },
      "learn_more": {
        "label": "詳しくはこちら"
      }
    }
  },
  "chains": {
    "title": "ネットワークを切り替える",
    "wrong_network": "誤ったネットワークが検出されました、続行するには切り替えるか切断してください。",
    "confirm": "ウォレットで確認する",
    "switching_not_supported": "あなたのウォレットは %{appName}からネットワークを切り替えることをサポートしていません。ウォレット内でネットワークを切り替えてみてください。",
    "switching_not_supported_fallback": "あなたのウォレットは、このアプリからネットワークを切り替えることをサポートしていません。代わりにウォレット内からネットワークを切り替えてみてください。",
    "disconnect": "切断する",
    "connected": "接続しました"
  },
  "profile": {
    "disconnect": {
      "label": "切断する"
    },
    "copy_address": {
      "label": "アドレスをコピーする",
      "copied": "コピーしました！"
    },
    "explorer": {
      "label": "エクスプローラーで詳しく見る"
    },
    "transactions": {
      "description": "%{appName} トランザクションがここに表示されます...",
      "description_fallback": "あなたのトランザクションはここに表示されます...",
      "recent": {
        "title": "最近のトランザクション"
      },
      "clear": {
        "label": "すべてクリア"
      }
    }
  },
  "wallet_connectors": {
    "argent": {
      "qr_code": {
        "step1": {
          "description": "より速くウォレットにアクセスするために、Argentをホーム画面に置いてください。",
          "title": "Argentアプリを開く"
        },
        "step2": {
          "description": "ウォレットとユーザーネームを作成するか、既存のウォレットをインポートします。",
          "title": "ウォレットを作成またはインポート"
        },
        "step3": {
          "description": "スキャン後、ウォレットを接続するための接続プロンプトが表示されます。",
          "title": "「QRをスキャン」ボタンをタップします"
        }
      }
    },
    "bifrost": {
      "qr_code": {
        "step1": {
          "description": "より速くアクセスできるように、Bifrost Walletをホーム画面に置くことをお勧めします。",
          "title": "Bifrost Walletアプリを開きます"
        },
        "step2": {
          "description": "リカバリーフレーズを使用してウォレットを作成またはインポートします。",
          "title": "ウォレットを作成またはインポート"
        },
        "step3": {
          "description": "スキャン後、ウォレットを接続するための接続プロンプトが表示されます。",
          "title": "「スキャン」ボタンをタップします"
        }
      }
    },
    "bitget": {
      "qr_code": {
        "step1": {
          "description": "より迅速なアクセスのために、ホーム画面にBitget Walletを配置することをお勧めします。",
          "title": "Bitget Walletアプリを開く"
        },
        "step2": {
          "description": "ウォレットは安全な方法でバックアップしてください。秘密のフレーズを誰とも共有しないでください。",
          "title": "ウォレットを作成またはインポート"
        },
        "step3": {
          "description": "スキャン後、ウォレットを接続するための接続プロンプトが表示されます。",
          "title": "スキャンボタンをタップする"
        }
      },
      "extension": {
        "step1": {
          "description": "ウォレットへのより迅速なアクセスのためにBitget Walletをタスクバーにピン留めすることをお勧めします。",
          "title": "Bitget Wallet拡張機能をインストールします"
        },
        "step2": {
          "description": "ウォレットを安全な方法でバックアップしてください。秘密のフレーズを誰とも共有しないでください。",
          "title": "ウォレットを作成またはインポートします"
        },
        "step3": {
          "description": "ウォレットを設定したら、以下をクリックしてブラウザを更新し、拡張機能を読み込みます。",
          "title": "ブラウザを更新する"
        }
      }
    },
    "bitski": {
      "extension": {
        "step1": {
          "description": "ウォレットへの素早いアクセスのために、Bitskiをタスクバーにピン留めすることをお勧めします。",
          "title": "Bitskiエクステンションをインストールする"
        },
        "step2": {
          "description": "ウォレットを安全な方法でバックアップしてください。シークレットフレーズは誰とも共有しないでください。",
          "title": "ウォレットを作成するか、インポートする"
        },
        "step3": {
          "description": "ウォレットのセットアップが完了したら、以下をクリックしてブラウザを更新し、エクステンションを読み込みます。",
          "title": "ブラウザを更新する"
        }
      }
    },
    "coin98": {
      "qr_code": {
        "step1": {
          "description": "Coin98ウォレットをホーム画面に置くことで、ウォレットへのアクセスが高速化されることをお勧めします。",
          "title": "Coin98ウォレットアプリを開きます"
        },
        "step2": {
          "description": "電話のバックアップ機能を使用して、ウォレットを簡単にバックアップすることができます。",
          "title": "ウォレットを作成またはインポートする"
        },
        "step3": {
          "description": "スキャン後、ウォレットへの接続を促すプロンプトが表示されます。",
          "title": "WalletConnectボタンをタップします"
        }
      },
      "extension": {
        "step1": {
          "description": "ブラウザの右上をクリックして、Coin98ウォレットをピン留めして簡単にアクセスできるようにします。",
          "title": "Coin98ウォレットの拡張機能をインストールします"
        },
        "step2": {
          "description": "新しいウォレットを作成するか、既存のものをインポートします。",
          "title": "ウォレットを作成またはインポートする"
        },
        "step3": {
          "description": "Coin98ウォレットをセットアップしたら、下のリンクをクリックしてブラウザを更新し、拡張機能をロードします。",
          "title": "ブラウザを更新する"
        }
      }
    },
    "coinbase": {
      "qr_code": {
        "step1": {
          "description": "より素早くアクセスできるように、Coinbaseウォレットをホームスクリーンに置くことをお勧めします。",
          "title": "Coinbase Walletアプリを開く"
        },
        "step2": {
          "description": "クラウドバックアップ機能を使用して、簡単にウォレットをバックアップできます。",
          "title": "ウォレットを作成またはインポートする"
        },
        "step3": {
          "description": "スキャン後、ウォレットを接続するための接続プロンプトが表示されます。",
          "title": "スキャンボタンをタップする"
        }
      },
      "extension": {
        "step1": {
          "description": "タスクバーにCoinbase Walletをピン留めして、ウォレットにより早くアクセスできるように推奨します。",
          "title": "Coinbase Wallet拡張機能をインストールする"
        },
        "step2": {
          "description": "必ず安全な方法を使用してウォレットをバックアップしてください。秘密のフレーズを誰にも共有しないでください。",
          "title": "ウォレットを作成またはインポート"
        },
        "step3": {
          "description": "ウォレットの設定が完了したら、下のボタンをクリックしてブラウザを更新し、拡張機能をロードします。",
          "title": "ブラウザを更新する"
        }
      }
    },
    "core": {
      "qr_code": {
        "step1": {
          "description": "ウォレットへの迅速なアクセスのため、コアをホーム画面に設定することを推奨します。",
          "title": "Coreアプリを開く"
        },
        "step2": {
          "description": "電話のバックアップ機能を使って、簡単にウォレットをバックアップできます。",
          "title": "ウォレットを作成またはインポート"
        },
        "step3": {
          "description": "スキャン後、ウォレットを接続するようにプロンプトが表示されます。",
          "title": "WalletConnectボタンをタップする"
        }
      },
      "extension": {
        "step1": {
          "description": "ウォレットへのより迅速なアクセスのために、タスクバーにCoreをピン留めすることをお勧めします。",
          "title": "Core拡張機能をインストールする"
        },
        "step2": {
          "description": "セキュアな方法を使用してウォレットをバックアップしてください。秘密のフレーズを誰とも共有しないでください。",
          "title": "ウォレットを作成またはインポートする"
        },
        "step3": {
          "description": "ウォレットの設定が完了したら、以下をクリックしてブラウザを更新し、拡張機能をロードします。",
          "title": "ブラウザを更新する"
        }
      }
    },
    "fox": {
      "qr_code": {
        "step1": {
          "description": "より迅速なアクセスのために、ホーム画面にFoxWalletを置くことをお勧めします。",
          "title": "FoxWalletアプリを開く"
        },
        "step2": {
          "description": "セキュアな方法を使用してウォレットをバックアップすることを確認してください。秘密のフレーズは誰とも共有しないでください。",
          "title": "ウォレットを作成またはインポート"
        },
        "step3": {
          "description": "スキャンした後、ウォレットを接続するための接続プロンプトが表示されます。",
          "title": "スキャンボタンをタップします"
        }
      }
    },
    "frontier": {
      "qr_code": {
        "step1": {
          "description": "Frontierウォレットをホーム画面に置くことで、より早くアクセスできることをお勧めします。",
          "title": "Frontierウォレットアプリを開きます"
        },
        "step2": {
          "description": "セキュアな方法を使用してウォレットをバックアップすることを確認してください。秘密のフレーズは誰とも共有しないでください。",
          "title": "ウォレットを作成またはインポート"
        },
        "step3": {
          "description": "スキャン後に、ウォレットの接続を促すメッセージが表示されます。",
          "title": "スキャンボタンをタップします"
        }
      },
      "extension": {
        "step1": {
          "description": "より迅速なウォレットへのアクセスを可能にするために、フロンティアウォレットをタスクバーにピン留めすることを推奨します。",
          "title": "フロンティアウォレットの拡張機能をインストールします"
        },
        "step2": {
          "description": "安全な方法を使用してウォレットをバックアップしてください。秘密のフレーズは決して誰とも共有しないでください。",
          "title": "ウォレットを作成またはインポート"
        },
        "step3": {
          "description": "ウォレットの設定が完了したら、ブラウザを更新して拡張機能を読み込みます。",
          "title": "ブラウザを更新する"
        }
      }
    },
    "im_token": {
      "qr_code": {
        "step1": {
          "title": "imTokenアプリを開く",
          "description": "ウォレットへのアクセスを速くするために、imTokenアプリをホーム画面に置いてください。"
        },
        "step2": {
          "title": "ウォレットを作成またはインポート",
          "description": "新しいウォレットを作成するか、既存のものをインポートします。"
        },
        "step3": {
          "title": "右上隅のスキャナーアイコンをタップします",
          "description": "新しい接続を選択し、QRコードをスキャンしてプロンプトを確認し接続します。"
        }
      }
    },
    "metamask": {
      "qr_code": {
        "step1": {
          "title": "MetaMaskアプリを開きます",
          "description": "迅速なアクセスのために、MetaMaskをホーム画面に置くことをお勧めします。"
        },
        "step2": {
          "title": "ウォレットを作成またはインポートします",
          "description": "必ず安全な方法を使用してウォレットをバックアップしてください。秘密の回復フレーズを誰にも共有しないでください。"
        },
        "step3": {
          "title": "スキャンボタンをタップします",
          "description": "スキャンすると、ウォレットを接続するための接続プロンプトが表示されます。"
        }
      },
      "extension": {
        "step1": {
          "title": "MetaMaskの拡張機能をインストールします",
          "description": "ウォレットへのより速いアクセスのために、MetaMaskをタスクバーにピン留めすることをお勧めします。"
        },
        "step2": {
          "title": "ウォレットを作成またはインポート",
          "description": "安全な方法を使用してウォレットをバックアップし、秘密のフレーズを誰とも共有しないでください。"
        },
        "step3": {
          "title": "ブラウザを更新",
          "description": "ウォレットを設定した後は、下のリンクをクリックしてブラウザを更新し、エクステンションを読み込んでください。"
        }
      }
    },
    "okx": {
      "qr_code": {
        "step1": {
          "title": "OKX Walletアプリを開く",
          "description": "OKX Walletをホーム画面に配置して、より早くアクセスできるようにすることをお勧めします。"
        },
        "step2": {
          "title": "ウォレットを作成またはインポート",
          "description": "セキュアな方法を使ってウォレットをバックアップしてください。秘密フレーズは誰とも共有しないでください。"
        },
        "step3": {
          "title": "スキャンボタンをタップする",
          "description": "スキャン後、ウォレットを接続するための接続プロンプトが表示されます。"
        }
      },
      "extension": {
        "step1": {
          "title": "OKXウォレット拡張機能をインストールする",
          "description": "ウォレットへの迅速なアクセスのため、OKXウォレットをタスクバーにピン止めすることをお勧めします。"
        },
        "step2": {
          "title": "ウォレットを作成するか、インポートする",
          "description": "セキュアな方法を使ってウォレットをバックアップしてください。秘密フレーズは誰とも共有しないでください。"
        },
        "step3": {
          "title": "ブラウザを更新する",
          "description": "ウォレットを設定したら、下をクリックしてブラウザをリフレッシュし、拡張機能を読み込みます。"
        }
      }
    },
    "omni": {
      "qr_code": {
        "step1": {
          "title": "Omniアプリを開く",
          "description": "Omniをホーム画面に追加して、ウォレットへのアクセスを早めます。"
        },
        "step2": {
          "title": "ウォレットを作成またはインポート",
          "description": "新しいウォレットを作成するか、既存のものをインポートします。"
        },
        "step3": {
          "title": "QRアイコンをタップしてスキャン",
          "description": "ホーム画面のQRアイコンをタップし、コードをスキャンし、プロンプトを確認して接続します。"
        }
      }
    },
    "token_pocket": {
      "qr_code": {
        "step1": {
          "title": "TokenPocketアプリを開く",
          "description": "より速いアクセスのために、TokenPocketをホーム画面に置くことをお勧めします。"
        },
        "step2": {
          "title": "ウォレットを作成またはインポートする",
          "description": "必ず安全な方法を使用してウォレットをバックアップしてください。秘密の回復フレーズを誰にも共有しないでください。"
        },
        "step3": {
          "title": "スキャンボタンをタップする",
          "description": "スキャン後、ウォレットを接続するための接続プロンプトが表示されます。"
        }
      },
      "extension": {
        "step1": {
          "title": "TokenPocketエクステンションをインストールする",
          "description": "ウォレットへのより早いアクセスのために、TokenPocketをタスクバーにピン留めすることをお勧めします。"
        },
        "step2": {
          "title": "ウォレットを作成またはインポート",
          "description": "ウォレットを安全な方法でバックアップすることを確認してください。シークレットフレーズを決して他の人と共有しないでください。"
        },
        "step3": {
          "title": "ブラウザを更新",
          "description": "ウォレットのセットアップが完了したら、以下をクリックしてブラウザを更新し、拡張機能をロードします。"
        }
      }
    },
    "trust": {
      "qr_code": {
        "step1": {
          "title": "Trust Walletアプリを開く",
          "description": "ウォレットへの高速アクセスのために、Trust Walletをホーム画面に置きます。"
        },
        "step2": {
          "title": "ウォレットを作成またはインポート",
          "description": "新しいウォレットを作成するか、既存のものをインポートします。"
        },
        "step3": {
          "title": "設定でWalletConnectをタップします",
          "description": "新しい接続を選択し、QRコードをスキャンして、プロンプトで接続を確認します。"
        }
      },
      "extension": {
        "step1": {
          "title": "Trust Wallet拡張機能をインストールします",
          "description": "ブラウザの右上をクリックし、Trust Walletをピン留めして簡単にアクセスできるようにします。"
        },
        "step2": {
          "title": "ウォレットを作成するかインポートします",
          "description": "新しいウォレットを作成するか、既存のものをインポートします。"
        },
        "step3": {
          "title": "ブラウザを更新する",
          "description": "Trust Walletの設定が完了したら、以下をクリックしてブラウザを更新し、拡張機能を読み込みます。"
        }
      }
    },
    "uniswap": {
      "qr_code": {
        "step1": {
          "title": "Uniswapアプリを開く",
          "description": "Uniswapウォレットをホーム画面に追加して、ウォレットへのアクセスを高速化します。"
        },
        "step2": {
          "title": "ウォレットを作成またはインポートする",
          "description": "新しいウォレットを作成するか、既存のものをインポートします。"
        },
        "step3": {
          "title": "QRアイコンをタップしてスキャンする",
          "description": "ホーム画面のQRアイコンをタップし、コードをスキャンしてプロンプトを確認して接続します。"
        }
      }
    },
    "zerion": {
      "qr_code": {
        "step1": {
          "title": "Zerionアプリを開く",
          "description": "より速くアクセスするために、Zerionをホーム画面に置くことをお勧めします。"
        },
        "step2": {
          "title": "ウォレットを作成するか、インポートする",
          "description": "必ず安全な方法を使用してウォレットをバックアップしてください。秘密の回復フレーズを誰にも共有しないでください。"
        },
        "step3": {
          "title": "スキャンボタンを押す",
          "description": "スキャンした後、ウォレットを接続するための接続プロンプトが表示されます。"
        }
      },
      "extension": {
        "step1": {
          "title": "Zerion拡張機能をインストールする",
          "description": "ウォレットへの素早いアクセスのため、Zerionをタスクバーにピン留めすることをお勧めします。"
        },
        "step2": {
          "title": "ウォレットを作成またはインポート",
          "description": "ウォレットをセキュアな方法でバックアップすることを確認してください。秘密のフレーズを誰とも共有しないでください。"
        },
        "step3": {
          "title": "ブラウザを更新する",
          "description": "ウォレットをセットアップしたら、下のボタンをクリックしてブラウザを更新し、拡張機能をロードします。"
        }
      }
    },
    "rainbow": {
      "qr_code": {
        "step1": {
          "title": "Rainbowアプリを開く",
          "description": "ウォレットへの早いアクセスのために、Rainbowをホーム画面に置くことをおすすめします。"
        },
        "step2": {
          "title": "ウォレットを作成またはインポート",
          "description": "電話のバックアップ機能を使用して、簡単にウォレットをバックアップすることができます。"
        },
        "step3": {
          "title": "スキャンボタンをタップする",
          "description": "スキャンした後、ウォレットを接続するための接続プロンプトが表示されます。"
        }
      }
    },
    "enkrypt": {
      "extension": {
        "step1": {
          "description": "ウォレットへのアクセスをより早くするため、タスクバーにEnkrypt Walletをピン留めすることを推奨します。",
          "title": "Enkrypt Wallet拡張機能をインストールしてください"
        },
        "step2": {
          "description": "安全な方法でウォレットのバックアップを必ず取り、秘密のフレーズを誰とも共有しないでください。",
          "title": "ウォレットを作成するか、インポートする"
        },
        "step3": {
          "description": "ウォレットの設定が完了したら、以下をクリックしてブラウザを更新し、拡張機能を読み込みます。",
          "title": "ブラウザを更新する"
        }
      }
    },
    "frame": {
      "extension": {
        "step1": {
          "description": "ウォレットへのアクセスをより早くするため、タスクバーにFrameをピン留めすることを推奨します。",
          "title": "Frameとその付属の拡張機能をインストール"
        },
        "step2": {
          "description": "ウォレットを安全な方法でバックアップしてください。秘密のフレーズを誰とも共有しないでください。",
          "title": "ウォレットを作成、またはインポート"
        },
        "step3": {
          "description": "ウォレットの設定が完了したら、下のリンクをクリックしてブラウザを更新し、拡張機能をロードします。",
          "title": "ブラウザを更新"
        }
      }
    },
    "one_key": {
      "extension": {
        "step1": {
          "title": "OneKey Wallet拡張機能をインストール",
          "description": "ウォレットへのアクセスを素早く行うため、OneKey Walletをタスクバーにピン留めすることをお勧めします。"
        },
        "step2": {
          "title": "ウォレットを作成、またはインポート",
          "description": "安全な方法を使用してウォレットをバックアップしてください。秘密のフレーズを誰とも共有しないでください。"
        },
        "step3": {
          "title": "ブラウザを更新する",
          "description": "ウォレットを設定したら、以下をクリックしてブラウザを更新し、拡張機能をロードします。"
        }
      }
    },
    "phantom": {
      "extension": {
        "step1": {
          "title": "Phantom拡張機能をインストールする",
          "description": "ウォレットへの容易なアクセスのため、Phantomをタスクバーにピン留めすることを推奨します。"
        },
        "step2": {
          "title": "ウォレットを作成またはインポートする",
          "description": "安全な方法を使用してウォレットをバックアップしてください。秘密の回復フレーズを誰とも共有しないでください。"
        },
        "step3": {
          "title": "ブラウザを更新する",
          "description": "ウォレットの設定が完了したら、以下をクリックしてブラウザを更新し、エクステンションを読み込みます。"
        }
      }
    },
    "rabby": {
      "extension": {
        "step1": {
          "title": "Rabbyエクステンションをインストールする",
          "description": "ウォレットへの素早いアクセスのため、タスクバーにRabbyをピン止めすることをお勧めします。"
        },
        "step2": {
          "title": "ウォレットを作成またはインポート",
          "description": "セキュアな方法を使用してウォレットをバックアップしてください。秘密のフレーズを誰とも共有しないでください。"
        },
        "step3": {
          "title": "ブラウザを更新",
          "description": "ウォレットの設定が完了したら、以下をクリックしてブラウザを更新し、拡張機能をロードします。"
        }
      }
    },
    "safeheron": {
      "extension": {
        "step1": {
          "title": "コア拡張機能をインストール",
          "description": "ウォレットへの素早いアクセスのため、タスクバーにSafeheronをピン止めすることをお勧めします。"
        },
        "step2": {
          "title": "ウォレットを作成またはインポート",
          "description": "確実に安全な方法でウォレットをバックアップしてください。秘密のフレーズは決して誰とも共有しないでください。"
        },
        "step3": {
          "title": "ブラウザを更新する",
          "description": "ウォレットの設定が完了したら、以下をクリックしてブラウザを更新し、拡張機能をロードします。"
        }
      }
    },
    "taho": {
      "extension": {
        "step1": {
          "title": "Taho拡張機能をインストールする",
          "description": "ウォレットへのより迅速なアクセスのため、Tahoをタスクバーにピン留めすることをお勧めします。"
        },
        "step2": {
          "title": "ウォレットを作成するか、インポートする",
          "description": "確実に安全な方法でウォレットをバックアップしてください。秘密のフレーズは決して誰とも共有しないでください。"
        },
        "step3": {
          "title": "ブラウザを更新する",
          "description": "ウォレットの設定が完了したら、下をクリックしてブラウザを更新し、拡張機能をロードします。"
        }
      }
    },
    "talisman": {
      "extension": {
        "step1": {
          "title": "Talisman拡張機能をインストールする",
          "description": "ウォレットへのより早いアクセスのために、Talismanをタスクバーにピン留めすることをお勧めします。"
        },
        "step2": {
          "title": "Ethereumウォレットを作成するか、インポートする",
          "description": "ウォレットを安全な方法でバックアップしておくことを確認してください。リカバリーフレーズを誰とも共有しないでください。"
        },
        "step3": {
          "title": "ブラウザを更新する",
          "description": "ウォレットの設定が完了したら、下をクリックしてブラウザを更新し、拡張機能をロードします。"
        }
      }
    },
    "xdefi": {
      "extension": {
        "step1": {
          "title": "XDEFI Wallet拡張機能をインストールする",
          "description": "XDEFI Walletをタスクバーにピン留めすることで、ウォレットへのアクセスが速くなることをお勧めします。"
        },
        "step2": {
          "title": "ウォレットの作成またはインポート",
          "description": "ウォレットを安全な方法でバックアップしてください。秘密のフレーズを誰とも共有しないでください。"
        },
        "step3": {
          "title": "ブラウザを更新する",
          "description": "ウォレットの設定が完了したら、以下をクリックしてブラウザを更新し、拡張機能をロードしてください。"
        }
      }
    },
    "zeal": {
      "extension": {
        "step1": {
          "title": "Zeal 拡張機能をインストール",
          "description": "ウォレットに素早くアクセスするために、タスクバーに Zeal をピン留めすることをお勧めします。"
        },
        "step2": {
          "title": "ウォレットを作成またはインポート",
          "description": "ウォレットは安全な方法でバックアップしてください。秘密のフレーズを誰とも共有しないでください。"
        },
        "step3": {
          "title": "ブラウザを更新する",
          "description": "ウォレットを設定したら、以下をクリックしてブラウザを更新し、拡張機能を読み込みます。"
        }
      }
    },
    "safepal": {
      "extension": {
        "step1": {
          "title": "SafePal Wallet拡張機能をインストールする",
          "description": "ブラウザの右上でクリックし、Easy AccessのためにSafePal Walletをピン留めします。"
        },
        "step2": {
          "title": "ウォレットを作成またはインポートする",
          "description": "新しいウォレットを作成するか、既存のものをインポートします。"
        },
        "step3": {
          "title": "ブラウザを更新する",
          "description": "SafePal Walletのセットアップが完了したら、以下をクリックしてブラウザをリフレッシュし、エクステンションをロードします。"
        }
      },
      "qr_code": {
        "step1": {
          "title": "SafePal Walletアプリを開く",
          "description": "SafePal Walletをホーム画面に置くことで、ウォレットへの素早いアクセスが可能になります。"
        },
        "step2": {
          "title": "ウォレットを作成またはインポート",
          "description": "新しいウォレットを作成するか、既存のものをインポートします。"
        },
        "step3": {
          "title": "設定でWalletConnectをタップします",
          "description": "新しい接続を選択し、QRコードをスキャンしてプロンプトを確認し接続します。"
        }
      }
    },
    "desig": {
      "extension": {
        "step1": {
          "title": "Desig拡張機能をインストール",
          "description": "あなたのウォレットへの簡単なアクセスのために、Desigをタスクバーにピン留めすることをお勧めします。"
        },
        "step2": {
          "title": "ウォレットを作成",
          "description": "ウォレットは安全な方法でバックアップしてください。秘密のフレーズを誰とも共有しないでください。"
        },
        "step3": {
          "title": "ブラウザを更新する",
          "description": "ウォレットを設定したら、以下をクリックしてブラウザを更新し、拡張機能を読み込みます。"
        }
      }
    },
    "subwallet": {
      "extension": {
        "step1": {
          "title": "SubWallet拡張機能をインストール",
          "description": "ウォレットへのより素早いアクセスのため、SubWalletをタスクバーにピン留めすることをお勧めします。"
        },
        "step2": {
          "title": "ウォレットを作成またはインポート",
          "description": "ウォレットを安全な方法でバックアップしておくことを確認してください。リカバリーフレーズを誰とも共有しないでください。"
        },
        "step3": {
          "title": "ブラウザを更新する",
          "description": "ウォレットを設定したら、以下をクリックしてブラウザを更新し、拡張機能を読み込みます。"
        }
      },
      "qr_code": {
        "step1": {
          "title": "SubWalletアプリを開く",
          "description": "より迅速なアクセスのために、SubWalletをホーム画面に置くことをお勧めします。"
        },
        "step2": {
          "title": "ウォレットを作成またはインポート",
          "description": "ウォレットは安全な方法でバックアップしてください。秘密のフレーズを誰とも共有しないでください。"
        },
        "step3": {
          "title": "「スキャン」ボタンをタップします",
          "description": "スキャン後、ウォレットを接続するための接続プロンプトが表示されます。"
        }
      }
    },
    "clv": {
      "extension": {
        "step1": {
          "title": "CLV Wallet拡張機能をインストール",
          "description": "ウォレットへのより素早いアクセスのため、CLV Walletをタスクバーにピン留めすることをお勧めします。"
        },
        "step2": {
          "title": "ウォレットを作成またはインポート",
          "description": "ウォレットは安全な方法でバックアップしてください。秘密のフレーズを誰とも共有しないでください。"
        },
        "step3": {
          "title": "ブラウザを更新する",
          "description": "ウォレットを設定したら、以下をクリックしてブラウザを更新し、拡張機能を読み込みます。"
        }
      },
      "qr_code": {
        "step1": {
          "title": "CLV Walletアプリを開く",
          "description": "より迅速なアクセスのために、ホーム画面にCLV Walletを置くことをお勧めします。"
        },
        "step2": {
          "title": "ウォレットを作成またはインポート",
          "description": "ウォレットは安全な方法でバックアップしてください。秘密のフレーズを誰とも共有しないでください。"
        },
        "step3": {
          "title": "「スキャン」ボタンをタップします",
          "description": "スキャン後、ウォレットを接続するための接続プロンプトが表示されます。"
        }
      }
    },
    "okto": {
      "qr_code": {
        "step1": {
          "title": "Oktoアプリを開く",
          "description": "素早くアクセスするために、ホーム画面にOktoを追加します"
        },
        "step2": {
          "title": "MPCウォレットを作成する",
          "description": "アカウントを作成し、ウォレットを生成します"
        },
        "step3": {
          "title": "設定でWalletConnectをタップします",
          "description": "右上のScan QRアイコンをタップし、接続するためのプロンプトを確認します。"
        }
      }
    },
    "ledger": {
      "desktop": {
        "step1": {
          "title": "Ledger Liveアプリを開く",
          "description": "より速いアクセスのために、ホーム画面にLedger Liveを置くことを推奨します。"
        },
        "step2": {
          "title": "あなたのLedgerを設定する",
          "description": "新しいLedgerを設定するか、既存のものに接続します。"
        },
        "step3": {
          "title": "接続",
          "description": "スキャン後、ウォレットを接続するための接続プロンプトが表示されます。"
        }
      },
      "qr_code": {
        "step1": {
          "title": "Ledger Liveアプリを開く",
          "description": "より速いアクセスのために、ホーム画面にLedger Liveを置くことを推奨します。"
        },
        "step2": {
          "title": "あなたのLedgerを設定する",
          "description": "デスクトップアプリと同期するか、あなたのLedgerに接続することができます。"
        },
        "step3": {
          "title": "コードをスキャンする",
          "description": "WalletConnectをタップし、スキャナーに切り替えてください。スキャン後、ウォレットを接続するための接続プロンプトが表示されます。"
        }
      }
    }
  }
}
`;const en=Object.freeze(Object.defineProperty({__proto__:null,default:un},Symbol.toStringTag,{value:"Module"}));var En=`{
  "connect_wallet": {
    "label": "지갑 연결"
  },
  "intro": {
    "title": "지갑이란 무엇인가요?",
    "description": "지갑은 디지털 자산을 보내고, 받고, 저장하고, 표시하는 데 사용됩니다. 또한, 모든 웹 사이트에서 새 계정과 비밀번호를 생성할 필요 없이 로그인하는 새로운 방법입니다.",
    "digital_asset": {
      "title": "당신의 디지털 자산을 위한 집",
      "description": "지갑은 이더리움 및 NFT와 같은 디지털 자산을 보내고, 받고, 저장하고, 표시하는데 사용됩니다."
    },
    "login": {
      "title": "새로운 로그인 방식",
      "description": "모든 웹사이트에서 새 계정과 비밀번호를 생성하는 대신, 당신의 지갑을 연결하기만 하면 됩니다."
    },
    "get": {
      "label": "지갑 가져오기"
    },
    "learn_more": {
      "label": "더 알아보기"
    }
  },
  "sign_in": {
    "label": "계정을 확인하세요",
    "description": "연결을 완료하려면 이 계정의 소유자임을 확인하기 위해 지갑에 메시지에 서명해야 합니다.",
    "message": {
      "send": "메시지 보내기",
      "preparing": "메시지 준비 중...",
      "cancel": "취소",
      "preparing_error": "메시지 준비 중 오류가 발생했습니다. 다시 시도하세요!"
    },
    "signature": {
      "waiting": "서명을 기다리는 중...",
      "verifying": "서명 검증 중...",
      "signing_error": "메시지 서명 중 오류가 발생했습니다. 다시 시도하세요!",
      "verifying_error": "서명 검증 중 오류가 발생했습니다. 다시 시도하세요!",
      "oops_error": "앗, 문제가 발생했습니다!"
    }
  },
  "connect": {
    "label": "연결",
    "title": "지갑 연결",
    "new_to_ethereum": {
      "description": "이더리움 지갑에 처음 접하시나요?",
      "learn_more": {
        "label": "더 알아보기"
      }
    },
    "learn_more": {
      "label": "더 알아보기"
    },
    "recent": "최근",
    "status": {
      "opening": "%{wallet}열기 ...",
      "connecting": "연결 중",
      "connect_mobile": "%{wallet}에서 계속 진행",
      "not_installed": "%{wallet} 가 설치되어 있지 않습니다",
      "not_available": "%{wallet} 를 사용할 수 없습니다",
      "confirm": "확장 프로그램에서 연결을 확인하세요",
      "confirm_mobile": "지갑에서 연결 요청을 수락하십시오"
    },
    "secondary_action": {
      "get": {
        "description": "%{wallet}가 없나요?",
        "label": "GET"
      },
      "install": {
        "label": "설치"
      },
      "retry": {
        "label": "다시 시도"
      }
    },
    "walletconnect": {
      "description": {
        "full": "공식 WalletConnect 모달이 필요한가요?",
        "compact": "WalletConnect 모달이 필요한가요?"
      },
      "open": {
        "label": "열기"
      }
    }
  },
  "connect_scan": {
    "title": "%{wallet}로 스캔하기",
    "fallback_title": "휴대폰으로 스캔하기"
  },
  "connector_group": {
    "recommended": "추천",
    "other": "기타",
    "popular": "인기",
    "more": "더 보기",
    "others": "다른 지갑들"
  },
  "get": {
    "title": "월렛 받기",
    "action": {
      "label": "받기"
    },
    "mobile": {
      "description": "모바일 월렛"
    },
    "extension": {
      "description": "브라우저 확장 프로그램"
    },
    "mobile_and_extension": {
      "description": "모바일 지갑 및 확장 프로그램"
    },
    "mobile_and_desktop": {
      "description": "모바일 및 데스크톱 지갑"
    },
    "looking_for": {
      "title": "찾고 계신 것이 아닌가요?",
      "mobile": {
        "description": "메인 화면에서 다른 지갑 제공자를 사용하기 위해 지갑을 선택하세요."
      },
      "desktop": {
        "compact_description": "메인 화면에서 다른 지갑 제공자를 사용하기 위해 지갑을 선택하세요.",
        "wide_description": "왼쪽에서 지갑을 선택하여 다른 지갑 제공자를 사용하기 시작하세요."
      }
    }
  },
  "get_options": {
    "title": "%{wallet}로 시작하세요",
    "short_title": "%{wallet}얻기",
    "mobile": {
      "title": "모바일용 %{wallet}",
      "description": "모바일 지갑으로 이더리움 세계를 탐험하세요.",
      "download": {
        "label": "앱 받기"
      }
    },
    "extension": {
      "title": "%{browser}용 %{wallet}",
      "description": "가장 좋아하는 웹 브라우저에서 바로 지갑에 접근하세요.",
      "download": {
        "label": "추가하기 %{browser}"
      }
    },
    "desktop": {
      "title": "%{wallet} 용 %{platform}",
      "description": "강력한 데스크톱에서 네이티브로 지갑에 접근하세요.",
      "download": {
        "label": "%{platform}에 추가"
      }
    }
  },
  "get_mobile": {
    "title": "설치하기 %{wallet}",
    "description": "iOS 또는 Android에서 다운로드하기 위해 휴대폰으로 스캔하세요",
    "continue": {
      "label": "계속"
    }
  },
  "get_instructions": {
    "mobile": {
      "connect": {
        "label": "연결"
      },
      "learn_more": {
        "label": "더 알아보기"
      }
    },
    "extension": {
      "refresh": {
        "label": "새로고침"
      },
      "learn_more": {
        "label": "더 알아보기"
      }
    },
    "desktop": {
      "connect": {
        "label": "연결"
      },
      "learn_more": {
        "label": "더 알아보기"
      }
    }
  },
  "chains": {
    "title": "네트워크 전환",
    "wrong_network": "잘못된 네트워크를 탐지했습니다, 계속하려면 전환하거나 연결을 해제하세요.",
    "confirm": "지갑에서 승인",
    "switching_not_supported": "지갑에서 %{appName}네트워크를 전환하는 것은 지원되지 않습니다. 대신 지갑 내에서 네트워크를 전환해 보세요.",
    "switching_not_supported_fallback": "당신의 지갑은 이 앱에서 네트워크를 바꾸는 것을 지원하지 않습니다. 대신 지갑 내에서 네트워크를 변경해 보세요.",
    "disconnect": "연결 해제",
    "connected": "연결됨"
  },
  "profile": {
    "disconnect": {
      "label": "연결 해제"
    },
    "copy_address": {
      "label": "주소 복사",
      "copied": "복사됨!"
    },
    "explorer": {
      "label": "탐색기에서 더 보기"
    },
    "transactions": {
      "description": "%{appName} 거래가 여기에 나타납니다...",
      "description_fallback": "여기에 트랜잭션이 표시됩니다...",
      "recent": {
        "title": "최근 거래 내역"
      },
      "clear": {
        "label": "모두 지우기"
      }
    }
  },
  "wallet_connectors": {
    "argent": {
      "qr_code": {
        "step1": {
          "description": "지갑에 더 빠르게 액세스하려면 Argent를 홈 화면에 놓으세요.",
          "title": "Argent 앱을 열기"
        },
        "step2": {
          "description": "지갑과 사용자 이름을 생성하거나 기존의 지갑을 가져옵니다.",
          "title": "지갑 생성 또는 가져오기"
        },
        "step3": {
          "description": "스캔 후에 지갑을 연결하기 위한 연결 요청이 표시됩니다.",
          "title": "QR 코드 스캔 버튼을 누르기"
        }
      }
    },
    "bifrost": {
      "qr_code": {
        "step1": {
          "description": "더 빠른 접근을 위해 홈 화면에 Bifrost Wallet을 놓는 것을 권장합니다.",
          "title": "Bifrost 지갑 앱을 열어주세요"
        },
        "step2": {
          "description": "복구 문구를 사용하여 지갑을 생성하거나 가져옵니다.",
          "title": "지갑 생성 또는 가져오기"
        },
        "step3": {
          "description": "스캔 후 연결 프롬프트가 나타나고 지갑을 연결할 수 있습니다.",
          "title": "스캔 버튼을 누릅니다"
        }
      }
    },
    "bitget": {
      "qr_code": {
        "step1": {
          "description": "더 빠른 접근을 위해 Bitget 지갑을 홈 화면에 두는 것을 권장합니다.",
          "title": "Bitget 지갑 앱을 여세요"
        },
        "step2": {
          "description": "안전한 방법을 사용하여 지갑을 백업하세요. 절대로 비밀 구문을 누구와도 공유하지 마세요.",
          "title": "지갑 생성 또는 가져오기"
        },
        "step3": {
          "description": "스캔 후, 지갑을 연결하라는 연결 요청 메시지가 나타납니다.",
          "title": "스캔 버튼을 누르세요"
        }
      },
      "extension": {
        "step1": {
          "description": "지갑에 빠르게 액세스하기 위해 Bitget Wallet을 작업 표시줄에 고정하는 것을 권장합니다.",
          "title": "Bitget Wallet 확장 프로그램을 설치하세요"
        },
        "step2": {
          "description": "지갑을 안전한 방법으로 백업하세요. 절대로 비밀 문구를 누구와도 공유하지 마세요.",
          "title": "지갑 생성 또는 가져오기"
        },
        "step3": {
          "description": "지갑 설정을 마친 후 아래를 클릭하여 브라우저를 새로고침하고 확장 프로그램을 로드하세요.",
          "title": "브라우저를 새로 고침하세요"
        }
      }
    },
    "bitski": {
      "extension": {
        "step1": {
          "description": "지갑에 더 빠르게 액세스하기 위해 Bitski를 작업 표시줄에 고정하는 것을 권장합니다.",
          "title": "Bitski 확장 프로그램을 설치합니다"
        },
        "step2": {
          "description": "안전한 방법을 사용하여 지갑을 백업하세요. 비밀 문구를 누구와도 공유하지 마세요.",
          "title": "지갑 만들기 또는 가져오기"
        },
        "step3": {
          "description": "지갑을 설정한 후 아래를 클릭하여 브라우저를 새로고침하고 확장 프로그램을 로드하세요.",
          "title": "브라우저를 새로고침하세요"
        }
      }
    },
    "coin98": {
      "qr_code": {
        "step1": {
          "description": "지갑에 빠르게 액세스하기 위해 Coin98 Wallet을 홈 화면에 두는 것을 권장합니다.",
          "title": "Coin98 Wallet 앱을 열기"
        },
        "step2": {
          "description": "휴대폰에서 백업 기능을 이용하여 지갑을 쉽게 백업할 수 있습니다.",
          "title": "지갑 만들기 또는 가져오기"
        },
        "step3": {
          "description": "스캔한 후 연결 프롬프트가 나타나 지갑을 연결하도록 합니다.",
          "title": "WalletConnect 버튼을 누르세요"
        }
      },
      "extension": {
        "step1": {
          "description": "브라우저 오른쪽 상단을 클릭하고 쉽게 액세스할 수 있도록 Coin98 Wallet을 고정하세요.",
          "title": "Coin98 Wallet 확장 프로그램을 설치하세요"
        },
        "step2": {
          "description": "새로운 지갑을 만들거나 기존의 지갑을 가져옵니다.",
          "title": "지갑을 만들거나 가져옵니다"
        },
        "step3": {
          "description": "Coin98 Wallet을 설정하면 아래를 클릭하여 브라우저를 새로고침하고 확장 프로그램을 로드하세요.",
          "title": "브라우저를 새로고침 하세요"
        }
      }
    },
    "coinbase": {
      "qr_code": {
        "step1": {
          "description": "더 빠른 액세스를 위해 Coinbase Wallet을 홈 화면에 두는 것을 권장합니다.",
          "title": "Coinbase Wallet 앱을 엽니다"
        },
        "step2": {
          "description": "클라우드 백업 기능을 사용하여 지갑을 쉽게 백업할 수 있습니다.",
          "title": "지갑 생성 또는 가져오기"
        },
        "step3": {
          "description": "스캔한 후에 지갑을 연결하라는 연결 프롬프트가 나타납니다.",
          "title": "스캔 버튼을 탭하세요"
        }
      },
      "extension": {
        "step1": {
          "description": "지갑에 더 빠르게 접근할 수 있도록 Coinbase Wallet을 작업 표시줄에 고정하는 것을 권장합니다.",
          "title": "Coinbase Wallet 확장 프로그램을 설치하세요"
        },
        "step2": {
          "description": "안전한 방법을 사용하여 지갑을 백업하세요. 비밀 문구는 절대로 누구와도 공유하지 마세요.",
          "title": "지갑 만들기 또는 가져오기"
        },
        "step3": {
          "description": "지갑을 설정한 후 아래를 클릭하여 브라우저를 새로고침하고 확장 프로그램을 로드하세요.",
          "title": "브라우저 새로고침"
        }
      }
    },
    "core": {
      "qr_code": {
        "step1": {
          "description": "지갑에 빠르게 액세스할 수 있도록 Core를 홈 화면에 두는 것을 추천드립니다.",
          "title": "Core 앱 열기"
        },
        "step2": {
          "description": "휴대폰에서 우리의 백업 기능을 이용해 지갑을 쉽게 백업할 수 있습니다.",
          "title": "지갑 만들기 또는 가져오기"
        },
        "step3": {
          "description": "스캔 한 후에는 지갑을 연결하라는 연결 요청이 표시됩니다.",
          "title": "WalletConnect 버튼을 누르세요"
        }
      },
      "extension": {
        "step1": {
          "description": "지갑에 더 빠르게 액세스하기 위해 작업 표시줄에 Core를 고정하는 것을 권장합니다.",
          "title": "Core 확장 프로그램을 설치하세요"
        },
        "step2": {
          "description": "안전한 방법을 사용하여 지갑을 백업해야 합니다. 절대로 비밀 문구를 다른 사람과 공유하지 마세요.",
          "title": "지갑 만들기 또는 가져오기"
        },
        "step3": {
          "description": "지갑을 설정한 후 아래를 클릭하여 브라우저를 새로고침하고 확장 프로그램을 로드하세요.",
          "title": "브라우저를 새로 고치세요"
        }
      }
    },
    "fox": {
      "qr_code": {
        "step1": {
          "description": "FoxWallet을 홈 화면에 놓는 것을 추천합니다. 이렇게 하면 더 빠르게 접근할 수 있습니다.",
          "title": "FoxWallet 앱을 열어주세요"
        },
        "step2": {
          "description": "지갑을 안전한 방법으로 백업하세요. 절대로 비밀 문구를 다른 사람과 공유하지 마세요.",
          "title": "지갑을 생성하거나 가져오기"
        },
        "step3": {
          "description": "스캔 후, 지갑을 연결하라는 연결 프롬프트가 표시됩니다.",
          "title": "스캔 버튼을 누르세요"
        }
      }
    },
    "frontier": {
      "qr_code": {
        "step1": {
          "description": "Frontier Wallet을 홈 화면에 놓는 것을 추천합니다. 이렇게 하면 더 빠르게 접근할 수 있습니다.",
          "title": "Frontier Wallet 앱을 열어주세요"
        },
        "step2": {
          "description": "지갑을 안전한 방법으로 백업해야 합니다. 비밀 구문을 누구와도 공유하지 마세요.",
          "title": "지갑 생성 또는 가져오기"
        },
        "step3": {
          "description": "스캔 후에 지갑을 연결하라는 연결 프롬프트가 표시됩니다.",
          "title": "스캔 버튼을 누르세요"
        }
      },
      "extension": {
        "step1": {
          "description": "지갑에 더 빠르게 액세스 할 수 있도록 Frontier Wallet을 작업 표시줄에 고정하는 것을 권장합니다.",
          "title": "Frontier Wallet 확장 프로그램 설치"
        },
        "step2": {
          "description": "지갑을 안전한 방법으로 백업해야 합니다. 비밀 구문을 누구와도 공유하지 마세요.",
          "title": "지갑 생성 또는 가져오기"
        },
        "step3": {
          "description": "지갑을 설정한 후에 아래를 클릭하여 브라우저를 새로고침하고 확장 프로그램을 로드하세요.",
          "title": "브라우저를 새로 고칩니다"
        }
      }
    },
    "im_token": {
      "qr_code": {
        "step1": {
          "title": "imToken 앱을 연다",
          "description": "당신의 지갑에 더 빠르게 접근하기 위해 imToken 앱을 홈 화면에 둡니다."
        },
        "step2": {
          "title": "지갑을 만들거나 불러옵니다",
          "description": "새 지갑을 생성하거나 기존의 것을 가져옵니다."
        },
        "step3": {
          "title": "오른쪽 상단의 스캐너 아이콘을 누릅니다",
          "description": "새 연결을 선택하고 QR 코드를 스캔한 뒤, 연결하려는 프롬프트를 확인합니다."
        }
      }
    },
    "metamask": {
      "qr_code": {
        "step1": {
          "title": "MetaMask 앱을 엽니다",
          "description": "빠른 액세스를 위해 MetaMask를 홈 화면에 두는 것을 권장합니다."
        },
        "step2": {
          "title": "지갑 생성 또는 가져오기",
          "description": "당신의 지갑을 안전한 방법으로 백업하는 것을 잊지 마세요. 절대로 비밀 구절을 공유하지 마세요."
        },
        "step3": {
          "title": "스캔 버튼을 누릅니다",
          "description": "스캔한 후에 지갑을 연결하라는 연결 프롬프트가 나타납니다."
        }
      },
      "extension": {
        "step1": {
          "title": "MetaMask 확장 프로그램을 설치하세요",
          "description": "지갑에 빠르게 접근하기 위해 MetaMask를 작업표시줄에 고정하는 것을 추천합니다."
        },
        "step2": {
          "title": "지갑 생성 또는 가져오기",
          "description": "안전한 방법을 사용하여 지갑을 백업하세요. 결코 비밀 문구를 다른 사람과 공유하지 마세요."
        },
        "step3": {
          "title": "브라우저를 새로 고치세요",
          "description": "지갑 설정을 마친 후에는 아래를 클릭하여 브라우저를 새로고침하고 확장 프로그램을 로드하세요."
        }
      }
    },
    "okx": {
      "qr_code": {
        "step1": {
          "title": "OKX Wallet 앱을 열기",
          "description": "더 빠른 접근을 위해 OKX 지갑을 홈 화면에 두는 것을 추천합니다."
        },
        "step2": {
          "title": "지갑 만들기 또는 불러오기",
          "description": "안전한 방법으로 지갑을 백업하세요. 절대 비밀 문구를 다른 사람과 공유하지 마세요."
        },
        "step3": {
          "title": "스캔 버튼을 탭하세요",
          "description": "스캔 후 연결 요청이 나타나며, 이를 통해 지갑을 연결할 수 있습니다."
        }
      },
      "extension": {
        "step1": {
          "title": "OKX 지갑 확장 프로그램 설치하기",
          "description": "지갑에 빠르게 접근할 수 있도록 OKX 지갑을 작업 표시줄에 고정하는 것을 추천합니다."
        },
        "step2": {
          "title": "지갑 만들기 또는 불러오기",
          "description": "당신의 지갑을 안전한 방법으로 백업해야 합니다. 비밀 문구를 절대로 다른 사람과 공유하지 마세요."
        },
        "step3": {
          "title": "브라우저를 새로 고치세요",
          "description": "지갑을 설정한 후, 브라우저를 새로고침하고 확장 프로그램을 로드하기 위해 아래를 클릭하세요."
        }
      }
    },
    "omni": {
      "qr_code": {
        "step1": {
          "title": "Omni 앱을 열기",
          "description": "더 빠른 액세스를 위해 Omni를 홈 스크린에 추가하세요."
        },
        "step2": {
          "title": "지갑 만들기 또는 가져오기",
          "description": "새로운 지갑을 만들거나 기존의 하나를 가져옵니다."
        },
        "step3": {
          "title": "QR 아이콘을 탭하고 스캔하기",
          "description": "홈 화면의 QR 아이콘을 탭하고, 코드를 스캔하고 프롬프트를 확인하여 연결하세요."
        }
      }
    },
    "token_pocket": {
      "qr_code": {
        "step1": {
          "title": "TokenPocket 앱을 열어주세요",
          "description": "빠른 접근을 위해 홈 화면에 TokenPocket을 추가하는 것을 권장합니다."
        },
        "step2": {
          "title": "지갑 생성 또는 가져오기",
          "description": "안전한 방법을 사용하여 지갑을 백업하세요. 절대로 누구에게도 비밀 문구를 공유하지 마세요."
        },
        "step3": {
          "title": "스캔 버튼을 탭하세요",
          "description": "스캔 후에 지갑을 연결하라는 프롬프트가 표시됩니다."
        }
      },
      "extension": {
        "step1": {
          "title": "TokenPocket 확장 프로그램을 설치하세요",
          "description": "지갑에 빠르게 접근하기 위해 TokenPocket를 작업 표시줄에 고정하는 것을 추천합니다."
        },
        "step2": {
          "title": "지갑 생성 또는 가져오기",
          "description": "안전한 방법을 사용하여 지갑을 백업하세요. 절대로 비밀 문구를 다른 사람과 공유하지 마세요."
        },
        "step3": {
          "title": "브라우저 새로고침",
          "description": "지갑을 설정하면 아래를 클릭하여 브라우저를 새로고침하고 확장 프로그램을 로드합니다."
        }
      }
    },
    "trust": {
      "qr_code": {
        "step1": {
          "title": "Trust Wallet 앱을 열기",
          "description": "지갑에 빠르게 접근하기 위해 Trust Wallet을 홈 스크린에 두세요."
        },
        "step2": {
          "title": "지갑 생성 또는 가져오기",
          "description": "새로운 지갑을 생성하거나 기존의 것을 가져오세요."
        },
        "step3": {
          "title": "설정에서 WalletConnect를 탭하세요",
          "description": "새 연결을 선택한 다음 QR 코드를 스캔하고, 연결을 확인하는 프롬프트를 확인하세요."
        }
      },
      "extension": {
        "step1": {
          "title": "Trust Wallet 확장 프로그램을 설치하세요",
          "description": "브라우저의 오른쪽 상단을 클릭하고 Trust Wallet을 고정하여 쉽게 접근하세요."
        },
        "step2": {
          "title": "지갑 생성 또는 가져오기",
          "description": "새로운 지갑을 생성하거나 기존의 것을 가져오세요."
        },
        "step3": {
          "title": "브라우저를 새로고침하세요",
          "description": "Trust Wallet을 설정한 후 아래를 클릭하여 브라우저를 새로고침하고 확장 프로그램을 로드합니다."
        }
      }
    },
    "uniswap": {
      "qr_code": {
        "step1": {
          "title": "Uniswap 앱을 엽니다",
          "description": "Uniswap Wallet을 홈 화면에 추가하여 지갑에 더 빠르게 액세스하세요."
        },
        "step2": {
          "title": "지갑을 만들거나 가져오기",
          "description": "새 지갑을 생성하거나 기존의 것을 가져옵니다."
        },
        "step3": {
          "title": "QR 아이콘을 누르고 스캔하기",
          "description": "홈화면의 QR 아이콘을 누르고 코드를 스캔하고 프롬프트를 확인하여 연결하세요."
        }
      }
    },
    "zerion": {
      "qr_code": {
        "step1": {
          "title": "Zerion 앱을 엽니다",
          "description": "더 빠른 접근을 위해 Zerion을 홈 화면에 두는 것을 권장합니다."
        },
        "step2": {
          "title": "지갑 만들기 또는 가져오기",
          "description": "안전한 방법으로 지갑을 백업하세요. 절대로 비밀 구절을 누군가와 공유하지 마세요."
        },
        "step3": {
          "title": "스캔 버튼을 탭하세요",
          "description": "스캔 후 연결 프롬프트가 나타나 지갑을 연결하세요."
        }
      },
      "extension": {
        "step1": {
          "title": "Zerion 확장 프로그램을 설치하세요",
          "description": "지갑에 더 빠르게 접근할 수 있도록 Zerion을 작업 표시줄에 고정하는 것을 권장합니다."
        },
        "step2": {
          "title": "지갑 생성 또는 가져오기",
          "description": "안전한 방법을 사용하여 지갑을 백업하세요. 비밀 구문을 절대로 다른 사람과 공유하지 마세요."
        },
        "step3": {
          "title": "브라우저를 새로 고치세요",
          "description": "지갑을 설정한 후 아래를 클릭하여 브라우저를 새로고침하고 확장 프로그램을 로드하세요."
        }
      }
    },
    "rainbow": {
      "qr_code": {
        "step1": {
          "title": "Rainbow 앱 열기",
          "description": "지갑에 더 빠르게 접근하기 위해 홈 화면에 Rainbow를 두는 것을 추천합니다."
        },
        "step2": {
          "title": "지갑 생성 또는 가져오기",
          "description": "휴대폰에 있는 백업 기능을 사용하여 지갑을 쉽게 백업할 수 있습니다."
        },
        "step3": {
          "title": "스캔 버튼을 누르세요",
          "description": "스캔 후, 지갑을 연결하라는 연결 프롬프트가 나타납니다."
        }
      }
    },
    "enkrypt": {
      "extension": {
        "step1": {
          "description": "지갑에 더 빠르게 접근하기 위해 작업 표시줄에 Enkrypt Wallet를 고정하는 것을 추천합니다.",
          "title": "Enkrypt Wallet 확장 프로그램을 설치하세요"
        },
        "step2": {
          "description": "지갑을 안전한 방법으로 백업하세요. 절대로 비밀 문구를 다른 사람과 공유하지 마세요.",
          "title": "지갑 생성 또는 가져오기"
        },
        "step3": {
          "description": "지갑을 설정한 후에는 아래를 클릭하여 브라우저를 새로고침하고 확장 프로그램을 로드하세요.",
          "title": "브라우저 새로고침"
        }
      }
    },
    "frame": {
      "extension": {
        "step1": {
          "description": "지갑에 더 빠르게 접근할 수 있도록 Frame을 작업 표시줄에 고정하는 것을 추천합니다.",
          "title": "Frame 및 동반 확장 프로그램 설치"
        },
        "step2": {
          "description": "안전한 방법을 사용하여 지갑을 백업하세요. 절대로 비밀 구문을 다른 사람과 공유하지 마세요.",
          "title": "지갑 생성 또는 가져오기"
        },
        "step3": {
          "description": "지갑을 설정한 후에는 아래를 클릭하여 브라우저를 새로고침하고 확장 프로그램을 로드하세요.",
          "title": "브라우저 새로고침"
        }
      }
    },
    "one_key": {
      "extension": {
        "step1": {
          "title": "OneKey Wallet 확장 프로그램을 설치하세요",
          "description": "지갑에 빠르게 접근할 수 있도록 OneKey Wallet을 작업 표시줄에 고정하는 것을 권장합니다."
        },
        "step2": {
          "title": "지갑 생성 또는 불러오기",
          "description": "지갑을 안전한 방법으로 백업하세요. 절대로 비밀 문구를 다른 사람과 공유하지 마세요."
        },
        "step3": {
          "title": "브라우저를 새로고침 하세요",
          "description": "지갑을 설정한 후 아래를 클릭하여 브라우저를 새로고침하고 확장 프로그램을 로드하세요."
        }
      }
    },
    "phantom": {
      "extension": {
        "step1": {
          "title": "Phantom 확장 프로그램을 설치하세요",
          "description": "지갑에 더 쉽게 접근할 수 있도록 Phantom을 작업 표시줄에 고정하는 것을 권장합니다."
        },
        "step2": {
          "title": "지갑 생성 또는 불러오기",
          "description": "안전한 방법을 사용하여 지갑을 백업하세요. 절대로 누구와도 비밀 복구 구문을 공유하지 마세요."
        },
        "step3": {
          "title": "브라우저를 새로고침 하세요",
          "description": "지갑을 설정한 후 아래를 클릭하여 브라우저를 새로고침하고 확장 프로그램을 로드하세요."
        }
      }
    },
    "rabby": {
      "extension": {
        "step1": {
          "title": "Rabby 확장 프로그램을 설치하세요",
          "description": "지갑에 더 빠르게 액세스할 수 있도록 Rabby를 작업표시줄에 고정하는 것을 권장합니다."
        },
        "step2": {
          "title": "지갑 만들기 또는 가져오기",
          "description": "안전한 방법을 사용하여 지갑을 백업하세요. 절대로 누구와도 비밀 구문을 공유하지 마세요."
        },
        "step3": {
          "title": "브라우저를 새로고침 하세요",
          "description": "지갑 설정을 완료하면 아래를 클릭하여 브라우저를 새로고침하고 확장 프로그램을 로드합니다."
        }
      }
    },
    "safeheron": {
      "extension": {
        "step1": {
          "title": "코어 확장 프로그램 설치",
          "description": "지갑에 빠르게 액세스하기 위해 Safeheron을 작업 표시줄에 고정하는 것을 권장합니다."
        },
        "step2": {
          "title": "지갑 만들기 또는 가져오기",
          "description": "안전한 방법을 사용하여 지갑을 백업하세요. 비밀 문구를 절대 다른 사람과 공유하지 마세요."
        },
        "step3": {
          "title": "브라우저 새로고침",
          "description": "지갑 설정을 완료하면 아래를 클릭하여 브라우저를 새로고침하고 확장 프로그램을 로드합니다."
        }
      }
    },
    "taho": {
      "extension": {
        "step1": {
          "title": "Taho 확장 프로그램 설치",
          "description": "지갑에 더 빠르게 액세스하기 위해 Taho를 작업 표시줄에 고정하는 것을 추천합니다."
        },
        "step2": {
          "title": "지갑 생성 또는 가져오기",
          "description": "안전한 방법을 사용하여 지갑을 백업하세요. 결코 비밀 문구를 누군가와 공유하지 마세요."
        },
        "step3": {
          "title": "브라우저를 새로고침 하세요",
          "description": "지갑을 설정한 후 아래를 클릭하여 브라우저를 새로고침하고 확장 프로그램을 로드하세요."
        }
      }
    },
    "talisman": {
      "extension": {
        "step1": {
          "title": "탈리스만 확장 프로그램 설치",
          "description": "지갑에 더 빠르게 접근하기 위해 Talisman을 작업 표시줄에 고정하는 것을 추천합니다."
        },
        "step2": {
          "title": "이더리움 지갑 생성 또는 가져오기",
          "description": "반드시 안전한 방법을 사용하여 지갑을 백업하세요. 복구 문구를 누구와도 공유하지 마세요."
        },
        "step3": {
          "title": "브라우저를 새로고침 하세요",
          "description": "지갑을 설정 한 후 아래를 클릭하여 브라우저를 새로고침하고 확장 프로그램을 로드하세요."
        }
      }
    },
    "xdefi": {
      "extension": {
        "step1": {
          "title": "XDEFI 지갑 확장 프로그램을 설치하세요",
          "description": "지갑에 빠르게 액세스하기 위해 작업 표시줄에 XDEFI Wallet을 고정하는 것을 권장합니다."
        },
        "step2": {
          "title": "지갑을 만들거나 가져오기",
          "description": "반드시 안전한 방법을 사용하여 지갑을 백업하세요. 비밀 문구를 누구와도 공유하지 마세요."
        },
        "step3": {
          "title": "브라우저를 새로고침 하세요",
          "description": "지갑을 설정한 후 아래를 클릭하여 브라우저를 새로고침하고 확장 프로그램을 로드하세요."
        }
      }
    },
    "zeal": {
      "extension": {
        "step1": {
          "title": "Zeal 확장 프로그램을 설치하세요",
          "description": "월렛에 더 빠르게 액세스할 수 있도록 Zeal을 작업 표시 줄에 고정하는 것을 권장합니다."
        },
        "step2": {
          "title": "지갑 생성 또는 가져오기",
          "description": "안전한 방법을 사용하여 지갑을 백업하세요. 절대로 비밀 구문을 누구와도 공유하지 마세요."
        },
        "step3": {
          "title": "브라우저를 새로 고침하세요",
          "description": "지갑 설정을 마친 후 아래를 클릭하여 브라우저를 새로고침하고 확장 프로그램을 로드하세요."
        }
      }
    },
    "safepal": {
      "extension": {
        "step1": {
          "title": "SafePal Wallet 확장 프로그램을 설치하세요",
          "description": "브라우저의 오른쪽 상단에서 클릭하고 SafePal Wallet을 고정하여 쉽게 접근하세요."
        },
        "step2": {
          "title": "지갑을 만들거나 가져옵니다",
          "description": "새로운 지갑을 만들거나 기존의 지갑을 가져옵니다."
        },
        "step3": {
          "title": "브라우저를 새로 고침하세요",
          "description": "SafePal Wallet을 설정한 후에는 아래를 클릭하여 브라우저를 새로고침하고 확장 프로그램을 로드하세요."
        }
      },
      "qr_code": {
        "step1": {
          "title": "SafePal Wallet 앱을 여세요",
          "description": "월렛에 빠르게 액세스할 수 있도록 SafePal Wallet을 홈 화면에 두세요."
        },
        "step2": {
          "title": "지갑 생성 또는 가져오기",
          "description": "새로운 지갑을 만들거나 기존의 지갑을 가져옵니다."
        },
        "step3": {
          "title": "설정에서 WalletConnect를 탭하세요",
          "description": "새 연결을 선택하고 QR 코드를 스캔한 뒤, 연결하려는 프롬프트를 확인합니다."
        }
      }
    },
    "desig": {
      "extension": {
        "step1": {
          "title": "Desig 확장 프로그램 설치",
          "description": "당신의 지갑에 더 쉽게 접근하기 위해 작업 표시줄에 Desig을 고정하는 것을 권장합니다."
        },
        "step2": {
          "title": "지갑 생성",
          "description": "안전한 방법을 사용하여 지갑을 백업하세요. 절대로 비밀 구문을 누구와도 공유하지 마세요."
        },
        "step3": {
          "title": "브라우저를 새로 고침하세요",
          "description": "지갑 설정을 마친 후 아래를 클릭하여 브라우저를 새로고침하고 확장 프로그램을 로드하세요."
        }
      }
    },
    "subwallet": {
      "extension": {
        "step1": {
          "title": "SubWallet 확장 프로그램 설치",
          "description": "당신의 지갑에 더 빠르게 접근하기 위해 작업 표시줄에 SubWallet을 고정하는 것을 권장합니다."
        },
        "step2": {
          "title": "지갑 생성 또는 가져오기",
          "description": "반드시 안전한 방법을 사용하여 지갑을 백업하세요. 복구 문구를 누구와도 공유하지 마세요."
        },
        "step3": {
          "title": "브라우저를 새로 고침하세요",
          "description": "지갑 설정을 마친 후 아래를 클릭하여 브라우저를 새로고침하고 확장 프로그램을 로드하세요."
        }
      },
      "qr_code": {
        "step1": {
          "title": "SubWallet 앱 열기",
          "description": "더 빠른 접근을 위해 SubWallet을 홈 화면에 두는 것을 권장합니다."
        },
        "step2": {
          "title": "지갑 생성 또는 가져오기",
          "description": "안전한 방법을 사용하여 지갑을 백업하세요. 절대로 비밀 구문을 누구와도 공유하지 마세요."
        },
        "step3": {
          "title": "스캔 버튼을 누릅니다",
          "description": "스캔 후에 지갑을 연결하기 위한 연결 요청이 표시됩니다."
        }
      }
    },
    "clv": {
      "extension": {
        "step1": {
          "title": "CLV Wallet 확장 프로그램 설치",
          "description": "당신의 지갑에 더 빠르게 접근하기 위해 작업 표시줄에 CLV Wallet을 고정하는 것을 권장합니다."
        },
        "step2": {
          "title": "지갑 생성 또는 가져오기",
          "description": "안전한 방법을 사용하여 지갑을 백업하세요. 절대로 비밀 구문을 누구와도 공유하지 마세요."
        },
        "step3": {
          "title": "브라우저를 새로 고침하세요",
          "description": "지갑 설정을 마친 후 아래를 클릭하여 브라우저를 새로고침하고 확장 프로그램을 로드하세요."
        }
      },
      "qr_code": {
        "step1": {
          "title": "CLV Wallet 앱을 엽니다",
          "description": "더 빠른 접근을 위해 CLV Wallet을 홈 화면에 놓는 것이 좋습니다."
        },
        "step2": {
          "title": "지갑 생성 또는 가져오기",
          "description": "안전한 방법을 사용하여 지갑을 백업하세요. 절대로 비밀 구문을 누구와도 공유하지 마세요."
        },
        "step3": {
          "title": "스캔 버튼을 누릅니다",
          "description": "스캔 후에 지갑을 연결하기 위한 연결 요청이 표시됩니다."
        }
      }
    },
    "okto": {
      "qr_code": {
        "step1": {
          "title": "Okto 앱을 엽니다",
          "description": "빠른 접근을 위해 Okto를 홈 화면에 추가합니다"
        },
        "step2": {
          "title": "MPC Wallet을 만듭니다",
          "description": "계정을 만들고 지갑을 생성합니다"
        },
        "step3": {
          "title": "설정에서 WalletConnect를 탭하세요",
          "description": "오른쪽 상단의 QR 아이콘을 탭하고 연결하려면 알림을 확인합니다."
        }
      }
    },
    "ledger": {
      "desktop": {
        "step1": {
          "title": "Ledger Live 앱을 엽니다",
          "description": "빠른 접근을 위해 Ledger Live를 홈화면에 두는 것을 권장합니다."
        },
        "step2": {
          "title": "Ledger 설정",
          "description": "새 Ledger를 설정하거나 기존 Ledger에 연결하세요."
        },
        "step3": {
          "title": "연결",
          "description": "스캔 후 연결 요청이 나타나며, 이를 통해 지갑을 연결할 수 있습니다."
        }
      },
      "qr_code": {
        "step1": {
          "title": "Ledger Live 앱을 엽니다",
          "description": "빠른 접근을 위해 Ledger Live를 홈화면에 두는 것을 권장합니다."
        },
        "step2": {
          "title": "Ledger 설정",
          "description": "데스크톱 앱과 동기화하거나 Ledger를 연결할 수 있습니다."
        },
        "step3": {
          "title": "코드를 스캔하세요",
          "description": "WalletConnect를 탭하고 스캐너로 전환합니다. 스캔 후 연결 요청이 나타나며, 이를 통해 지갑을 연결할 수 있습니다."
        }
      }
    }
  }
}
`;const nn=Object.freeze(Object.defineProperty({__proto__:null,default:En},Symbol.toStringTag,{value:"Module"}));var tn=`{
  "connect_wallet": {
    "label": "Conectar Carteira"
  },
  "intro": {
    "title": "O que é uma Carteira?",
    "description": "Uma carteira é usada para enviar, receber, armazenar e exibir ativos digitais. Também é uma nova forma de se conectar, sem precisar criar novas contas e senhas em todo site.",
    "digital_asset": {
      "title": "Um lar para seus ativos digitais",
      "description": "Carteiras são usadas para enviar, receber, armazenar e exibir ativos digitais como Ethereum e NFTs."
    },
    "login": {
      "title": "Uma nova maneira de fazer login",
      "description": "Em vez de criar novas contas e senhas em todos os sites, basta conectar sua carteira."
    },
    "get": {
      "label": "Obter uma Carteira"
    },
    "learn_more": {
      "label": "Saiba mais"
    }
  },
  "sign_in": {
    "label": "Verifique sua conta",
    "description": "Para concluir a conexão, você deve assinar uma mensagem em sua carteira para confirmar que você é o proprietário desta conta.",
    "message": {
      "send": "Enviar mensagem",
      "preparing": "Preparando mensagem...",
      "cancel": "Cancelar",
      "preparing_error": "Erro ao preparar a mensagem, tente novamente!"
    },
    "signature": {
      "waiting": "Aguardando assinatura...",
      "verifying": "Verificando assinatura...",
      "signing_error": "Erro ao assinar a mensagem, tente novamente!",
      "verifying_error": "Erro ao verificar assinatura, tente novamente!",
      "oops_error": "Ops, algo deu errado!"
    }
  },
  "connect": {
    "label": "Conectar",
    "title": "Conectar uma Carteira",
    "new_to_ethereum": {
      "description": "Novo nas carteiras Ethereum?",
      "learn_more": {
        "label": "Saiba mais"
      }
    },
    "learn_more": {
      "label": "Saiba mais"
    },
    "recent": "Recente",
    "status": {
      "opening": "Abrindo %{wallet}...",
      "connecting": "Conectando",
      "connect_mobile": "Continue em %{wallet}",
      "not_installed": "%{wallet} não está instalado",
      "not_available": "%{wallet} não está disponível",
      "confirm": "Confirme a conexão na extensão",
      "confirm_mobile": "Aceite o pedido de conexão na carteira"
    },
    "secondary_action": {
      "get": {
        "description": "Não tem %{wallet}?",
        "label": "OBTER"
      },
      "install": {
        "label": "INSTALAR"
      },
      "retry": {
        "label": "TENTAR DE NOVO"
      }
    },
    "walletconnect": {
      "description": {
        "full": "Precisa do modal oficial do WalletConnect?",
        "compact": "Precisa do modal WalletConnect?"
      },
      "open": {
        "label": "ABRIR"
      }
    }
  },
  "connect_scan": {
    "title": "Digitalize com %{wallet}",
    "fallback_title": "Digitalize com o seu telefone"
  },
  "connector_group": {
    "recommended": "Recomendado",
    "other": "Outro",
    "popular": "Popular",
    "more": "Mais",
    "others": "Outros"
  },
  "get": {
    "title": "Obter uma Carteira",
    "action": {
      "label": "OBTER"
    },
    "mobile": {
      "description": "Carteira Móvel"
    },
    "extension": {
      "description": "Extensão do Navegador"
    },
    "mobile_and_extension": {
      "description": "Carteira Móvel e Extensão"
    },
    "mobile_and_desktop": {
      "description": "Carteira para Mobile e Desktop"
    },
    "looking_for": {
      "title": "Não é o que você está procurando?",
      "mobile": {
        "description": "Selecione uma carteira na tela principal para começar com um provedor de carteira diferente."
      },
      "desktop": {
        "compact_description": "Selecione uma carteira na tela principal para começar com um provedor de carteira diferente.",
        "wide_description": "Selecione uma carteira à esquerda para começar com um provedor de carteira diferente."
      }
    }
  },
  "get_options": {
    "title": "Comece com %{wallet}",
    "short_title": "Obtenha %{wallet}",
    "mobile": {
      "title": "%{wallet} para Móvel",
      "description": "Use a carteira móvel para explorar o mundo do Ethereum.",
      "download": {
        "label": "Baixe o aplicativo"
      }
    },
    "extension": {
      "title": "%{wallet} para %{browser}",
      "description": "Acesse sua carteira diretamente do seu navegador web favorito.",
      "download": {
        "label": "Adicionar ao %{browser}"
      }
    },
    "desktop": {
      "title": "%{wallet} para %{platform}",
      "description": "Acesse sua carteira nativamente do seu desktop poderoso.",
      "download": {
        "label": "Adicionar ao %{platform}"
      }
    }
  },
  "get_mobile": {
    "title": "Instale %{wallet}",
    "description": "Escaneie com seu celular para baixar no iOS ou Android",
    "continue": {
      "label": "Continuar"
    }
  },
  "get_instructions": {
    "mobile": {
      "connect": {
        "label": "Conectar"
      },
      "learn_more": {
        "label": "Saiba mais"
      }
    },
    "extension": {
      "refresh": {
        "label": "Atualizar"
      },
      "learn_more": {
        "label": "Saiba mais"
      }
    },
    "desktop": {
      "connect": {
        "label": "Conectar"
      },
      "learn_more": {
        "label": "Saiba mais"
      }
    }
  },
  "chains": {
    "title": "Mudar Redes",
    "wrong_network": "Rede errada detectada, mude ou desconecte para continuar.",
    "confirm": "Confirme na Carteira",
    "switching_not_supported": "Sua carteira não suporta a mudança de redes de %{appName}. Tente mudar de redes dentro da sua carteira.",
    "switching_not_supported_fallback": "Sua carteira não suporta a troca de redes a partir deste aplicativo. Tente trocar de rede dentro de sua carteira.",
    "disconnect": "Desconectar",
    "connected": "Conectado"
  },
  "profile": {
    "disconnect": {
      "label": "Desconectar"
    },
    "copy_address": {
      "label": "Copiar Endereço",
      "copied": "Copiado!"
    },
    "explorer": {
      "label": "Veja mais no explorador"
    },
    "transactions": {
      "description": "%{appName} transações aparecerão aqui...",
      "description_fallback": "Suas transações aparecerão aqui...",
      "recent": {
        "title": "Transações Recentes"
      },
      "clear": {
        "label": "Limpar Tudo"
      }
    }
  },
  "wallet_connectors": {
    "argent": {
      "qr_code": {
        "step1": {
          "description": "Coloque o Argent na tela inicial para um acesso mais rápido à sua carteira.",
          "title": "Abra o aplicativo Argent"
        },
        "step2": {
          "description": "Crie uma carteira e nome de usuário, ou importe uma carteira existente.",
          "title": "Criar ou Importar uma Carteira"
        },
        "step3": {
          "description": "Depois que você escanear, um prompt de conexão aparecerá para você conectar sua carteira.",
          "title": "Toque no botão Scan QR"
        }
      }
    },
    "bifrost": {
      "qr_code": {
        "step1": {
          "description": "Recomendamos colocar a Bifrost Wallet na sua tela inicial para um acesso mais rápido.",
          "title": "Abra o aplicativo Bifrost Wallet"
        },
        "step2": {
          "description": "Crie ou importe uma carteira usando sua frase de recuperação.",
          "title": "Criar ou Importar uma Carteira"
        },
        "step3": {
          "description": "Após você escanear, um prompt de conexão aparecerá para você conectar sua carteira.",
          "title": "Toque no botão de escanear"
        }
      }
    },
    "bitget": {
      "qr_code": {
        "step1": {
          "description": "Recomendamos colocar a Bitget Wallet na sua tela inicial para um acesso mais rápido.",
          "title": "Abra o aplicativo Bitget Wallet"
        },
        "step2": {
          "description": "Certifique-se de fazer backup de sua carteira usando um método seguro. Nunca compartilhe sua frase secreta com ninguém.",
          "title": "Criar ou Importar uma Carteira"
        },
        "step3": {
          "description": "Depois de escanear, um prompt de conexão aparecerá para você conectar sua carteira.",
          "title": "Toque no botão de escaneamento"
        }
      },
      "extension": {
        "step1": {
          "description": "Recomendamos fixar a Bitget Wallet na sua barra de tarefas para um acesso mais rápido à sua carteira.",
          "title": "Instale a extensão da Carteira Bitget"
        },
        "step2": {
          "description": "Certifique-se de fazer o backup da sua carteira usando um método seguro. Nunca compartilhe sua frase secreta com ninguém.",
          "title": "Criar ou Importar uma Carteira"
        },
        "step3": {
          "description": "Depois de configurar sua carteira, clique abaixo para atualizar o navegador e carregar a extensão.",
          "title": "Atualize seu navegador"
        }
      }
    },
    "bitski": {
      "extension": {
        "step1": {
          "description": "Recomendamos fixar o Bitski na sua barra de tarefas para um acesso mais rápido à sua carteira.",
          "title": "Instale a extensão Bitski"
        },
        "step2": {
          "description": "Certifique-se de fazer backup de sua carteira usando um método seguro. Nunca compartilhe sua frase secreta com ninguém.",
          "title": "Criar ou Importar uma Carteira"
        },
        "step3": {
          "description": "Depois de configurar sua carteira, clique abaixo para atualizar o navegador e carregar a extensão.",
          "title": "Atualize seu navegador"
        }
      }
    },
    "coin98": {
      "qr_code": {
        "step1": {
          "description": "Recomendamos colocar a Carteira Coin98 na tela inicial para um acesso mais rápido à sua carteira.",
          "title": "Abra o aplicativo Carteira Coin98"
        },
        "step2": {
          "description": "Você pode facilmente fazer backup de sua carteira usando nosso recurso de backup em seu telefone.",
          "title": "Criar ou Importar uma Carteira"
        },
        "step3": {
          "description": "Depois de escanear, uma solicitação de conexão aparecerá para você conectar sua carteira.",
          "title": "Toque no botão WalletConnect"
        }
      },
      "extension": {
        "step1": {
          "description": "Clique no canto superior direito do seu navegador e fixe a Carteira Coin98 para fácil acesso.",
          "title": "Instale a extensão da Carteira Coin98"
        },
        "step2": {
          "description": "Crie uma nova carteira ou importe uma existente.",
          "title": "Criar ou Importar uma carteira"
        },
        "step3": {
          "description": "Depois de configurar a Carteira Coin98, clique abaixo para atualizar o navegador e carregar a extensão.",
          "title": "Atualize seu navegador"
        }
      }
    },
    "coinbase": {
      "qr_code": {
        "step1": {
          "description": "Recomendamos colocar a Carteira Coinbase na tela inicial para um acesso mais rápido.",
          "title": "Abra o aplicativo Coinbase Wallet"
        },
        "step2": {
          "description": "Você pode fazer backup da sua carteira facilmente usando o recurso de backup na nuvem.",
          "title": "Criar ou Importar uma Carteira"
        },
        "step3": {
          "description": "Depois de escanear, um prompt de conexão aparecerá para que você conecte sua carteira.",
          "title": "Toque no botão de escanear"
        }
      },
      "extension": {
        "step1": {
          "description": "Recomendamos fixar o Coinbase Wallet na sua barra de tarefas para um acesso mais rápido à sua carteira.",
          "title": "Instale a extensão Coinbase Wallet"
        },
        "step2": {
          "description": "Certifique-se de fazer backup da sua carteira usando um método seguro. Nunca compartilhe sua frase secreta com ninguém.",
          "title": "Criar ou Importar uma Carteira"
        },
        "step3": {
          "description": "Uma vez que você configurou sua carteira, clique abaixo para atualizar o navegador e carregar a extensão.",
          "title": "Atualize seu navegador"
        }
      }
    },
    "core": {
      "qr_code": {
        "step1": {
          "description": "Recomendamos colocar o Core na tela inicial para um acesso mais rápido à sua carteira.",
          "title": "Abra o aplicativo Core"
        },
        "step2": {
          "description": "Você pode facilmente salvar sua carteira usando nosso recurso de backup no seu celular.",
          "title": "Criar ou Importar uma Carteira"
        },
        "step3": {
          "description": "Depois de escanear, um prompt de conexão aparecerá para você conectar sua carteira.",
          "title": "Toque no botão WalletConnect"
        }
      },
      "extension": {
        "step1": {
          "description": "Recomendamos fixar o Core na sua barra de tarefas para um acesso mais rápido à sua carteira.",
          "title": "Instale a extensão Core"
        },
        "step2": {
          "description": "Certifique-se de fazer backup da sua carteira usando um método seguro. Nunca compartilhe sua frase secreta com ninguém.",
          "title": "Criar ou Importar uma Carteira"
        },
        "step3": {
          "description": "Depois de configurar sua carteira, clique abaixo para atualizar o navegador e carregar a extensão.",
          "title": "Atualize seu navegador"
        }
      }
    },
    "fox": {
      "qr_code": {
        "step1": {
          "description": "Recomendamos colocar o FoxWallet na tela inicial para um acesso mais rápido.",
          "title": "Abra o aplicativo FoxWallet"
        },
        "step2": {
          "description": "Certifique-se de fazer backup de sua carteira usando um método seguro. Nunca compartilhe sua frase secreta com ninguém.",
          "title": "Criar ou Importar uma Carteira"
        },
        "step3": {
          "description": "Depois de escanear, uma solicitação de conexão aparecerá para você conectar sua carteira.",
          "title": "Toque no botão de escaneamento"
        }
      }
    },
    "frontier": {
      "qr_code": {
        "step1": {
          "description": "Recomendamos colocar o Frontier Wallet na tela inicial para um acesso mais rápido.",
          "title": "Abra o aplicativo Frontier Wallet"
        },
        "step2": {
          "description": "Certifique-se de fazer backup de sua carteira usando um método seguro. Nunca compartilhe sua frase secreta com ninguém.",
          "title": "Criar ou Importar uma Carteira"
        },
        "step3": {
          "description": "Depois de escanear, aparecerá um prompt de conexão para você conectar sua carteira.",
          "title": "Toque no botão de varredura"
        }
      },
      "extension": {
        "step1": {
          "description": "Recomendamos fixar a Carteira Frontier na sua barra de tarefas para um acesso mais rápido à sua carteira.",
          "title": "Instale a extensão da Carteira Frontier"
        },
        "step2": {
          "description": "Certifique-se de fazer backup da sua carteira usando um método seguro. Nunca compartilhe sua frase secreta com ninguém.",
          "title": "Criar ou Importar uma Carteira"
        },
        "step3": {
          "description": "Depois de configurar sua carteira, clique abaixo para atualizar o navegador e carregar a extensão.",
          "title": "Atualize seu navegador"
        }
      }
    },
    "im_token": {
      "qr_code": {
        "step1": {
          "title": "Abra o aplicativo imToken",
          "description": "Coloque o aplicativo imToken na tela inicial para um acesso mais rápido à sua carteira."
        },
        "step2": {
          "title": "Criar ou Importar uma Carteira",
          "description": "Crie uma nova carteira ou importe uma existente."
        },
        "step3": {
          "title": "Toque no ícone do Scanner no canto superior direito",
          "description": "Escolha Nova Conexão, em seguida, escaneie o código QR e confirme o prompt para conectar."
        }
      }
    },
    "metamask": {
      "qr_code": {
        "step1": {
          "title": "Abra o aplicativo MetaMask",
          "description": "Recomendamos colocar o MetaMask na tela inicial para um acesso mais rápido."
        },
        "step2": {
          "title": "Criar ou Importar uma Carteira",
          "description": "Certifique-se de fazer backup de sua carteira usando um método seguro. Nunca compartilhe sua frase secreta com ninguém."
        },
        "step3": {
          "title": "Toque no botão escanear",
          "description": "Depois de escanear, aparecerá um prompt de conexão para você conectar sua carteira."
        }
      },
      "extension": {
        "step1": {
          "title": "Instale a extensão MetaMask",
          "description": "Recomendamos fixar o MetaMask na barra de tarefas para um acesso mais rápido à sua carteira."
        },
        "step2": {
          "title": "Criar ou Importar uma Carteira",
          "description": "Certifique-se de fazer backup da sua carteira usando um método seguro. Nunca compartilhe sua frase secreta com ninguém."
        },
        "step3": {
          "title": "Atualize o seu navegador",
          "description": "Depois de configurar sua carteira, clique abaixo para atualizar o navegador e carregar a extensão."
        }
      }
    },
    "okx": {
      "qr_code": {
        "step1": {
          "title": "Abra o aplicativo da Carteira OKX",
          "description": "Recomendamos colocar a Carteira OKX na tela inicial para um acesso mais rápido."
        },
        "step2": {
          "title": "Criar ou Importar uma Carteira",
          "description": "Certifique-se de fazer o backup da sua carteira utilizando um método seguro. Nunca compartilhe sua frase secreta com ninguém."
        },
        "step3": {
          "title": "Toque no botão de digitalização",
          "description": "Depois de escanear, aparecerá um prompt de conexão para você conectar sua carteira."
        }
      },
      "extension": {
        "step1": {
          "title": "Instale a extensão OKX Wallet",
          "description": "Recomendamos fixar a OKX Wallet na sua barra de tarefas para um acesso mais rápido à sua carteira."
        },
        "step2": {
          "title": "Criar ou Importar uma Carteira",
          "description": "Certifique-se de fazer o backup da sua carteira utilizando um método seguro. Nunca compartilhe sua frase secreta com ninguém."
        },
        "step3": {
          "title": "Atualize o seu navegador",
          "description": "Uma vez que você configurou sua carteira, clique abaixo para atualizar o navegador e carregar a extensão."
        }
      }
    },
    "omni": {
      "qr_code": {
        "step1": {
          "title": "Abra o aplicativo Omni",
          "description": "Adicione o Omni à sua tela inicial para um acesso mais rápido à sua carteira."
        },
        "step2": {
          "title": "Criar ou Importar uma Carteira",
          "description": "Crie uma nova carteira ou importe uma existente."
        },
        "step3": {
          "title": "Toque no ícone do QR e escaneie",
          "description": "Toque no ícone QR na tela inicial, escaneie o código e confirme o prompt para conectar."
        }
      }
    },
    "token_pocket": {
      "qr_code": {
        "step1": {
          "title": "Abra o aplicativo TokenPocket",
          "description": "Recomendamos colocar o TokenPocket na tela inicial para um acesso mais rápido."
        },
        "step2": {
          "title": "Criar ou Importar uma Carteira",
          "description": "Certifique-se de fazer backup de sua carteira usando um método seguro. Nunca compartilhe sua frase secreta com ninguém."
        },
        "step3": {
          "title": "Toque no botão de digitalização",
          "description": "Depois de escanear, aparecerá um prompt de conexão para você conectar sua carteira."
        }
      },
      "extension": {
        "step1": {
          "title": "Instale a extensão TokenPocket",
          "description": "Recomendamos fixar o TokenPocket em sua barra de tarefas para um acesso mais rápido à sua carteira."
        },
        "step2": {
          "title": "Criar ou Importar uma Carteira",
          "description": "Certifique-se de fazer backup de sua carteira usando um método seguro. Nunca compartilhe sua frase secreta com ninguém."
        },
        "step3": {
          "title": "Atualize seu navegador",
          "description": "Uma vez que você configurou sua carteira, clique abaixo para atualizar o navegador e carregar a extensão."
        }
      }
    },
    "trust": {
      "qr_code": {
        "step1": {
          "title": "Abra o aplicativo Trust Wallet",
          "description": "Coloque o Trust Wallet na tela inicial para um acesso mais rápido à sua carteira."
        },
        "step2": {
          "title": "Criar ou Importar uma Carteira",
          "description": "Crie uma nova carteira ou importe uma existente."
        },
        "step3": {
          "title": "Toque em WalletConnect nas Configurações",
          "description": "Escolha Nova Conexão, depois escaneie o QR code e confirme o prompt para se conectar."
        }
      },
      "extension": {
        "step1": {
          "title": "Instale a extensão Trust Wallet",
          "description": "Clique no canto superior direito do seu navegador e marque Trust Wallet para fácil acesso."
        },
        "step2": {
          "title": "Crie ou Importe uma carteira",
          "description": "Crie uma nova carteira ou importe uma existente."
        },
        "step3": {
          "title": "Atualize seu navegador",
          "description": "Depois que configurar a Trust Wallet, clique abaixo para atualizar o navegador e carregar a extensão."
        }
      }
    },
    "uniswap": {
      "qr_code": {
        "step1": {
          "title": "Abra o aplicativo Uniswap",
          "description": "Adicione a Carteira Uniswap à sua tela inicial para um acesso mais rápido à sua carteira."
        },
        "step2": {
          "title": "Criar ou Importar uma Carteira",
          "description": "Crie uma nova carteira ou importe uma existente."
        },
        "step3": {
          "title": "Toque no ícone QR e escaneie",
          "description": "Toque no ícone QR na sua tela inicial, escaneie o código e confirme o prompt para conectar."
        }
      }
    },
    "zerion": {
      "qr_code": {
        "step1": {
          "title": "Abra o aplicativo Zerion",
          "description": "Recomendamos colocar o Zerion na sua tela inicial para um acesso mais rápido."
        },
        "step2": {
          "title": "Criar ou Importar uma Carteira",
          "description": "Certifique-se de fazer backup da sua carteira usando um método seguro. Nunca compartilhe sua frase secreta com ninguém."
        },
        "step3": {
          "title": "Toque no botão de digitalização",
          "description": "Depois de digitalizar, um prompt de conexão aparecerá para que você possa conectar sua carteira."
        }
      },
      "extension": {
        "step1": {
          "title": "Instale a extensão Zerion",
          "description": "Recomendamos fixar o Zerion na sua barra de tarefas para um acesso mais rápido à sua carteira."
        },
        "step2": {
          "title": "Criar ou Importar uma Carteira",
          "description": "Certifique-se de fazer backup da sua carteira usando um método seguro. Nunca compartilhe sua frase secreta com ninguém."
        },
        "step3": {
          "title": "Atualize seu navegador",
          "description": "Depois de configurar sua carteira, clique abaixo para atualizar o navegador e carregar a extensão."
        }
      }
    },
    "rainbow": {
      "qr_code": {
        "step1": {
          "title": "Abra o aplicativo Rainbow",
          "description": "Recomendamos colocar o Rainbow na tela inicial para um acesso mais rápido à sua carteira."
        },
        "step2": {
          "title": "Criar ou Importar uma Carteira",
          "description": "Você pode facilmente fazer backup da sua carteira usando nosso recurso de backup no seu telefone."
        },
        "step3": {
          "title": "Toque no botão de digitalizar",
          "description": "Depois de escanear, uma solicitação de conexão aparecerá para você conectar sua carteira."
        }
      }
    },
    "enkrypt": {
      "extension": {
        "step1": {
          "description": "Recomendamos fixar a Carteira Enkrypt na sua barra de tarefas para um acesso mais rápido à sua carteira.",
          "title": "Instale a extensão da Carteira Enkrypt"
        },
        "step2": {
          "description": "Certifique-se de fazer backup da sua carteira usando um método seguro. Nunca compartilhe sua frase secreta com ninguém.",
          "title": "Criar ou Importar uma Carteira"
        },
        "step3": {
          "description": "Depois de configurar sua carteira, clique abaixo para atualizar o navegador e carregar a extensão.",
          "title": "Atualize o seu navegador"
        }
      }
    },
    "frame": {
      "extension": {
        "step1": {
          "description": "Recomendamos fixar o Frame na sua barra de tarefas para um acesso mais rápido à sua carteira.",
          "title": "Instale o Frame e a extensão complementar"
        },
        "step2": {
          "description": "Certifique-se de fazer backup da sua carteira usando um método seguro. Nunca compartilhe sua frase secreta com ninguém.",
          "title": "Criar ou Importar uma Carteira"
        },
        "step3": {
          "description": "Depois de configurar sua carteira, clique abaixo para atualizar o navegador e carregar a extensão.",
          "title": "Atualize seu navegador"
        }
      }
    },
    "one_key": {
      "extension": {
        "step1": {
          "title": "Instale a extensão OneKey Wallet",
          "description": "Recomendamos fixar a OneKey Wallet na sua barra de tarefas para um acesso mais rápido à sua carteira."
        },
        "step2": {
          "title": "Criar ou Importar uma Carteira",
          "description": "Certifique-se de fazer backup de sua carteira usando um método seguro. Nunca compartilhe sua frase secreta com ninguém."
        },
        "step3": {
          "title": "Atualize seu navegador",
          "description": "Uma vez que você configurou sua carteira, clique abaixo para atualizar o navegador e carregar a extensão."
        }
      }
    },
    "phantom": {
      "extension": {
        "step1": {
          "title": "Instale a extensão Phantom",
          "description": "Recomendamos fixar o Phantom na sua barra de tarefas para facilitar o acesso à sua carteira."
        },
        "step2": {
          "title": "Criar ou Importar uma Carteira",
          "description": "Certifique-se de fazer backup de sua carteira usando um método seguro. Nunca compartilhe sua frase secreta de recuperação com ninguém."
        },
        "step3": {
          "title": "Atualize seu navegador",
          "description": "Depois de configurar sua carteira, clique abaixo para atualizar o navegador e carregar a extensão."
        }
      }
    },
    "rabby": {
      "extension": {
        "step1": {
          "title": "Instale a extensão Rabby",
          "description": "Recomendamos fixar Rabby na sua barra de tarefas para um acesso mais rápido à sua carteira."
        },
        "step2": {
          "title": "Criar ou Importar uma Carteira",
          "description": "Certifique-se de fazer backup da sua carteira usando um método seguro. Nunca compartilhe sua frase secreta com ninguém."
        },
        "step3": {
          "title": "Atualize seu navegador",
          "description": "Depois de configurar sua carteira, clique abaixo para atualizar o navegador e carregar a extensão."
        }
      }
    },
    "safeheron": {
      "extension": {
        "step1": {
          "title": "Instale a extensão Core",
          "description": "Recomendamos fixar Safeheron na sua barra de tarefas para um acesso mais rápido à sua carteira."
        },
        "step2": {
          "title": "Criar ou Importar uma Carteira",
          "description": "Certifique-se de fazer o backup da sua carteira usando um método seguro. Nunca compartilhe sua frase secreta com ninguém."
        },
        "step3": {
          "title": "Atualize seu navegador",
          "description": "Depois de configurar sua carteira, clique abaixo para atualizar o navegador e carregar a extensão."
        }
      }
    },
    "taho": {
      "extension": {
        "step1": {
          "title": "Instale a extensão Taho",
          "description": "Recomendamos fixar o Taho na sua barra de tarefas para um acesso mais rápido à sua carteira."
        },
        "step2": {
          "title": "Criar ou Importar uma Carteira",
          "description": "Certifique-se de fazer o backup da sua carteira usando um método seguro. Nunca compartilhe sua frase secreta com ninguém."
        },
        "step3": {
          "title": "Atualize seu navegador",
          "description": "Depois de configurar sua carteira, clique abaixo para atualizar o navegador e carregar a extensão."
        }
      }
    },
    "talisman": {
      "extension": {
        "step1": {
          "title": "Instale a extensão Talisman",
          "description": "Recomendamos fixar o Talisman na sua barra de tarefas para um acesso mais rápido à sua carteira."
        },
        "step2": {
          "title": "Crie ou Importe uma Carteira Ethereum",
          "description": "Certifique-se de fazer backup de sua carteira usando um método seguro. Nunca compartilhe sua frase de recuperação com ninguém."
        },
        "step3": {
          "title": "Atualize o seu navegador",
          "description": "Depois de configurar sua carteira, clique abaixo para atualizar o navegador e carregar a extensão."
        }
      }
    },
    "xdefi": {
      "extension": {
        "step1": {
          "title": "Instale a extensão XDEFI Wallet",
          "description": "Recomendamos fixar a Carteira XDEFI na sua barra de tarefas para um acesso mais rápido à sua carteira."
        },
        "step2": {
          "title": "Criar ou Importar uma Carteira",
          "description": "Certifique-se de fazer backup de sua carteira usando um método seguro. Nunca compartilhe sua frase secreta com ninguém."
        },
        "step3": {
          "title": "Atualize seu navegador",
          "description": "Depois de configurar sua carteira, clique abaixo para atualizar o navegador e carregar a extensão."
        }
      }
    },
    "zeal": {
      "extension": {
        "step1": {
          "title": "Instale a extensão Zeal",
          "description": "Recomendamos fixar o Zeal na sua barra de tarefas para um acesso mais rápido à sua carteira."
        },
        "step2": {
          "title": "Criar ou Importar uma Carteira",
          "description": "Certifique-se de fazer backup de sua carteira usando um método seguro. Nunca compartilhe sua frase secreta com ninguém."
        },
        "step3": {
          "title": "Atualize seu navegador",
          "description": "Depois de configurar sua carteira, clique abaixo para atualizar o navegador e carregar a extensão."
        }
      }
    },
    "safepal": {
      "extension": {
        "step1": {
          "title": "Instale a extensão da Carteira SafePal",
          "description": "Clique no canto superior direito do seu navegador e fixe a Carteira SafePal para fácil acesso."
        },
        "step2": {
          "title": "Criar ou Importar uma carteira",
          "description": "Crie uma nova carteira ou importe uma existente."
        },
        "step3": {
          "title": "Atualize seu navegador",
          "description": "Depois de configurar a Carteira SafePal, clique abaixo para atualizar o navegador e carregar a extensão."
        }
      },
      "qr_code": {
        "step1": {
          "title": "Abra o aplicativo Carteira SafePal",
          "description": "Coloque a Carteira SafePal na tela inicial para um acesso mais rápido à sua carteira."
        },
        "step2": {
          "title": "Criar ou Importar uma Carteira",
          "description": "Crie uma nova carteira ou importe uma existente."
        },
        "step3": {
          "title": "Toque em WalletConnect nas Configurações",
          "description": "Escolha Nova Conexão, em seguida, escaneie o código QR e confirme o prompt para conectar."
        }
      }
    },
    "desig": {
      "extension": {
        "step1": {
          "title": "Instale a extensão Desig",
          "description": "Recomendamos fixar Desig na sua barra de tarefas para facilitar o acesso à sua carteira."
        },
        "step2": {
          "title": "Criar uma Carteira",
          "description": "Certifique-se de fazer backup de sua carteira usando um método seguro. Nunca compartilhe sua frase secreta com ninguém."
        },
        "step3": {
          "title": "Atualize seu navegador",
          "description": "Depois de configurar sua carteira, clique abaixo para atualizar o navegador e carregar a extensão."
        }
      }
    },
    "subwallet": {
      "extension": {
        "step1": {
          "title": "Instale a extensão SubWallet",
          "description": "Recomendamos fixar SubWallet na sua barra de tarefas para acesso mais rápido à sua carteira."
        },
        "step2": {
          "title": "Criar ou Importar uma Carteira",
          "description": "Certifique-se de fazer backup de sua carteira usando um método seguro. Nunca compartilhe sua frase de recuperação com ninguém."
        },
        "step3": {
          "title": "Atualize seu navegador",
          "description": "Depois de configurar sua carteira, clique abaixo para atualizar o navegador e carregar a extensão."
        }
      },
      "qr_code": {
        "step1": {
          "title": "Abra o aplicativo SubWallet",
          "description": "Recomendamos colocar SubWallet na tela inicial para acesso mais rápido."
        },
        "step2": {
          "title": "Criar ou Importar uma Carteira",
          "description": "Certifique-se de fazer backup de sua carteira usando um método seguro. Nunca compartilhe sua frase secreta com ninguém."
        },
        "step3": {
          "title": "Toque no botão de escanear",
          "description": "Depois que você escanear, um prompt de conexão aparecerá para você conectar sua carteira."
        }
      }
    },
    "clv": {
      "extension": {
        "step1": {
          "title": "Instale a extensão CLV Wallet",
          "description": "Recomendamos fixar CLV Wallet na sua barra de tarefas para acesso mais rápido à sua carteira."
        },
        "step2": {
          "title": "Criar ou Importar uma Carteira",
          "description": "Certifique-se de fazer backup de sua carteira usando um método seguro. Nunca compartilhe sua frase secreta com ninguém."
        },
        "step3": {
          "title": "Atualize seu navegador",
          "description": "Depois de configurar sua carteira, clique abaixo para atualizar o navegador e carregar a extensão."
        }
      },
      "qr_code": {
        "step1": {
          "title": "Abra o aplicativo da carteira CLV",
          "description": "Recomendamos colocar a Carteira CLV na tela inicial para acesso mais rápido."
        },
        "step2": {
          "title": "Criar ou Importar uma Carteira",
          "description": "Certifique-se de fazer backup de sua carteira usando um método seguro. Nunca compartilhe sua frase secreta com ninguém."
        },
        "step3": {
          "title": "Toque no botão de escanear",
          "description": "Depois que você escanear, um prompt de conexão aparecerá para você conectar sua carteira."
        }
      }
    },
    "okto": {
      "qr_code": {
        "step1": {
          "title": "Abra o aplicativo Okto",
          "description": "Adicione Okto à sua tela inicial para acesso rápido"
        },
        "step2": {
          "title": "Crie uma carteira MPC",
          "description": "Crie uma conta e gere uma carteira"
        },
        "step3": {
          "title": "Toque em WalletConnect nas Configurações",
          "description": "Toque no ícone Scan QR no canto superior direito e confirme o prompt para conectar."
        }
      }
    },
    "ledger": {
      "desktop": {
        "step1": {
          "title": "Abra o aplicativo Ledger Live",
          "description": "Recomendamos colocar o Ledger Live na tela inicial para um acesso mais rápido."
        },
        "step2": {
          "title": "Configure seu Ledger",
          "description": "Configure um novo Ledger ou conecte-se a um já existente."
        },
        "step3": {
          "title": "Conectar",
          "description": "Depois de escanear, aparecerá um prompt de conexão para você conectar sua carteira."
        }
      },
      "qr_code": {
        "step1": {
          "title": "Abra o aplicativo Ledger Live",
          "description": "Recomendamos colocar o Ledger Live na tela inicial para um acesso mais rápido."
        },
        "step2": {
          "title": "Configure seu Ledger",
          "description": "Você pode sincronizar com o aplicativo de desktop ou conectar seu Ledger."
        },
        "step3": {
          "title": "Escanear o código",
          "description": "Toque em WalletConnect e em seguida mude para Scanner. Depois de escanear, aparecerá um prompt de conexão para você conectar sua carteira."
        }
      }
    }
  }
}
`;const an=Object.freeze(Object.defineProperty({__proto__:null,default:tn},Symbol.toStringTag,{value:"Module"}));var ln=`{
  "connect_wallet": {
    "label": "Подключить кошелек"
  },
  "intro": {
    "title": "Что такое кошелек?",
    "description": "Кошелек используется для отправки, получения, хранения и отображения цифровых активов. Это также новый способ входа в систему, без необходимости создания новых учетных записей и паролей на каждом сайте.",
    "digital_asset": {
      "title": "Дом для ваших цифровых активов",
      "description": "Кошельки используются для отправки, получения, хранения и отображения цифровых активов, таких как Ethereum и NFT."
    },
    "login": {
      "title": "Новый способ входа в систему",
      "description": "Вместо создания новых аккаунтов и паролей на каждом сайте, просто подключите ваш кошелек."
    },
    "get": {
      "label": "Получить кошелек"
    },
    "learn_more": {
      "label": "Узнать больше"
    }
  },
  "sign_in": {
    "label": "Проверьте ваш аккаунт",
    "description": "Чтобы завершить подключение, вы должны подписать сообщение в вашем кошельке, чтобы подтвердить, что вы являетесь владельцем этого аккаунта.",
    "message": {
      "send": "Отправить сообщение",
      "preparing": "Подготовка сообщения...",
      "cancel": "Отмена",
      "preparing_error": "Ошибка при подготовке сообщения, пожалуйста, попробуйте снова!"
    },
    "signature": {
      "waiting": "Ожидание подписи...",
      "verifying": "Проверка подписи...",
      "signing_error": "Ошибка при подписании сообщения, пожалуйста, попробуйте снова!",
      "verifying_error": "Ошибка при проверке подписи, пожалуйста, попробуйте снова!",
      "oops_error": "Ой, что-то пошло не так!"
    }
  },
  "connect": {
    "label": "Подключить",
    "title": "Подключить кошелек",
    "new_to_ethereum": {
      "description": "Впервые столкнулись с кошельками Ethereum?",
      "learn_more": {
        "label": "Узнать больше"
      }
    },
    "learn_more": {
      "label": "Узнать больше"
    },
    "recent": "Недавние",
    "status": {
      "opening": "Открывается %{wallet}...",
      "connecting": "Подключение",
      "connect_mobile": "Продолжить в %{wallet}",
      "not_installed": "%{wallet} не установлен",
      "not_available": "%{wallet} не доступен",
      "confirm": "Подтвердите подключение в расширении",
      "confirm_mobile": "Принять запрос на подключение в кошельке"
    },
    "secondary_action": {
      "get": {
        "description": "У вас нет %{wallet}?",
        "label": "ПОЛУЧИТЬ"
      },
      "install": {
        "label": "УСТАНОВИТЬ"
      },
      "retry": {
        "label": "ПОВТОРИТЬ"
      }
    },
    "walletconnect": {
      "description": {
        "full": "Нужен официальный модальный окно WalletConnect?",
        "compact": "Нужен модальный окно WalletConnect?"
      },
      "open": {
        "label": "ОТКРЫТЬ"
      }
    }
  },
  "connect_scan": {
    "title": "Сканировать с помощью %{wallet}",
    "fallback_title": "Сканировать с помощью вашего телефона"
  },
  "connector_group": {
    "recommended": "Рекомендуемые",
    "other": "Другие",
    "popular": "Популярные",
    "more": "Больше",
    "others": "Другие"
  },
  "get": {
    "title": "Получить кошелек",
    "action": {
      "label": "ПОЛУЧИТЬ"
    },
    "mobile": {
      "description": "Мобильный кошелек"
    },
    "extension": {
      "description": "Расширение для браузера"
    },
    "mobile_and_extension": {
      "description": "Мобильный кошелек и расширение"
    },
    "mobile_and_desktop": {
      "description": "Мобильный и настольный кошелек"
    },
    "looking_for": {
      "title": "Не то, что вы ищете?",
      "mobile": {
        "description": "Выберите кошелек на главном экране, чтобы начать работу с другим провайдером кошелька."
      },
      "desktop": {
        "compact_description": "Выберите кошелек на главном экране, чтобы начать работу с другим провайдером кошелька.",
        "wide_description": "Выберите кошелек слева, чтобы начать работу с другим провайдером кошелька."
      }
    }
  },
  "get_options": {
    "title": "Начните с %{wallet}",
    "short_title": "Получить %{wallet}",
    "mobile": {
      "title": "%{wallet} для мобильных",
      "description": "Используйте мобильный кошелек для исследования мира Ethereum.",
      "download": {
        "label": "Скачать приложение"
      }
    },
    "extension": {
      "title": "%{wallet} для %{browser}",
      "description": "Доступ к вашему кошельку прямо из вашего любимого веб-браузера.",
      "download": {
        "label": "Добавить в %{browser}"
      }
    },
    "desktop": {
      "title": "%{wallet} для %{platform}",
      "description": "Получите доступ к вашему кошельку нативно со своего мощного рабочего стола.",
      "download": {
        "label": "Добавить в %{platform}"
      }
    }
  },
  "get_mobile": {
    "title": "Установить %{wallet}",
    "description": "Отсканируйте на своем телефоне для скачивания на iOS или Android",
    "continue": {
      "label": "Продолжить"
    }
  },
  "get_instructions": {
    "mobile": {
      "connect": {
        "label": "Подключить"
      },
      "learn_more": {
        "label": "Узнать больше"
      }
    },
    "extension": {
      "refresh": {
        "label": "Обновить"
      },
      "learn_more": {
        "label": "Узнать больше"
      }
    },
    "desktop": {
      "connect": {
        "label": "Подключить"
      },
      "learn_more": {
        "label": "Узнать больше"
      }
    }
  },
  "chains": {
    "title": "Переключить сети",
    "wrong_network": "Обнаружена неверная сеть, переключитесь или отключитесь для продолжения.",
    "confirm": "Подтвердить в кошельке",
    "switching_not_supported": "Ваш кошелек не поддерживает переключение сетей с %{appName}. Попробуйте переключить сети из вашего кошелька.",
    "switching_not_supported_fallback": "Ваш кошелек не поддерживает переключение сетей из этого приложения. Попробуйте переключить сети из вашего кошелька.",
    "disconnect": "Отключить",
    "connected": "Подключено"
  },
  "profile": {
    "disconnect": {
      "label": "Отключить"
    },
    "copy_address": {
      "label": "Скопировать адрес",
      "copied": "Скопировано!"
    },
    "explorer": {
      "label": "Посмотреть больше в эксплорере"
    },
    "transactions": {
      "description": "%{appName} транзакции появятся здесь...",
      "description_fallback": "Ваши транзакции появятся здесь...",
      "recent": {
        "title": "Недавние транзакции"
      },
      "clear": {
        "label": "Очистить все"
      }
    }
  },
  "wallet_connectors": {
    "argent": {
      "qr_code": {
        "step1": {
          "description": "Добавьте Argent на домашний экран для более быстрого доступа к вашему кошельку.",
          "title": "Откройте приложение Argent"
        },
        "step2": {
          "description": "Создайте кошелек и имя пользователя или импортируйте существующий кошелек.",
          "title": "Создать или Импортировать кошелек"
        },
        "step3": {
          "description": "После сканирования появится запрос на подключение для подключения вашего кошелька.",
          "title": "Нажмите кнопку Сканировать QR"
        }
      }
    },
    "bifrost": {
      "qr_code": {
        "step1": {
          "description": "Мы рекомендуем добавить кошелек Bifrost на ваш начальный экран для более быстрого доступа.",
          "title": "Откройте приложение Bifrost Wallet"
        },
        "step2": {
          "description": "Создайте или импортируйте кошелек, используя вашу фразу восстановления.",
          "title": "Создать или импортировать кошелек"
        },
        "step3": {
          "description": "После сканирования появится запрос на подключение вашего кошелька.",
          "title": "Нажмите кнопку сканирования"
        }
      }
    },
    "bitget": {
      "qr_code": {
        "step1": {
          "description": "Мы рекомендуем добавить Bitget Wallet на ваш экран для более быстрого доступа.",
          "title": "Откройте приложение Bitget Wallet"
        },
        "step2": {
          "description": "Обязательно сделайте резервную копию вашего кошелька с использованием безопасного метода. Никогда не делитесь своей секретной фразой с кем-либо.",
          "title": "Создать или импортировать кошелек"
        },
        "step3": {
          "description": "После сканирования появится запрос на подключение вашего кошелька.",
          "title": "Нажмите кнопку сканирования"
        }
      },
      "extension": {
        "step1": {
          "description": "Мы рекомендуем закрепить Bitget Wallet на панели задач для более быстрого доступа к вашему кошельку.",
          "title": "Установите расширение Bitget Wallet"
        },
        "step2": {
          "description": "Обязательно сохраните резервную копию вашего кошелька с помощью надёжного метода. Никогда не делитесь своей секретной фразой с кем-либо.",
          "title": "Создать или Импортировать кошелек"
        },
        "step3": {
          "description": "После настройки вашего кошелька, нажмите ниже, чтобы обновить браузер и загрузить расширение.",
          "title": "Обновите ваш браузер"
        }
      }
    },
    "bitski": {
      "extension": {
        "step1": {
          "description": "Мы рекомендуем прикрепить Bitski к вашей панели задач для более быстрого доступа к вашему кошельку.",
          "title": "Установите расширение Bitski"
        },
        "step2": {
          "description": "Обязательно сохраните резервную копию вашего кошелька с использованием безопасного метода. Никогда не делитесь своей секретной фразой с кем-либо.",
          "title": "Создать кошелек или Импортировать кошелек"
        },
        "step3": {
          "description": "После того как вы настроите свой кошелек, нажмите ниже, чтобы обновить браузер и загрузить расширение.",
          "title": "Обновите ваш браузер"
        }
      }
    },
    "coin98": {
      "qr_code": {
        "step1": {
          "description": "Мы рекомендуем добавить Coin98 Wallet на ваш главный экран для более быстрого доступа к вашему кошельку.",
          "title": "Откройте приложение Coin98 Wallet"
        },
        "step2": {
          "description": "Вы можете легко сделать резервную копию вашего кошелька, используя нашу функцию резервного копирования на вашем телефоне.",
          "title": "Создать или импортировать кошелек"
        },
        "step3": {
          "description": "После сканирования для вас появится запрос на подключение, чтобы подключить ваш кошелек.",
          "title": "Нажмите кнопку WalletConnect"
        }
      },
      "extension": {
        "step1": {
          "description": "Нажмите в верхнем правом углу вашего браузера и закрепите Coin98 Wallet для удобного доступа.",
          "title": "Установите расширение Coin98 Wallet"
        },
        "step2": {
          "description": "Создайте новый кошелек или импортируйте существующий.",
          "title": "Создайте или импортируйте кошелек"
        },
        "step3": {
          "description": "После того как вы настроите Кошелек Coin98, нажмите ниже, чтобы обновить браузер и загрузить расширение.",
          "title": "Обновите ваш браузер"
        }
      }
    },
    "coinbase": {
      "qr_code": {
        "step1": {
          "description": "Мы рекомендуем добавить Coinbase Wallet на ваш экран начала для более быстрого доступа.",
          "title": "Откройте приложение Coinbase Wallet"
        },
        "step2": {
          "description": "Вы легко можете сделать резервную копию вашего кошелька, используя функцию облачного резервного копирования.",
          "title": "Создать или Импортировать кошелек"
        },
        "step3": {
          "description": "После сканирования появится запрос на подключение для подключения вашего кошелька.",
          "title": "Нажмите кнопку сканирования"
        }
      },
      "extension": {
        "step1": {
          "description": "Мы рекомендуем закрепить Coinbase Wallet на вашей панели задач для более быстрого доступа к вашему кошельку.",
          "title": "Установите расширение Coinbase Wallet"
        },
        "step2": {
          "description": "Обязательно сделайте резервную копию вашего кошелька с использованием безопасного метода. Никогда не делитесь своей секретной фразой с кем-либо.",
          "title": "Создать или Импортировать кошелек"
        },
        "step3": {
          "description": "После настройки вашего кошелька, нажмите ниже, чтобы обновить браузер и загрузить расширение.",
          "title": "Обновите ваш браузер"
        }
      }
    },
    "core": {
      "qr_code": {
        "step1": {
          "description": "Мы рекомендуем добавить Core на ваш экран быстрого доступа для ускоренного доступа к вашему кошельку.",
          "title": "Открыть приложение Core"
        },
        "step2": {
          "description": "Вы можете легко создать резервную копию вашего кошелька, используя нашу функцию резервного копирования на вашем телефоне.",
          "title": "Создать или Импортировать кошелек"
        },
        "step3": {
          "description": "После сканирования появится запрос на подключение, чтобы вы могли подключить ваш кошелек.",
          "title": "Нажмите кнопку WalletConnect"
        }
      },
      "extension": {
        "step1": {
          "description": "Мы рекомендуем закрепить Core на панели задач для более быстрого доступа к вашему кошельку.",
          "title": "Установите расширение Core"
        },
        "step2": {
          "description": "Обязательно создайте резервную копию вашего кошелька с использованием безопасного метода. Никогда не делитесь вашей секретной фразой с кем-либо.",
          "title": "Создать или Импортировать кошелек"
        },
        "step3": {
          "description": "Как только вы настроите ваш кошелек, нажмите ниже, чтобы обновить браузер и загрузить расширение.",
          "title": "Обновите ваш браузер"
        }
      }
    },
    "fox": {
      "qr_code": {
        "step1": {
          "description": "Мы рекомендуем поместить FoxWallet на ваш экран начального экрана для более быстрого доступа.",
          "title": "Откройте приложение FoxWallet"
        },
        "step2": {
          "description": "Обязательно сделайте резервное копирование вашего кошелька с использованием безопасного метода. Никогда не делитесь своей секретной фразой с кем-либо.",
          "title": "Создать или Импортировать кошелек"
        },
        "step3": {
          "description": "После сканирования появится приглашение для подключения вашего кошелька.",
          "title": "Нажмите кнопку сканирования"
        }
      }
    },
    "frontier": {
      "qr_code": {
        "step1": {
          "description": "Мы рекомендуем установить Frontier Wallet на экран вашего смартфона для более быстрого доступа.",
          "title": "Откройте приложение Frontier Wallet"
        },
        "step2": {
          "description": "Обязательно сделайте резервное копирование вашего кошелька с использованием безопасного метода. Никогда не делитесь своей секретной фразой с кем-либо.",
          "title": "Создать или Импортировать кошелек"
        },
        "step3": {
          "description": "После сканирования появится запрос на подключение кошелька.",
          "title": "Нажмите кнопку сканирования"
        }
      },
      "extension": {
        "step1": {
          "description": "Мы рекомендуем прикрепить кошелек Frontier к панели задач для более быстрого доступа к вашему кошельку.",
          "title": "Установите расширение кошелька Frontier"
        },
        "step2": {
          "description": "Обязательно сделайте резервную копию своего кошелька с использованием надежного метода. Никогда не делитесь своей секретной фразой с кем-либо.",
          "title": "Создать или импортировать кошелек"
        },
        "step3": {
          "description": "После настройки вашего кошелька нажмите ниже, чтобы обновить браузер и загрузить расширение.",
          "title": "Обновите ваш браузер"
        }
      }
    },
    "im_token": {
      "qr_code": {
        "step1": {
          "title": "Откройте приложение imToken",
          "description": "Поместите приложение imToken на главный экран для более быстрого доступа к вашему кошельку."
        },
        "step2": {
          "title": "Создать или импортировать кошелек",
          "description": "Создайте новый кошелек или импортируйте существующий."
        },
        "step3": {
          "title": "Нажмите на иконку сканера в верхнем правом углу",
          "description": "Выберите Новое соединение, затем отсканируйте QR-код и подтвердите запрос на соединение."
        }
      }
    },
    "metamask": {
      "qr_code": {
        "step1": {
          "title": "Откройте приложение MetaMask",
          "description": "Мы рекомендуем поместить MetaMask на главный экран для быстрого доступа."
        },
        "step2": {
          "title": "Создайте или импортируйте кошелек",
          "description": "Обязательно сохраните копию своего кошелька с помощью надежного метода. Никогда не делитесь своей секретной фразой с кем бы то ни было."
        },
        "step3": {
          "title": "Нажмите кнопку сканирования",
          "description": "После сканирования появится запрос на соединение вашего кошелька."
        }
      },
      "extension": {
        "step1": {
          "title": "Установите расширение MetaMask",
          "description": "Мы рекомендуем закрепить MetaMask на вашей панели задач для более быстрого доступа к вашему кошельку."
        },
        "step2": {
          "title": "Создать или импортировать кошелек",
          "description": "Обязательно сохраните резервную копию вашего кошелька с помощью безопасного метода. Никогда не делитесь своей секретной фразой с кем-либо."
        },
        "step3": {
          "title": "Обновите ваш браузер",
          "description": "После настройки вашего кошелька, щелкните ниже, чтобы обновить браузер и загрузить расширение."
        }
      }
    },
    "okx": {
      "qr_code": {
        "step1": {
          "title": "Откройте приложение кошелька OKX",
          "description": "Мы рекомендуем разместить кошелек OKX на вашем главном экране для более быстрого доступа."
        },
        "step2": {
          "title": "Создать или импортировать кошелек",
          "description": "Обязательно сохраните резервную копию вашего кошелька с помощью безопасного метода. Никогда не делитесь своей секретной фразой с кем-либо."
        },
        "step3": {
          "title": "Нажмите на кнопку сканирования",
          "description": "После сканирования появится запрос на подключение вашего кошелька."
        }
      },
      "extension": {
        "step1": {
          "title": "Установите расширение кошелька OKX",
          "description": "Мы рекомендуем закрепить OKX Wallet на панели задач для более быстрого доступа к вашему кошельку."
        },
        "step2": {
          "title": "Создать кошелек или импортировать кошелек",
          "description": "Обязательно сохраните резервную копию вашего кошелька с помощью безопасного метода. Никогда не делитесь своей секретной фразой с кем-либо."
        },
        "step3": {
          "title": "Обновите ваш браузер",
          "description": "Как только вы настроите свой кошелек, нажмите ниже, чтобы обновить браузер и загрузить расширение."
        }
      }
    },
    "omni": {
      "qr_code": {
        "step1": {
          "title": "Откройте приложение Omni",
          "description": "Добавьте Omni на свой домашний экран для более быстрого доступа к вашему кошельку."
        },
        "step2": {
          "title": "Создать или импортировать кошелек",
          "description": "Создайте новый кошелек или импортируйте существующий."
        },
        "step3": {
          "title": "Нажмите на иконку QR и отсканируйте",
          "description": "Нажмите на иконку QR на вашем домашнем экране, отсканируйте код и подтвердите подсказку, чтобы подключиться."
        }
      }
    },
    "token_pocket": {
      "qr_code": {
        "step1": {
          "title": "Откройте приложение TokenPocket",
          "description": "Мы рекомендуем разместить TokenPocket на вашем домашнем экране для быстрого доступа."
        },
        "step2": {
          "title": "Создать или Импортировать кошелек",
          "description": "Обязательно сделайте резервную копию вашего кошелька при помощи безопасного метода. Никогда не делитесь своим секретным кодом с кем-либо."
        },
        "step3": {
          "title": "Нажмите на кнопку сканирования",
          "description": "После сканирования появится подсказка о подключении для подключения вашего кошелька."
        }
      },
      "extension": {
        "step1": {
          "title": "Установите расширение TokenPocket",
          "description": "Мы рекомендуем закрепить TokenPocket на вашей панели задач для более быстрого доступа к вашему кошельку."
        },
        "step2": {
          "title": "Создать или Импортировать кошелек",
          "description": "Обязательно создайте резервную копию вашего кошелька с помощью безопасного метода. Никогда не делитесь своей секретной фразой с кем-либо."
        },
        "step3": {
          "title": "Обновите ваш браузер",
          "description": "После того как вы настроите свой кошелек, нажмите ниже, чтобы обновить браузер и загрузить расширение."
        }
      }
    },
    "trust": {
      "qr_code": {
        "step1": {
          "title": "Откройте приложение Trust Wallet",
          "description": "Разместите Trust Wallet на вашем домашнем экране для более быстрого доступа к вашему кошельку."
        },
        "step2": {
          "title": "Создать или Импортировать кошелек",
          "description": "Создайте новый кошелек или импортируйте существующий."
        },
        "step3": {
          "title": "Нажмите WalletConnect в настройках",
          "description": "Выберите Новое соединение, затем сканируйте QR-код и подтвердите запрос на подключение."
        }
      },
      "extension": {
        "step1": {
          "title": "Установите расширение Trust Wallet",
          "description": "Кликните в правом верхнем углу вашего браузера и закрепите Trust Wallet для легкого доступа."
        },
        "step2": {
          "title": "Создайте или импортируйте кошелек",
          "description": "Создайте новый кошелек или импортируйте существующий."
        },
        "step3": {
          "title": "Обновите ваш браузер",
          "description": "После настройки Trust Wallet, нажмите ниже, чтобы обновить браузер и загрузить расширение."
        }
      }
    },
    "uniswap": {
      "qr_code": {
        "step1": {
          "title": "Откройте приложение Uniswap",
          "description": "Добавьте кошелек Uniswap на главный экран для быстрого доступа к вашему кошельку."
        },
        "step2": {
          "title": "Создать или импортировать кошелек",
          "description": "Создайте новый кошелек или импортируйте существующий."
        },
        "step3": {
          "title": "Нажмите на иконку QR и отсканируйте",
          "description": "Нажмите на иконку QR на главном экране, отсканируйте код и подтвердите запрос на подключение."
        }
      }
    },
    "zerion": {
      "qr_code": {
        "step1": {
          "title": "Откройте приложение Zerion",
          "description": "Мы рекомендуем разместить Zerion на главном экране для более быстрого доступа."
        },
        "step2": {
          "title": "Создать или импортировать кошелек",
          "description": "Обязательно создайте резервную копию вашего кошелька с помощью безопасного метода. Никогда не делитесь своей секретной фразой с кем-либо."
        },
        "step3": {
          "title": "Нажмите кнопку сканирования",
          "description": "После сканирования вам будет предложено подключить ваш кошелек."
        }
      },
      "extension": {
        "step1": {
          "title": "Установите расширение Zerion",
          "description": "Мы рекомендуем прикрепить Zerion к вашей панели задач для более быстрого доступа к вашему кошельку."
        },
        "step2": {
          "title": "Создайте или импортируйте кошелек",
          "description": "Обязательно сделайте резервную копию вашего кошелька с помощью безопасного метода. Никогда не делясь своим секретным паролем с кем-либо."
        },
        "step3": {
          "title": "Обновите ваш браузер",
          "description": "Как только вы настроите свой кошелек, нажмите ниже, чтобы обновить браузер и загрузить расширение."
        }
      }
    },
    "rainbow": {
      "qr_code": {
        "step1": {
          "title": "Откройте приложение Rainbow",
          "description": "Мы рекомендуем поместить Rainbow на ваш экран главного меню для более быстрого доступа к вашему кошельку."
        },
        "step2": {
          "title": "Создайте или импортируйте кошелек",
          "description": "Вы можете легко сделать резервную копию вашего кошелька с помощью нашей функции резервного копирования на вашем телефоне."
        },
        "step3": {
          "title": "Нажмите кнопку сканировать",
          "description": "После сканирования появится запрос на подключение вашего кошелька."
        }
      }
    },
    "enkrypt": {
      "extension": {
        "step1": {
          "description": "Мы рекомендуем закрепить Enkrypt Wallet на панели задач для более быстрого доступа к вашему кошельку.",
          "title": "Установите расширение Enkrypt Wallet"
        },
        "step2": {
          "description": "Обязательно сделайте резервную копию вашего кошелька с использованием безопасного метода. Никогда не делитесь своей секретной фразой с кем-либо.",
          "title": "Создать или импортировать кошелек"
        },
        "step3": {
          "description": "Как только вы настроите свой кошелек, нажмите ниже, чтобы обновить браузер и загрузить расширение.",
          "title": "Обновите ваш браузер"
        }
      }
    },
    "frame": {
      "extension": {
        "step1": {
          "description": "Мы рекомендуем закрепить Frame на панели задач для более быстрого доступа к вашему кошельку.",
          "title": "Установите Frame и дополнительное расширение"
        },
        "step2": {
          "description": "Обязательно создайте резервную копию вашего кошелька с помощью безопасного метода. Никогда не делитесь своей секретной фразой с кем-либо.",
          "title": "Создайте или Импортируйте кошелек"
        },
        "step3": {
          "description": "После того как вы настроите свой кошелек, нажмите ниже, чтобы обновить браузер и загрузить расширение.",
          "title": "Обновите ваш браузер"
        }
      }
    },
    "one_key": {
      "extension": {
        "step1": {
          "title": "Установите расширение OneKey Wallet",
          "description": "Мы рекомендуем закрепить OneKey Wallet на панели задач для более быстрого доступа к вашему кошельку."
        },
        "step2": {
          "title": "Создайте или Импортируйте кошелек",
          "description": "Обязательно сделайте резервную копию вашего кошелька с помощью безопасного метода. Никогда не делитесь своей секретной фразой с кем-либо."
        },
        "step3": {
          "title": "Обновите ваш браузер",
          "description": "После настройки кошелька нажмите ниже, чтобы обновить браузер и загрузить расширение."
        }
      }
    },
    "phantom": {
      "extension": {
        "step1": {
          "title": "Установите расширение Phantom",
          "description": "Мы рекомендуем закрепить Phantom на панели задач для более удобного доступа к вашему кошельку."
        },
        "step2": {
          "title": "Создать или Импортировать кошелек",
          "description": "Обязательно сделайте резервную копию вашего кошелька с помощью безопасного метода. Никогда не делитесь своей секретной фразой восстановления с кем-либо."
        },
        "step3": {
          "title": "Обновите ваш браузер",
          "description": "После того как вы настроите свой кошелек, нажмите ниже, чтобы обновить браузер и загрузить расширение."
        }
      }
    },
    "rabby": {
      "extension": {
        "step1": {
          "title": "Установите расширение Rabby",
          "description": "Мы рекомендуем закрепить Rabby на панели задач для более быстрого доступа к вашему кошельку."
        },
        "step2": {
          "title": "Создать или импортировать кошелек",
          "description": "Обязательно сделайте резервную копию вашего кошелька с помощью безопасного метода. Никогда не делитесь своей секретной фразой с кем бы то ни было."
        },
        "step3": {
          "title": "Обновите ваш браузер",
          "description": "После настройки вашего кошелька, нажмите ниже, чтобы обновить браузер и загрузить расширение."
        }
      }
    },
    "safeheron": {
      "extension": {
        "step1": {
          "title": "Установите основное расширение",
          "description": "Мы рекомендуем закрепить SafeHeron на панели задач для более быстрого доступа к вашему кошельку."
        },
        "step2": {
          "title": "Создать или импортировать кошелек",
          "description": "Обязательно сделайте резервную копию вашего кошелька с использованием безопасного метода. Никогда не делитесь своей секретной фразой с кем-либо."
        },
        "step3": {
          "title": "Обновите ваш браузер",
          "description": "После того, как вы настроите ваш кошелек, нажмите ниже, чтобы обновить браузер и загрузить расширение."
        }
      }
    },
    "taho": {
      "extension": {
        "step1": {
          "title": "Установите расширение Taho",
          "description": "Мы рекомендуем закрепить Taho на вашей панели задач для более быстрого доступа к вашему кошельку."
        },
        "step2": {
          "title": "Создать или импортировать кошелек",
          "description": "Обязательно сделайте резервную копию вашего кошелька с использованием безопасного метода. Никогда не делитесь своей секретной фразой с кем-либо."
        },
        "step3": {
          "title": "Обновите ваш браузер",
          "description": "После настройки вашего кошелька, нажмите ниже, чтобы обновить браузер и загрузить расширение."
        }
      }
    },
    "talisman": {
      "extension": {
        "step1": {
          "title": "Установите расширение Talisman",
          "description": "Мы рекомендуем закрепить Talisman на вашей панели задач для более быстрого доступа к вашему кошельку."
        },
        "step2": {
          "title": "Создайте или импортируйте кошелек Ethereum",
          "description": "Обязательно сделайте резервную копию вашего кошелька с помощью безопасного метода. Никогда не делитесь вашей фразой восстановления с кем-либо."
        },
        "step3": {
          "title": "Обновите ваш браузер",
          "description": "После настройки вашего кошелька, нажмите ниже, чтобы обновить браузер и загрузить расширение."
        }
      }
    },
    "xdefi": {
      "extension": {
        "step1": {
          "title": "Установите расширение кошелька XDEFI",
          "description": "Мы рекомендуем закрепить XDEFI Wallet на панели задач для более быстрого доступа к вашему кошельку."
        },
        "step2": {
          "title": "Создать или Импортировать кошелек",
          "description": "Обязательно создайте резервную копию вашего кошелька с помощью безопасного метода. Никогда не делитесь своей секретной фразой с кем-либо."
        },
        "step3": {
          "title": "Обновите ваш браузер",
          "description": "После того, как вы настроите свой кошелек, нажмите ниже, чтобы обновить браузер и загрузить расширение."
        }
      }
    },
    "zeal": {
      "extension": {
        "step1": {
          "title": "Установите расширение Zeal",
          "description": "Мы рекомендуем закрепить Zeal на панели задач для быстрого доступа к вашему кошельку."
        },
        "step2": {
          "title": "Создать или Импортировать кошелек",
          "description": "Обязательно сделайте резервную копию вашего кошелька с использованием безопасного метода. Никогда не делитесь своей секретной фразой с кем-либо."
        },
        "step3": {
          "title": "Обновите ваш браузер",
          "description": "После настройки вашего кошелька, нажмите ниже, чтобы обновить браузер и загрузить расширение."
        }
      }
    },
    "safepal": {
      "extension": {
        "step1": {
          "title": "Установите расширение SafePal Wallet",
          "description": "Кликните в верхнем правом углу вашего браузера и закрепите SafePal Wallet для удобного доступа."
        },
        "step2": {
          "title": "Создайте или импортируйте кошелек",
          "description": "Создайте новый кошелек или импортируйте существующий."
        },
        "step3": {
          "title": "Обновите ваш браузер",
          "description": "После настройки кошелька SafePal нажмите ниже, чтобы обновить браузер и загрузить расширение."
        }
      },
      "qr_code": {
        "step1": {
          "title": "Откройте приложение SafePal Wallet",
          "description": "Разместите SafePal Wallet на главном экране для более быстрого доступа к вашему кошельку."
        },
        "step2": {
          "title": "Создать или Импортировать кошелек",
          "description": "Создайте новый кошелек или импортируйте существующий."
        },
        "step3": {
          "title": "Нажмите WalletConnect в настройках",
          "description": "Выберите Новое соединение, затем отсканируйте QR-код и подтвердите запрос на соединение."
        }
      }
    },
    "desig": {
      "extension": {
        "step1": {
          "title": "Установите расширение Desig",
          "description": "Мы рекомендуем закрепить Desig на вашей панели задач для более удобного доступа к вашему кошельку."
        },
        "step2": {
          "title": "Создать кошелек",
          "description": "Обязательно сделайте резервную копию вашего кошелька с использованием безопасного метода. Никогда не делитесь своей секретной фразой с кем-либо."
        },
        "step3": {
          "title": "Обновите ваш браузер",
          "description": "После настройки вашего кошелька, нажмите ниже, чтобы обновить браузер и загрузить расширение."
        }
      }
    },
    "subwallet": {
      "extension": {
        "step1": {
          "title": "Установите расширение SubWallet",
          "description": "Мы рекомендуем закрепить SubWallet на вашей панели задач для более быстрого доступа к вашему кошельку."
        },
        "step2": {
          "title": "Создать или Импортировать кошелек",
          "description": "Обязательно сделайте резервную копию вашего кошелька с помощью безопасного метода. Никогда не делитесь вашей фразой восстановления с кем-либо."
        },
        "step3": {
          "title": "Обновите ваш браузер",
          "description": "После настройки вашего кошелька, нажмите ниже, чтобы обновить браузер и загрузить расширение."
        }
      },
      "qr_code": {
        "step1": {
          "title": "Откройте приложение SubWallet",
          "description": "Мы рекомендуем добавить SubWallet на ваш экран начальной страницы для более быстрого доступа."
        },
        "step2": {
          "title": "Создать или Импортировать кошелек",
          "description": "Обязательно сделайте резервную копию вашего кошелька с использованием безопасного метода. Никогда не делитесь своей секретной фразой с кем-либо."
        },
        "step3": {
          "title": "Нажмите кнопку сканирования",
          "description": "После сканирования появится запрос на подключение для подключения вашего кошелька."
        }
      }
    },
    "clv": {
      "extension": {
        "step1": {
          "title": "Установите расширение CLV Wallet",
          "description": "Мы рекомендуем закрепить CLV Wallet на вашей панели задач для более быстрого доступа к вашему кошельку."
        },
        "step2": {
          "title": "Создать или Импортировать кошелек",
          "description": "Обязательно сделайте резервную копию вашего кошелька с использованием безопасного метода. Никогда не делитесь своей секретной фразой с кем-либо."
        },
        "step3": {
          "title": "Обновите ваш браузер",
          "description": "После настройки вашего кошелька, нажмите ниже, чтобы обновить браузер и загрузить расширение."
        }
      },
      "qr_code": {
        "step1": {
          "title": "Откройте приложение CLV Wallet",
          "description": "Мы рекомендуем поместить CLV Wallet на ваш экран домой для более быстрого доступа."
        },
        "step2": {
          "title": "Создать или Импортировать кошелек",
          "description": "Обязательно сделайте резервную копию вашего кошелька с использованием безопасного метода. Никогда не делитесь своей секретной фразой с кем-либо."
        },
        "step3": {
          "title": "Нажмите кнопку сканирования",
          "description": "После сканирования появится запрос на подключение для подключения вашего кошелька."
        }
      }
    },
    "okto": {
      "qr_code": {
        "step1": {
          "title": "Откройте приложение Okto",
          "description": "Добавьте Okto на ваш экран домой для быстрого доступа"
        },
        "step2": {
          "title": "Создать кошелек MPC",
          "description": "Создайте учетную запись и сгенерируйте кошелек"
        },
        "step3": {
          "title": "Нажмите WalletConnect в настройках",
          "description": "Коснитесь значка Scan QR в верхнем правом углу и подтвердите запрос на подключение."
        }
      }
    },
    "ledger": {
      "desktop": {
        "step1": {
          "title": "Откройте приложение Ledger Live",
          "description": "Мы рекомендуем поместить Ledger Live на ваш экран домой для более быстрого доступа."
        },
        "step2": {
          "title": "Настройте ваш Ledger",
          "description": "Настройте новый Ledger или подключитесь к существующему."
        },
        "step3": {
          "title": "Подключить",
          "description": "После сканирования вам будет предложено подключить ваш кошелек."
        }
      },
      "qr_code": {
        "step1": {
          "title": "Откройте приложение Ledger Live",
          "description": "Мы рекомендуем поместить Ledger Live на ваш экран домой для более быстрого доступа."
        },
        "step2": {
          "title": "Настройте ваш Ledger",
          "description": "Вы можете синхронизировать с настольным приложением или подключить свой Ledger."
        },
        "step3": {
          "title": "Сканировать код",
          "description": "Нажмите WalletConnect, затем переключитесь на Scanner. После сканирования вам будет предложено подключить ваш кошелек."
        }
      }
    }
  }
}
`;const on=Object.freeze(Object.defineProperty({__proto__:null,default:ln},Symbol.toStringTag,{value:"Module"}));var Cn=`{
  "connect_wallet": {
    "label": "เชื่อมต่อกระเป๋าเงิน"
  },
  "intro": {
    "title": "อะไรคือกระเป๋าเงิน?",
    "description": "กระเป๋าเงินใช้ในการส่ง, รับ, เก็บ, และแสดงสินทรัพย์ดิจิทัล มันยังเป็นวิธีใหม่ในการเข้าสู่ระบบ, โดยไม่จำเป็นต้องสร้างบัญชีและรหัสผ่านใหม่ในทุกเว็บไซต์.",
    "digital_asset": {
      "title": "บ้านสำหรับสินทรัพย์ดิจิทัลของคุณ",
      "description": "กระเป๋าเงินถูกใช้เพื่อส่ง, รับ, เก็บ, แสดงสินทรัพย์ดิจิทัล เช่น Ethereum และ NFTs."
    },
    "login": {
      "title": "วิธีใหม่ในการเข้าสู่ระบบ",
      "description": "แทนที่จะสร้างบัญชีและรหัสผ่านใหม่ในทุกเว็บไซต์, แค่เชื่อมต่อกระเป๋าของคุณ."
    },
    "get": {
      "label": "รับกระเป๋าเงิน"
    },
    "learn_more": {
      "label": "เรียนรู้เพิ่มเติม"
    }
  },
  "sign_in": {
    "label": "ยืนยันบัญชีของคุณ",
    "description": "เพื่อการเชื่อมต่อที่สมบูรณ์, คุณต้องลงนามในข้อความในกระเป๋าเงินของคุณเพื่อยืนยันว่าคุณเป็นเจ้าของบัญชีนี้",
    "message": {
      "send": "ส่งข้อความ",
      "preparing": "กำลังเตรียมข้อความ...",
      "cancel": "ยกเลิก",
      "preparing_error": "เกิดข้อผิดพลาดในการเตรียมข้อความ โปรดลองใหม่!"
    },
    "signature": {
      "waiting": "รอการลงนาม...",
      "verifying": "กำลังตรวจสอบลายเซ็น...",
      "signing_error": "เกิดข้อผิดพลาดในการลงนามในข้อความ โปรดลองใหม่!",
      "verifying_error": "เกิดข้อผิดพลาดในการตรวจสอบลายเซ็น โปรดลองใหม่!",
      "oops_error": "อ๊ะ, เกิดข้อผิดพลาดบางอย่าง!"
    }
  },
  "connect": {
    "label": "เชื่อมต่อ",
    "title": "เชื่อมต่อกระเป๋าเงิน",
    "new_to_ethereum": {
      "description": "ใหม่กับกระเป๋า Ethereum หรือไม่?",
      "learn_more": {
        "label": "เรียนรู้เพิ่มเติม"
      }
    },
    "learn_more": {
      "label": "เรียนรู้เพิ่มเติม"
    },
    "recent": "ล่าสุด",
    "status": {
      "opening": "กำลังเปิด %{wallet}...",
      "connecting": "กำลังเชื่อมต่อ",
      "connect_mobile": "ดำเนินการต่อใน %{wallet}",
      "not_installed": "%{wallet} ไม่ได้ติดตั้ง",
      "not_available": "%{wallet} ไม่สามารถใช้ได้",
      "confirm": "ยืนยันการเชื่อมต่อในส่วนขยาย",
      "confirm_mobile": "ยอมรับคำขอเชื่อมต่อในกระเป๋าเงิน"
    },
    "secondary_action": {
      "get": {
        "description": "ไม่มี %{wallet}?",
        "label": "รับ"
      },
      "install": {
        "label": "ติดตั้ง"
      },
      "retry": {
        "label": "ลองใหม่"
      }
    },
    "walletconnect": {
      "description": {
        "full": "ต้องการ modal อย่างเป็นทางการจาก WalletConnect หรือไม่?",
        "compact": "ต้องการ modal จาก WalletConnect หรือไม่?"
      },
      "open": {
        "label": "เปิด"
      }
    }
  },
  "connect_scan": {
    "title": "สแกนด้วย %{wallet}",
    "fallback_title": "สแกนด้วยโทรศัพท์ของคุณ"
  },
  "connector_group": {
    "recommended": "แนะนำ",
    "other": "อื่น ๆ",
    "popular": "ยอดนิยม",
    "more": "เพิ่มเติม",
    "others": "อื่น ๆ"
  },
  "get": {
    "title": "รับ Wallet",
    "action": {
      "label": "รับ"
    },
    "mobile": {
      "description": "Wallet บนมือถือ"
    },
    "extension": {
      "description": "ส่วนขยายบราวเซอร์"
    },
    "mobile_and_extension": {
      "description": "กระเป๋าเงินมือถือและส่วนขยาย"
    },
    "mobile_and_desktop": {
      "description": "กระเป๋าเงินบนมือถือและคอมพิวเตอร์"
    },
    "looking_for": {
      "title": "ไม่ใช่สิ่งที่คุณกำลังหาหรือไม่?",
      "mobile": {
        "description": "เลือกกระเป๋าเงินบนหน้าจอหลักเพื่อเริ่มต้นใช้งานกับผู้ให้บริการกระเป๋าเงินที่แตกต่างกัน"
      },
      "desktop": {
        "compact_description": "เลือกกระเป๋าเงินบนหน้าจอหลักเพื่อเริ่มต้นใช้งานกับผู้ให้บริการกระเป๋าเงินที่แตกต่างกัน",
        "wide_description": "เลือกกระเป๋าเงินที่อยู่ทางซ้ายเพื่อเริ่มต้นใช้งานกับผู้ให้บริการกระเป๋าเงินที่แตกต่างกัน"
      }
    }
  },
  "get_options": {
    "title": "เริ่มต้นกับ %{wallet}",
    "short_title": "รับ %{wallet}",
    "mobile": {
      "title": "%{wallet} สำหรับมือถือ",
      "description": "ใช้กระเป๋าระบบมือถือในการสำรวจโลกของ Ethereum.",
      "download": {
        "label": "รับแอป"
      }
    },
    "extension": {
      "title": "%{wallet} สำหรับ %{browser}",
      "description": "เข้าถึงกระเป๋าเงินของคุณได้โดยตรงจากบราวเซอร์ที่คุณชื่นชอบ.",
      "download": {
        "label": "เพิ่มไปยัง %{browser}"
      }
    },
    "desktop": {
      "title": "%{wallet} สำหรับ %{platform}",
      "description": "เข้าถึงกระเป๋าเงินของคุณโดยตรงจากคอมพิวเตอร์ที่มีประสิทธิภาพของคุณ",
      "download": {
        "label": "เพิ่มไปยัง %{platform}"
      }
    }
  },
  "get_mobile": {
    "title": "ติดตั้ง %{wallet}",
    "description": "สแกนด้วยโทรศัพท์ของคุณเพื่อดาวน์โหลดบน iOS หรือ Android",
    "continue": {
      "label": "ดำเนินการต่อ"
    }
  },
  "get_instructions": {
    "mobile": {
      "connect": {
        "label": "เชื่อมต่อ"
      },
      "learn_more": {
        "label": "เรียนรู้เพิ่มเติม"
      }
    },
    "extension": {
      "refresh": {
        "label": "รีเฟรช"
      },
      "learn_more": {
        "label": "เรียนรู้เพิ่มเติม"
      }
    },
    "desktop": {
      "connect": {
        "label": "เชื่อมต่อ"
      },
      "learn_more": {
        "label": "เรียนรู้เพิ่มเติม"
      }
    }
  },
  "chains": {
    "title": "เปลี่ยนเครือข่าย",
    "wrong_network": "ตรวจสอบพบเครือข่ายที่ไม่ถูกต้อง สลับหรือตัดการเชื่อมต่อเพื่อดำเนินการต่อ.",
    "confirm": "ยืนยันใน Wallet",
    "switching_not_supported": "กระเป๋าสตางค์ของคุณไม่สนับสนุนการเปลี่ยนเครือข่ายจาก %{appName}ลองเปลี่ยนเครือข่ายจากภายในกระเป๋าสตางค์ของคุณแทน",
    "switching_not_supported_fallback": "กระเป๋าสตางค์ของคุณไม่สนับสนุนการสลับเครือข่ายจากแอปนี้ ลองสลับเครือข่ายจากภายในกระเป๋าสตางค์ของคุณแทน",
    "disconnect": "ตัดการเชื่อมต่อ",
    "connected": "เชื่อมต่อแล้ว"
  },
  "profile": {
    "disconnect": {
      "label": "ตัดการเชื่อมต่อ"
    },
    "copy_address": {
      "label": "คัดลอกที่อยู่",
      "copied": "คัดลอกแล้ว!"
    },
    "explorer": {
      "label": "ดูเพิ่มเติมบน explorer"
    },
    "transactions": {
      "description": "%{appName} รายการจะปรากฎที่นี่...",
      "description_fallback": "การทำธุรกรรมของคุณจะปรากฎที่นี่...",
      "recent": {
        "title": "ธุรกรรมล่าสุด"
      },
      "clear": {
        "label": "ลบทั้งหมด"
      }
    }
  },
  "wallet_connectors": {
    "argent": {
      "qr_code": {
        "step1": {
          "description": "วาง Argent บนหน้าจอหลักของคุณเพื่อเข้าถึงกระเป๋าเงินของคุณได้เร็วขึ้น",
          "title": "เปิดแอป Argent"
        },
        "step2": {
          "description": "สร้างกระเป๋าเงินและชื่อผู้ใช้หรือนำเข้ากระเป๋าเงินที่มีอยู่แล้ว",
          "title": "สร้างหรือนำเข้า Wallet"
        },
        "step3": {
          "description": "หลังจากคุณสแกน จะปรากฏหน้าต่างเชื่อมต่อให้คุณเชื่อมต่อกระเป๋าเงินของคุณ",
          "title": "แตะที่คุ่มุ่งสแกน QR"
        }
      }
    },
    "bifrost": {
      "qr_code": {
        "step1": {
          "description": "เราขอแนะนำให้คุณวาง Bifrost Wallet บนหน้าจอหลักของคุณเพื่อเข้าถึงได้เร็วขึ้น",
          "title": "เปิดแอพฯ Bifrost Wallet"
        },
        "step2": {
          "description": "สร้างหรือนำเข้ากระเป๋าเงินด้วย recovery phrase ของคุณ",
          "title": "สร้างหรือนำเข้ากระเป๋าเงิน"
        },
        "step3": {
          "description": "หลังจากที่คุณสแกนแล้วยินยันการเชื่อมต่อกับกระเป๋าเงินของคุณ",
          "title": "แตะปุ่มสแกน"
        }
      }
    },
    "bitget": {
      "qr_code": {
        "step1": {
          "description": "เราขอแนะนำให้วาง Bitget Wallet บนหน้าจอหน้าแรกของคุณเพื่อการเข้าถึงที่รวดเร็วขึ้น.",
          "title": "เปิดแอพ Bitget Wallet"
        },
        "step2": {
          "description": "ตรวจสอบการสำรองข้อมูลกระเป๋าสตางค์ของคุณให้แน่นอนโดยใช้วิธีที่ปลอดภัย อย่าแชร์วลีลับของคุณกับใครเป็นอันขาด.",
          "title": "สร้างหรือนำเข้า Wallet"
        },
        "step3": {
          "description": "หลังจากที่คุณสแกน จะมีข้อความขอเชื่อมต่อที่จะปรากฏขึ้นให้คุณเชื่อมต่อกระเป๋าสตางค์ของคุณ.",
          "title": "แตะปุ่มสแกน"
        }
      },
      "extension": {
        "step1": {
          "description": "เราแนะนำให้คุณปัก Bitget Wallet ไว้บนแถบงานของคุณเพื่อเข้าถึงกระเป๋าสตางค์ได้เร็วขึ้น",
          "title": "ติดตั้งส่วนเสริม Bitget Wallet"
        },
        "step2": {
          "description": "โปรดแน่ใจว่าคุณได้สำรองข้อมูลกระเป๋าเงินของคุณโดยใช้วิธีที่ปลอดภัย อย่าแชร์วลีลับของคุณกับบุคคลใดๆ",
          "title": "สร้างหรือนำเข้า Wallet"
        },
        "step3": {
          "description": "เมื่อคุณตั้งค่ากระเป๋าเงินของคุณแล้วคลิกด้านล่างเพื่อรีเฟรชเบราว์เซอร์และโหลดส่วนเสริม",
          "title": "รีเฟรชเบราว์เซอร์ของคุณ"
        }
      }
    },
    "bitski": {
      "extension": {
        "step1": {
          "description": "เราแนะนำให้ทำปัก Bitski ไว้ที่แถบงานของคุณเพื่อเข้าถึงกระเป๋าเงินได้โดยไม่ต้องรอ",
          "title": "ติดตั้งส่วนขยาย Bitski"
        },
        "step2": {
          "description": "ควรสำรองกระเป๋าเงินของคุณโดยใช้วิธีที่ปลอดภัย อย่าเปิดเผยคำลับของคุณให้ใครทราบ",
          "title": "สร้างหรือนำเข้ากระเป๋าเงิน"
        },
        "step3": {
          "description": "เมื่อคุณตั้งค่ากระเป๋าเงินของคุณแล้ว คลิกด้านล่างเพื่อรีเฟรชเบราว์เซอร์และโหลดส่วนขยาย",
          "title": "รีเฟรชเบราว์เซอร์ของคุณ"
        }
      }
    },
    "coin98": {
      "qr_code": {
        "step1": {
          "description": "เราขอแนะนำให้คุณวาง Coin98 Wallet บนหน้าจอหลักของคุณ เพื่อให้เข้าถึงกระเป๋าเงินของคุณได้เร็วขึ้น.",
          "title": "เปิดแอพ Coin98 Wallet"
        },
        "step2": {
          "description": "คุณสามารถสำรองข้อมูลกระเป๋าเงินของคุณได้ง่ายๆ ด้วยฟีเจอร์สำรองข้อมูลบนโทรศัพท์ของคุณ.",
          "title": "สร้างหรือนำเข้ากระเป๋าเงิน"
        },
        "step3": {
          "description": "หลังจากคุณสแกน จะมีเตือนการเชื่อมต่อที่ปรากฏขึ้นให้คุณเชื่อมต่อกระเป๋าเงินของคุณ.",
          "title": "แตะที่ปุ่ม WalletConnect"
        }
      },
      "extension": {
        "step1": {
          "description": "คลิกที่ด้านบนขวาของเบราว์เซอร์ของคุณและปัก Coin98 Wallet ไว้เพื่อให้เข้าถึงได้ง่าย.",
          "title": "ติดตั้งส่วนขยาย Coin98 Wallet"
        },
        "step2": {
          "description": "สร้างกระเป๋าเงินใหม่หรือนำเข้าที่มีอยู่แล้ว.",
          "title": "สร้างหรือนำเข้ากระเป๋าเงิน"
        },
        "step3": {
          "description": "เมื่อคุณตั้งค่า Coin98 Wallet แล้ว คลิกด้านล่างเพื่อรีเฟรชเบราว์เซอร์และโหลดส่วนขยายขึ้นมา.",
          "title": "รีเฟรชเบราว์เซอร์ของคุณ"
        }
      }
    },
    "coinbase": {
      "qr_code": {
        "step1": {
          "description": "เราแนะนำให้วาง Coinbase Wallet ไว้ที่หน้าจอหลักของคุณเพื่อให้เข้าถึงได้เร็วขึ้น.",
          "title": "เปิดแอป Coinbase Wallet"
        },
        "step2": {
          "description": "คุณสามารถสำรองข้อมูลกระเป๋าสตางค์ของคุณได้ง่ายๆ โดยใช้ฟีเจอร์การสำรองข้อมูลด้วยคลาวด์",
          "title": "สร้างหรือนำเข้ากระเป๋าสตางค์"
        },
        "step3": {
          "description": "หลังจากที่คุณสแกนแล้ว จะมีการแสดงขอ้มูลเพื่อให้คุณเชื่อมต่อกระเป๋าสตางค์ของคุณ",
          "title": "แตะที่ปุ่มสแกน"
        }
      },
      "extension": {
        "step1": {
          "description": "เราแนะนำให้คุณยัด Coinbase Wallet ไว้ที่แถบงานของคุณเพื่อให้สามารถเข้าถึงกระเป๋าสตางค์ของคุณได้เร็วขึ้น",
          "title": "ติดตั้งส่วนขยาย Coinbase Wallet"
        },
        "step2": {
          "description": "ตรวจสอบให้แน่ใจว่าคุณได้สำรองข้อมูลกระเป๋าเงินของคุณโดยใช้วิธีที่ปลอดภัย อย่าเปิดเผยประโยคลับของคุณให้กับใครเลย",
          "title": "สร้างหรือนำเข้ากระเป๋าเงิน"
        },
        "step3": {
          "description": "เมื่อคุณได้ตั้งค่ากระเป๋าเงินของคุณแล้ว คลิกด้านล่างเพื่อเรียกดูเบราว์เซอร์ใหม่และโหลดส่วนขยาย",
          "title": "รีเฟรชเบราว์เซอร์ของคุณ"
        }
      }
    },
    "core": {
      "qr_code": {
        "step1": {
          "description": "เราแนะนำให้คุณวาง Core ลงสนามหลักเพื่อให้เข้าถึงกระเป๋าเงินได้เร็วขึ้น",
          "title": "เปิดแอปเครื่องมือช่วยอีเกิร์น"
        },
        "step2": {
          "description": "คุณสามารถสำรองกระเป๋าเงินของคุณได้ง่ายๆ โดยใช้ฟีเจอร์สำรองของเราบนโทรศัพท์ของคุณ",
          "title": "สร้างหรือนำเข้ากระเป๋าเงิน"
        },
        "step3": {
          "description": "หลังจากที่คุณสแกนแล้ว จะมีการแจ้งเตือนเพื่อให้คุณเชื่อมต่อกับกระเป๋าสตางค์ของคุณ",
          "title": "แตะปุ่ม WalletConnect"
        }
      },
      "extension": {
        "step1": {
          "description": "เราขอแนะนำให้คุณปัก Core ไว้ที่แถบงานของคุณเพื่อเข้าถึงกระเป๋าสตางค์ของคุณได้อย่างรวดเร็ว",
          "title": "ติดตั้งส่วนขยาย Core"
        },
        "step2": {
          "description": "โปรดแน่ใจว่าคุณได้สำรองกระเป๋าสตางค์ของคุณใช้วิธีที่ปลอดภัย อย่าแชร์วลีลับของคุณกับใคร",
          "title": "สร้างหรือนำเข้า Wallet"
        },
        "step3": {
          "description": "เมื่อคุณตั้งค่ากระเป๋าสตางค์ของคุณแล้ว คลิกด้านล่างเพื่อรีเฟรชเบราว์เซอร์และโหลดส่วนขยาย",
          "title": "รีเฟรชเบราว์เซอร์ของคุณ"
        }
      }
    },
    "fox": {
      "qr_code": {
        "step1": {
          "description": "เราขอแนะนำให้คุณวาง FoxWallet บนหน้าจอหลักเพื่อให้เข้าถึงได้เร็วขึ้น",
          "title": "เปิดแอป FoxWallet"
        },
        "step2": {
          "description": "ตรวจสอบที่จะสำรองข้อมูลกระเป๋าเงินของคุณโดยใช้วิธีที่ปลอดภัย จงอย่าเปิดเผยประโยคลับลับของคุณให้ผู้อื่นรู้",
          "title": "สร้างหรือนำเข้ากระเป๋าเงิน"
        },
        "step3": {
          "description": "หลังจากที่คุณสแกน จะมีการเชื่อมต่อที่แสดงให้คุณเชื่อมต่อกระเป๋าเงินของคุณ",
          "title": "แตะปุ่มสแกน"
        }
      }
    },
    "frontier": {
      "qr_code": {
        "step1": {
          "description": "เราขอแนะนำให้คุณวาง Frontier Wallet บนหน้าจอหลักเพื่อให้เข้าถึงได้เร็วขึ้น",
          "title": "เปิดแอป Frontier Wallet"
        },
        "step2": {
          "description": "ตรวจสอบให้แน่ใจว่าคุณได้สำรองข้อมูลกระเป๋าสตางค์ของคุณโดยใช้วิธีที่ปลอดภัย อย่าแชร์วลีลับของคุณกับใคร",
          "title": "สร้างหรือนำเข้ากระเป๋าสตางค์"
        },
        "step3": {
          "description": "หลังจากที่คุณสแกนแล้ว จะมีการแสดงข้อมูลเพื่อให้คุณเชื่อมต่อกับกระเป๋าสตางค์ของคุณ",
          "title": "แตะปุ่มสแกน"
        }
      },
      "extension": {
        "step1": {
          "description": "เราแนะนำให้คุณปักหมุด Frontier Wallet ไว้ที่แถบงานของคุณเพื่อเข้าถึงกระเป๋าสตางค์ของคุณได้ง่ายขึ้น",
          "title": "ติดตั้งส่วนเสริม Frontier Wallet"
        },
        "step2": {
          "description": "ตรวจสอบให้แน่ใจว่าคุณได้สำรองข้อมูลกระเป๋าสตางค์ของคุณโดยใช้วิธีที่ปลอดภัย อย่าแชร์วลีลับของคุณกับใคร",
          "title": "สร้างหรือนำเข้ากระเป๋าสตางค์"
        },
        "step3": {
          "description": "เมื่อคุณตั้งค่ากระเป๋าเงินของคุณแล้ว คลิกด้านล่างเพื่อรีเฟรชเบราว์เซอร์และโหลดส่วนขยาย",
          "title": "รีเฟรชเบราว์เซอร์ของคุณ"
        }
      }
    },
    "im_token": {
      "qr_code": {
        "step1": {
          "title": "เปิดแอพ imToken",
          "description": "ใส่แอพ imToken ไว้ที่หน้าจอหลักเพื่อเข้าถึงกระเป๋าเงินของคุณได้เร็วขึ้น."
        },
        "step2": {
          "title": "สร้างหรือนำเข้ากระเป๋าเงิน",
          "description": "สร้างกระเป๋าเงินใหม่หรือนำเข้ากระเป๋าเงินที่มีอยู่แล้ว"
        },
        "step3": {
          "title": "แตะไอคอนสแกนเนอร์ในมุมบนขวา",
          "description": "เลือก New Connection, แล้วสแกน QR code และยืนยันการรับรองสำหรับการเชื่อมต่อ"
        }
      }
    },
    "metamask": {
      "qr_code": {
        "step1": {
          "title": "เปิดแอป MetaMask",
          "description": "เราขอแนะนำให้วาง MetaMask บนหน้าจอหลักของคุณเพื่อเข้าถึงได้เร็วขึ้น"
        },
        "step2": {
          "title": "สร้างหรือนำเข้า Wallet",
          "description": "ตรวจสอบว่าได้สำรองกระเป๋าเงินของคุณโดยใช้วิธีที่ปลอดภัย อย่าเปิดเผยวลีลับของคุณให้กับใคร"
        },
        "step3": {
          "title": "แตะที่ปุ่มสแกน",
          "description": "หลังจากการสแกน, จะปรากฏข้อความเชื่อมต่อสำหรับคุณเพื่อเชื่อมต่อกับกระเป๋าเงินของคุณ"
        }
      },
      "extension": {
        "step1": {
          "title": "ติดตั้งส่วนขยาย MetaMask",
          "description": "เราขอแนะนำให้คุณปัก MetaMask ไว้ที่แถบงานของคุณเพื่อเข้าถึงกระเป๋าเงินของคุณได้รวดเร็ว"
        },
        "step2": {
          "title": "สร้างหรือนำเข้ากระเป๋าเงิน",
          "description": "อย่างแน่นอนให้สำรองข้อมูลกระเป๋าเงินของคุณโดยใช้วิธีที่ปลอดภัย อย่าแชร์ประโยคลับของคุณกับใครเลย"
        },
        "step3": {
          "title": "รีเฟรชเบราว์เซอร์ของคุณ",
          "description": "เมื่อคุณตั้งค่ากระเป๋าเงินของคุณแล้ว คลิกด้านล่างเพื่อรีเฟรชเบราว์เซอร์และโหลดส่วนขยาย"
        }
      }
    },
    "okx": {
      "qr_code": {
        "step1": {
          "title": "เปิดแอพ OKX Wallet",
          "description": "เราแนะนำให้วาง OKX Wallet บนหน้าจอหลักของคุณเพื่อให้เข้าถึงได้เร็วขึ้น"
        },
        "step2": {
          "title": "สร้างหรือนำเข้า Wallet",
          "description": "จงแน่ใจว่าคุณได้สำรองข้อมูล wallet ของคุณด้วยวิธีที่ปลอดภัย อย่าแชร์วลีลับของคุณให้คนอื่น"
        },
        "step3": {
          "title": "แตะปุ่มสแกน",
          "description": "หลังจากคุณสแกน จะมีการแสดงข้อมูลเพื่อให้คุณเชื่อมต่อ wallet ของคุณ"
        }
      },
      "extension": {
        "step1": {
          "title": "ติดตั้งส่วนเสริม OKX Wallet",
          "description": "เราแนะนำให้ยึด OKX Wallet ไว้ที่แถบงานของคุณเพื่อให้เข้าถึง wallet ของคุณได้เร็วขึ้น"
        },
        "step2": {
          "title": "สร้างหรือนำเข้า Wallet",
          "description": "โปรดแน่ใจว่าคุณได้สำรองกระเป๋าสตางค์ของคุณด้วยวิธีที่ปลอดภัย อย่าเปิดเผยประโยคลับของคุณให้ใครทราบ"
        },
        "step3": {
          "title": "รีเฟรชเบราว์เซอร์ของคุณ",
          "description": "เมื่อคุณตั้งค่ากระเป๋าสตางค์ของคุณแล้ว คลิกด้านล่างเพื่อรีเฟรชเบราว์เซอร์และโหลดส่วนขยาย"
        }
      }
    },
    "omni": {
      "qr_code": {
        "step1": {
          "title": "เปิดแอป Omni",
          "description": "เพิ่ม Omni ไปยังหน้าจอแรกเพื่อเข้าถึงกระเป๋าสตางค์ของคุณได้รวดเร็วขึ้น"
        },
        "step2": {
          "title": "สร้างหรือนำเข้ากระเป๋าสตางค์",
          "description": "สร้างกระเป๋าสตางค์ใหม่หรือนำเข้ากระเป๋าสตางค์ที่มีอยู่"
        },
        "step3": {
          "title": "แตะที่ไอคอน QR แล้วสแกน",
          "description": "แตะที่ไอคอน QR บนหน้าจอหน้าแรกของคุณ, สแกนรหัสและยืนยันการเตือนเพื่อเชื่อมต่อ."
        }
      }
    },
    "token_pocket": {
      "qr_code": {
        "step1": {
          "title": "เปิดแอป TokenPocket",
          "description": "เราแนะนำให้วาง TokenPocket บนหน้าจอหน้าแรกของคุณเพื่อเข้าถึงได้เร็วขึ้น."
        },
        "step2": {
          "title": "สร้างหรือนำเข้ากระเป๋าเงิน",
          "description": "ตรวจสอบว่าได้สำรองกระเป๋าเงินของคุณโดยใช้วิธีที่ปลอดภัย อย่าเปิดเผยวลีลับของคุณให้ผู้อื่นทราบในทางใดทางหนึ่ง."
        },
        "step3": {
          "title": "แตะปุ่มสแกน",
          "description": "หลังจากที่คุณสแกนแล้ว จะมีการเรียกให้เชื่อมต่อกับกระเป๋าเงินของคุณ"
        }
      },
      "extension": {
        "step1": {
          "title": "ติดตั้งส่วนขยาย TokenPocket",
          "description": "เราขอแนะนำให้คุณปัก TokenPocket ไว้ที่แถบงานเพื่อทำให้สามารถเข้าถึงกระเป๋าเงินของคุณได้ง่ายขึ้น"
        },
        "step2": {
          "title": "สร้างหรือนำเข้ากระเป๋าเงิน",
          "description": "ตรวจสอบให้แน่ใจว่าคุณได้สำรองข้อมูลกระเป๋าเงินของคุณด้วยวิธีที่ปลอดภัย อย่าทำการแชร์ประโยคลับด้วยความลับของคุณกับใคร"
        },
        "step3": {
          "title": "รีเฟรชบราวเซอร์ของคุณ",
          "description": "เมื่อคุณตั้งค่ากระเป๋าเงินของคุณแล้ว คลิกด้านล่างเพื่อรีเฟรชบราวเซอร์และโหลดส่วนขยาย"
        }
      }
    },
    "trust": {
      "qr_code": {
        "step1": {
          "title": "เปิดแอพ Trust Wallet",
          "description": "วาง Trust Wallet ที่หน้าจอหลักของคุณเพื่อเข้าถึงกระเป๋าเงินของคุณได้รวดเร็วขึ้น"
        },
        "step2": {
          "title": "สร้างหรือนำเข้า Wallet",
          "description": "สร้าง wallet ใหม่หรือนำเข้า wallet ที่มีอยู่แล้ว"
        },
        "step3": {
          "title": "แตะ WalletConnect ในการตั้งค่า",
          "description": "เลือก New Connection จากนั้นสแกน QR code และยืนยันการแจ้งเตือนเพื่อเชื่อมต่อ"
        }
      },
      "extension": {
        "step1": {
          "title": "ติดตั้งส่วนขยาย Trust Wallet",
          "description": "คลิกที่มุมบนขวาของเบราว์เซอร์ของคุณและปัก Trust Wallet เพื่อเข้าถึงได้ง่าย"
        },
        "step2": {
          "title": "สร้างหรือนำเข้า wallet",
          "description": "สร้าง wallet ใหม่หรือนำเข้า wallet ที่มีอยู่แล้ว"
        },
        "step3": {
          "title": "รีเฟรชเบราว์เซอร์ของคุณ",
          "description": "เมื่อคุณตั้งค่า Trust Wallet แล้ว คลิกด้านล่างเพื่อรีเฟรชเบราว์เซอร์และโหลดส่วนขยายขึ้นมา"
        }
      }
    },
    "uniswap": {
      "qr_code": {
        "step1": {
          "title": "เปิดแอป Uniswap",
          "description": "เพิ่ม Uniswap Wallet ไปยังหน้าจอหลักของคุณเพื่อเข้าถึงกระเป๋าเงินของคุณได้เร็วขึ้น"
        },
        "step2": {
          "title": "สร้างหรือนำเข้า Wallet",
          "description": "สร้างกระเป๋าเงินใหม่หรือนำเข้ากระเป๋าเงินที่มีอยู่แล้ว"
        },
        "step3": {
          "title": "แตะที่ไอคอน QR และสแกน",
          "description": "แตะที่ไอคอน QR บนหน้าจอหลักของคุณ สแกนรหัสและยืนยันการเชื่อมต่อ"
        }
      }
    },
    "zerion": {
      "qr_code": {
        "step1": {
          "title": "เปิดแอป Zerion",
          "description": "เราแนะนำให้คุณวาง Zerion บนหน้าจอหลักของคุณเพื่อเข้าถึงได้เร็วขึ้น"
        },
        "step2": {
          "title": "สร้างหรือนำเข้า Wallet",
          "description": "ลองทำสำเนาข้อมูล wallet ของคุณไว้ในช่องทางที่ปลอดภัย อย่าเปิดเผยวลีลับของคุณให้กับผู้อื่น"
        },
        "step3": {
          "title": "แตะที่ปุ่มสแกน",
          "description": "หลังจากสแกน จะมีหน้าต่างแสดงคำสั่งเชื่อมต่อให้คุณเชื่อมต่อ wallet ของคุณ"
        }
      },
      "extension": {
        "step1": {
          "title": "ติดตั้งส่วนขยาย Zerion",
          "description": "เราแนะนำให้คุณติด Zerion บนแถบงานของคุณเพื่อเข้าถึง wallet ของคุณได้เร็วขึ้น"
        },
        "step2": {
          "title": "สร้างหรือนำเข้ากระเป๋าเงิน",
          "description": "ตรวจสอบให้แน่ใจว่าคุณได้สำรองข้อมูลกระเป๋าเงินของคุณโดยวิธีที่ปลอดภัย อย่าเปิดเผยประโยคลับลับของคุณให้ใครทราบครับ"
        },
        "step3": {
          "title": "รีเฟรชเบราว์เซอร์ของคุณ",
          "description": "เมื่อคุณตั้งค่ากระเป๋าเงินของคุณแล้ว คลิกด้านล่างเพื่อรีเฟรชเบราว์เซอร์และโหลดส่วนขยาย"
        }
      }
    },
    "rainbow": {
      "qr_code": {
        "step1": {
          "title": "เปิดแอป Rainbow",
          "description": "เราขอแนะนำให้คุณวาง Rainbow อยู่บนหน้าจอหลักของคุณเพื่อรับผิดชอบจากกระเป๋าสตางค์ของคุณอย่างรวดเร็ว"
        },
        "step2": {
          "title": "สร้างหรือนำเข้ากระเป๋าสตางค์",
          "description": "คุณสามารถสำรองข้อมูลกระเป๋าสตางค์ของคุณได้ง่ายๆ ด้วยฟีเจอร์สำรองข้อมูลบนโทรศัพท์ของคุณ"
        },
        "step3": {
          "title": "แตะปุ่มสแกน",
          "description": "หลังจากสแกนแล้ว จะแสดงข้อความขอเชื่อมต่อเพื่อให้คุณเชื่อมต่อกระเป๋าสตางค์ของคุณ"
        }
      }
    },
    "enkrypt": {
      "extension": {
        "step1": {
          "description": "เราขอแนะนำให้คุณปัก Enkrypt Wallet ไว้ที่แทบงานของคุณเพื่อให้สามารถเข้าถึงกระเป๋าสตางค์ของคุณได้เร็วขึ้น",
          "title": "ติดตั้งส่วนขยาย Enkrypt Wallet"
        },
        "step2": {
          "description": "ตรวจสอบให้แน่ใจว่าคุณได้สำรองกระเป๋าสตางค์ของคุณโดยใช้วิธีที่ปลอดภัย ห้ามแชร์วลีลับของคุณให้กับใคร",
          "title": "สร้างหรือนำเข้า Wallet"
        },
        "step3": {
          "description": "เมื่อคุณตั้งค่า wallet ของคุณแล้ว คลิกด้านล่างเพื่อรีเฟรช browser และโหลดขึ้น extension",
          "title": "รีเฟรช browser ของคุณ"
        }
      }
    },
    "frame": {
      "extension": {
        "step1": {
          "description": "เราแนะนำให้หมุน Frame ไว้บน taskbar ของคุณเพื่อให้เข้าถึง wallet ได้เร็วขึ้น",
          "title": "ติดตั้ง Frame และ extension ที่เป็นคู่"
        },
        "step2": {
          "description": "ตรวจสอบว่าได้สำรอง wallet ของคุณโดยใช้วิธีการที่ปลอดภัย อย่าเปิดเผยวลีลับของคุณให้กับใคร",
          "title": "สร้างหรือนำเข้า Wallet"
        },
        "step3": {
          "description": "เมื่อคุณตั้งค่า wallet ของคุณแล้ว คลิกด้านล่างเพื่อรีเฟรช browser และโหลดขึ้น extension",
          "title": "รีเฟรช browser ของคุณ"
        }
      }
    },
    "one_key": {
      "extension": {
        "step1": {
          "title": "ติดตั้งส่วนเสริม OneKey Wallet",
          "description": "เราแนะนำการปัก OneKey Wallet ไว้บนแทบงานของคุณเพื่อเข้าถึงกระเป๋าเงินได้ง่ายขึ้น"
        },
        "step2": {
          "title": "สร้างหรือนำเข้ากระเป๋าเงิน",
          "description": "อย่าลืมสำรองกระเป๋าเงินของคุณด้วยวิธีที่ปลอดภัย อย่าแชร์วลีลับของคุณกับใคร"
        },
        "step3": {
          "title": "รีเฟรชเบราว์เซอร์ของคุณ",
          "description": "เมื่อคุณตั้งค่ากระเป๋าเงินของคุณแล้ว คลิกด้านล่างเพื่อรีเฟรชเบราว์เซอร์และโหลดส่วนเสริม"
        }
      }
    },
    "phantom": {
      "extension": {
        "step1": {
          "title": "ติดตั้งส่วนเสริม Phantom",
          "description": "เราแนะนำการปัก Phantom ไว้บนแทบงานของคุณเพื่อเข้าถึงกระเป๋าเงินได้ง่ายขึ้น"
        },
        "step2": {
          "title": "สร้างหรือนำเข้ากระเป๋าเงิน",
          "description": "แน่ใจว่าคุณได้สำรองกระเป๋าเงินของคุณโดยใช้วิธีที่ปลอดภัย อย่าเปิดเผยข้อความลับสำหรับการกู้คืนของคุณกับบุคคลใด ๆ"
        },
        "step3": {
          "title": "รีเฟรชเบราว์เซอร์ของคุณ",
          "description": "เมื่อคุณตั้งค่ากระเป๋าเงินเรียบร้อยแล้ว, คลิกด้านล่างเพื่อรีเฟรชเบราว์เซอร์และโหลดส่วนขยาย"
        }
      }
    },
    "rabby": {
      "extension": {
        "step1": {
          "title": "ติดตั้งส่วนขยาย Rabby",
          "description": "เราแนะนำให้คุณปัก Rabby ไว้ที่แถบงานเพื่อให้เข้าถึงกระเป๋าเงินของคุณได้รวดเร็วขึ้น."
        },
        "step2": {
          "title": "สร้างหรือนำเข้ากระเป๋าเงิน",
          "description": "แน่ใจว่าคุณได้สำรองกระเป๋าเงินของคุณโดยใช้วิธีที่ปลอดภัย อย่าแชร์ข้อความลับของคุณกับบุคคลอื่น"
        },
        "step3": {
          "title": "รีเฟรชเบราว์เซอร์ของคุณ",
          "description": "เมื่อคุณตั้งค่ากระเป๋าเงินของคุณแล้ว คลิกด้านล่างเพื่อรีเฟรชเบราว์เซอร์และโหลดส่วนขยาย"
        }
      }
    },
    "safeheron": {
      "extension": {
        "step1": {
          "title": "ติดตั้งส่วนขยาย Core",
          "description": "เราขอแนะนำให้คุณปัก Safeheron ไว้ที่แถบงานเพื่อเข้าถึงกระเป๋าเงินของคุณได้เร็วขึ้น"
        },
        "step2": {
          "title": "สร้างหรือนำเข้ากระเป๋าเงิน",
          "description": "อย่าลืมสำรองกระเป๋าเงินของคุณโดยใช้วิธีที่ปลอดภัย อย่าเปิดเผยประโยคลับของคุณให้ผู้อื่นทราบ"
        },
        "step3": {
          "title": "รีเฟรชเบราว์เซอร์ของคุณ",
          "description": "เมื่อคุณตั้งค่ากระเป๋าเงินของคุณแล้ว คลิกด้านล่างเพื่อรีเฟรชเบราว์เซอร์และโหลดส่วนขยาย"
        }
      }
    },
    "taho": {
      "extension": {
        "step1": {
          "title": "ติดตั้งส่วนขยาย Taho",
          "description": "เราแนะนำให้คุณปัก Taho ไว้ที่แถบงานของคุณเพื่อเข้าถึงกระเป๋าเงินของคุณได้เร็วขึ้น"
        },
        "step2": {
          "title": "สร้างหรือนำเข้ากระเป๋าเงิน",
          "description": "โปรดแน่ใจว่าคุณได้สำรองกระเป๋าเงินของคุณโดยใช้วิธีที่ปลอดภัย อย่าแชร์ประโยคลับคุณกับผู้อื่น"
        },
        "step3": {
          "title": "รีเฟรชเบราว์เซอร์ของคุณ",
          "description": "เมื่อคุณตั้งค่ากระเป๋าเงินของคุณแล้ว คลิกด้านล่างเพื่อรีเฟรชเบราว์เซอร์และโหลดส่วนขยาย"
        }
      }
    },
    "talisman": {
      "extension": {
        "step1": {
          "title": "ติดตั้งส่วนขยาย Talisman",
          "description": "เราแนะนำให้คุณปัก Talisman ไว้ที่แถบงานของคุณเพื่อเข้าถึงกระเป๋าเงินของคุณได้เร็วขึ้น"
        },
        "step2": {
          "title": "สร้างหรือนำเข้ากระเป๋าเงิน Ethereum",
          "description": "ให้แน่ใจว่าคุณได้สำรองกระเป๋าเงินของคุณโดยใช้วิธีที่ปลอดภัย อย่าเปิดเผยวลีการกู้คืนของคุณให้ใครทราบเด็ดขาด"
        },
        "step3": {
          "title": "รีเฟรชเบราว์เซอร์ของคุณ",
          "description": "เมื่อคุณตั้งค่ากระเป๋าเงินของคุณแล้ว คลิกด้านล่างเพื่อรีเฟรชเบราว์เซอร์และโหลดส่วนขยาย"
        }
      }
    },
    "xdefi": {
      "extension": {
        "step1": {
          "title": "ติดตั้งส่วนขยาย XDEFI Wallet",
          "description": "เราแนะนำให้คุณตรา XDEFI Wallet ไว้ที่แถบงานเพื่อเข้าถึงกระเป๋าเงินของคุณได้เร็วขึ้น"
        },
        "step2": {
          "title": "สร้างหรือนำเข้ากระเป๋าเงิน",
          "description": "ให้แน่ใจว่าคุณได้สำรองกระเป๋าเงินของคุณโดยใช้วิธีที่ปลอดภัย อย่าเปิดเผยวลีลับของคุณให้ใครทราบเด็ดขาด"
        },
        "step3": {
          "title": "รีเฟรชเบราว์เซอร์ของคุณ",
          "description": "หลังจากที่คุณตั้งค่ากระเป๋าสตางค์ของคุณแล้ว คลิกด้านล่างเพื่อรีเฟรชบราวเซอร์และโหลดส่วนเสริม."
        }
      }
    },
    "zeal": {
      "extension": {
        "step1": {
          "title": "ติดตั้งส่วนขยาย Zeal",
          "description": "เราแนะนำให้ปัก Zeal ไว้ที่แถบงานของคุณเพื่อเข้าถึงกระเป๋าเงินของคุณได้เร็วขึ้น"
        },
        "step2": {
          "title": "สร้างหรือนำเข้า Wallet",
          "description": "ตรวจสอบการสำรองข้อมูลกระเป๋าสตางค์ของคุณให้แน่นอนโดยใช้วิธีที่ปลอดภัย อย่าแชร์วลีลับของคุณกับใครเป็นอันขาด."
        },
        "step3": {
          "title": "รีเฟรชเบราว์เซอร์ของคุณ",
          "description": "เมื่อคุณตั้งค่ากระเป๋าเงินของคุณแล้วคลิกด้านล่างเพื่อรีเฟรชเบราว์เซอร์และโหลดส่วนเสริม"
        }
      }
    },
    "safepal": {
      "extension": {
        "step1": {
          "title": "ติดตั้งส่วนขยาย SafePal Wallet",
          "description": "คลิกที่มุมบนขวาของเบราว์เซอร์ของคุณและปักมุม SafePal Wallet เพื่อที่จะเข้าถึงได้ง่าย"
        },
        "step2": {
          "title": "สร้างหรือนำเข้ากระเป๋าเงิน",
          "description": "สร้างกระเป๋าเงินใหม่หรือนำเข้าที่มีอยู่แล้ว."
        },
        "step3": {
          "title": "รีเฟรชเบราว์เซอร์ของคุณ",
          "description": "หลังจากคุณตั้งค่า SafePal Wallet เรียบร้อยแล้ว คลิกด้านล่างเพื่อรีเฟรชเบราว์เซอร์และโหลดส่วนขยาย"
        }
      },
      "qr_code": {
        "step1": {
          "title": "เปิดแอป SafePal Wallet",
          "description": "วาง SafePal Wallet ที่หน้าจอหลักของคุณเพื่อเข้าถึงกระเป๋าเงินของคุณได้เร็วขึ้น"
        },
        "step2": {
          "title": "สร้างหรือนำเข้า Wallet",
          "description": "สร้างกระเป๋าเงินใหม่หรือนำเข้าที่มีอยู่แล้ว."
        },
        "step3": {
          "title": "แตะ WalletConnect ในการตั้งค่า",
          "description": "เลือก New Connection, แล้วสแกน QR code และยืนยันการรับรองสำหรับการเชื่อมต่อ"
        }
      }
    },
    "desig": {
      "extension": {
        "step1": {
          "title": "ติดตั้งส่วนขยาย Desig",
          "description": "เราขอแนะนำให้คุณตรึง Desig ไว้ที่แถบงานของคุณเพื่อให้เข้าถึงกระเป๋าเงินของคุณได้ง่ายขึ้น"
        },
        "step2": {
          "title": "สร้างกระเป๋าเงิน",
          "description": "ตรวจสอบการสำรองข้อมูลกระเป๋าสตางค์ของคุณให้แน่นอนโดยใช้วิธีที่ปลอดภัย อย่าแชร์วลีลับของคุณกับใครเป็นอันขาด."
        },
        "step3": {
          "title": "รีเฟรชเบราว์เซอร์ของคุณ",
          "description": "เมื่อคุณตั้งค่ากระเป๋าเงินของคุณแล้วคลิกด้านล่างเพื่อรีเฟรชเบราว์เซอร์และโหลดส่วนเสริม"
        }
      }
    },
    "subwallet": {
      "extension": {
        "step1": {
          "title": "ติดตั้งส่วนขยาย SubWallet",
          "description": "เราขอแนะนำให้คุณตรึง SubWallet ไว้ที่แถบงานของคุณเพื่อเข้าถึงกระเป๋าเงินของคุณได้เร็วขึ้น"
        },
        "step2": {
          "title": "สร้างหรือนำเข้า Wallet",
          "description": "ให้แน่ใจว่าคุณได้สำรองกระเป๋าเงินของคุณโดยใช้วิธีที่ปลอดภัย อย่าเปิดเผยวลีการกู้คืนของคุณให้ใครทราบเด็ดขาด"
        },
        "step3": {
          "title": "รีเฟรชเบราว์เซอร์ของคุณ",
          "description": "เมื่อคุณตั้งค่ากระเป๋าเงินของคุณแล้วคลิกด้านล่างเพื่อรีเฟรชเบราว์เซอร์และโหลดส่วนเสริม"
        }
      },
      "qr_code": {
        "step1": {
          "title": "เปิดแอพ SubWallet",
          "description": "เราขอแนะนำให้วาง SubWallet ไว้ที่หน้าจอหลักของคุณเพื่อเข้าถึงได้เร็วขึ้น"
        },
        "step2": {
          "title": "สร้างหรือนำเข้า Wallet",
          "description": "ตรวจสอบการสำรองข้อมูลกระเป๋าสตางค์ของคุณให้แน่นอนโดยใช้วิธีที่ปลอดภัย อย่าแชร์วลีลับของคุณกับใครเป็นอันขาด."
        },
        "step3": {
          "title": "แตะปุ่มสแกน",
          "description": "หลังจากคุณสแกน จะปรากฏหน้าต่างเชื่อมต่อให้คุณเชื่อมต่อกระเป๋าเงินของคุณ"
        }
      }
    },
    "clv": {
      "extension": {
        "step1": {
          "title": "ติดตั้งส่วนขยาย CLV Wallet",
          "description": "เราขอแนะนำให้คุณตรึง CLV Wallet ไว้ที่แถบงานของคุณเพื่อเข้าถึงกระเป๋าเงินของคุณได้เร็วขึ้น"
        },
        "step2": {
          "title": "สร้างหรือนำเข้า Wallet",
          "description": "ตรวจสอบการสำรองข้อมูลกระเป๋าสตางค์ของคุณให้แน่นอนโดยใช้วิธีที่ปลอดภัย อย่าแชร์วลีลับของคุณกับใครเป็นอันขาด."
        },
        "step3": {
          "title": "รีเฟรชเบราว์เซอร์ของคุณ",
          "description": "เมื่อคุณตั้งค่ากระเป๋าเงินของคุณแล้วคลิกด้านล่างเพื่อรีเฟรชเบราว์เซอร์และโหลดส่วนเสริม"
        }
      },
      "qr_code": {
        "step1": {
          "title": "เปิดแอพ CLV Wallet",
          "description": "เราแนะนำให้คุณวาง CLV Wallet บนหน้าจอหลักเพื่อให้สามารถเข้าถึงได้เร็วขึ้น"
        },
        "step2": {
          "title": "สร้างหรือนำเข้า Wallet",
          "description": "ตรวจสอบการสำรองข้อมูลกระเป๋าสตางค์ของคุณให้แน่นอนโดยใช้วิธีที่ปลอดภัย อย่าแชร์วลีลับของคุณกับใครเป็นอันขาด."
        },
        "step3": {
          "title": "แตะปุ่มสแกน",
          "description": "หลังจากคุณสแกน จะปรากฏหน้าต่างเชื่อมต่อให้คุณเชื่อมต่อกระเป๋าเงินของคุณ"
        }
      }
    },
    "okto": {
      "qr_code": {
        "step1": {
          "title": "เปิดแอพ Okto",
          "description": "เพิ่ม Okto ไปยังหน้าจอหลักของคุณเพื่อเข้าถึงได้เร็ว"
        },
        "step2": {
          "title": "สร้างกระเป๋าเงิน MPC",
          "description": "สร้างบัญชีและสร้างกระเป๋าเงิน"
        },
        "step3": {
          "title": "แตะ WalletConnect ในการตั้งค่า",
          "description": "แตะที่ไอคอน Scan QR ที่บริเวณมุมบนขวาและยืนยันข้อความเพื่อเชื่อมต่อ."
        }
      }
    },
    "ledger": {
      "desktop": {
        "step1": {
          "title": "เปิดแอป Ledger Live",
          "description": "เราแนะนำให้คุณวาง Ledger Live บนหน้าจอหลักเพื่อให้สามารถเข้าถึงได้เร็วขึ้น"
        },
        "step2": {
          "title": "ตั้งค่า Ledger ของคุณ",
          "description": "ตั้งค่า Ledger ใหม่หรือเชื่อมต่อกับ Ledger ที่มีอยู่แล้ว"
        },
        "step3": {
          "title": "เชื่อมต่อ",
          "description": "หลังจากที่คุณสแกนแล้ว จะมีการเรียกให้เชื่อมต่อกับกระเป๋าเงินของคุณ"
        }
      },
      "qr_code": {
        "step1": {
          "title": "เปิดแอป Ledger Live",
          "description": "เราแนะนำให้วาง Ledger Live บนหน้าจอหลักของคุณเพื่อการเข้าถึงที่รวดเร็วขึ้น"
        },
        "step2": {
          "title": "ตั้งค่า Ledger ของคุณ",
          "description": "คุณสามารถซิงค์กับแอพพลิเคชันบนเดสก์ท็อปหรือเชื่อมต่อ Ledger ของคุณ"
        },
        "step3": {
          "title": "สแกนรหัส",
          "description": "แตะ WalletConnect แล้วเปลี่ยนไปที่ Scanner. หลังจากที่คุณสแกนแล้ว จะมีการเรียกให้เชื่อมต่อกับกระเป๋าเงินของคุณ"
        }
      }
    }
  }
}
`;const Mn=Object.freeze(Object.defineProperty({__proto__:null,default:Cn},Symbol.toStringTag,{value:"Module"}));var rn=`{
  "connect_wallet": {
    "label": "Cüzdanı Bağla"
  },
  "intro": {
    "title": "Cüzdan nedir?",
    "description": "Bir cüzdan, dijital varlıkları göndermek, almak, saklamak ve görüntülemek için kullanılır. Aynı zamanda her web sitesinde yeni hesaplar ve şifreler oluşturmanıza gerek kalmadan oturum açmanın yeni bir yoludur.",
    "digital_asset": {
      "title": "Dijital Varlıklarınız İçin Bir Ev",
      "description": "Cüzdanlar, Ethereum ve NFT'ler gibi dijital varlıkları göndermek, almak, depolamak ve görüntülemek için kullanılır."
    },
    "login": {
      "title": "Yeni Bir Giriş Yolu",
      "description": "Her web sitesinde yeni hesap ve parolalar oluşturmak yerine, sadece cüzdanınızı bağlayın."
    },
    "get": {
      "label": "Bir Cüzdan Edinin"
    },
    "learn_more": {
      "label": "Daha fazla bilgi edinin"
    }
  },
  "sign_in": {
    "label": "Hesabınızı doğrulayın",
    "description": "Bağlantıyı tamamlamak için, bu hesabın sahibi olduğunuzu doğrulamak için cüzdanınızdaki bir mesaja imza atmalısınız.",
    "message": {
      "send": "Mesajı gönder",
      "preparing": "Mesaj hazırlanıyor...",
      "cancel": "İptal",
      "preparing_error": "Mesajı hazırlarken hata oluştu, lütfen tekrar deneyin!"
    },
    "signature": {
      "waiting": "İmza bekleniyor...",
      "verifying": "İmza doğrulanıyor...",
      "signing_error": "Mesajı imzalarken hata oluştu, lütfen tekrar deneyin!",
      "verifying_error": "İmza doğrulanırken hata oluştu, lütfen tekrar deneyin!",
      "oops_error": "Hata, bir şeyler yanlış gitti!"
    }
  },
  "connect": {
    "label": "Bağlan",
    "title": "Bir Cüzdanı Bağla",
    "new_to_ethereum": {
      "description": "Ethereum cüzdanlarına yeni misiniz?",
      "learn_more": {
        "label": "Daha fazla bilgi edinin"
      }
    },
    "learn_more": {
      "label": "Daha fazla bilgi edinin"
    },
    "recent": "Son",
    "status": {
      "opening": "%{wallet}açılıyor...",
      "connecting": "Bağlanıyor",
      "connect_mobile": "%{wallet}'da devam edin",
      "not_installed": "%{wallet} yüklü değil",
      "not_available": "%{wallet} kullanılabilir değil",
      "confirm": "Bağlantıyı eklentide onaylayın",
      "confirm_mobile": "Cüzdanında bağlantı isteğini kabul et"
    },
    "secondary_action": {
      "get": {
        "description": "%{wallet}yok mu?",
        "label": "AL"
      },
      "install": {
        "label": "YÜKLE"
      },
      "retry": {
        "label": "YENİDEN DENE"
      }
    },
    "walletconnect": {
      "description": {
        "full": "Resmi WalletConnect modalına mı ihtiyacınız var?",
        "compact": "WalletConnect modalına mı ihtiyacınız var?"
      },
      "open": {
        "label": "AÇ"
      }
    }
  },
  "connect_scan": {
    "title": "%{wallet}ile tarama yapın",
    "fallback_title": "Telefonunuzla tarama yapın"
  },
  "connector_group": {
    "recommended": "Tavsiye Edilen",
    "other": "Diğer",
    "popular": "Popüler",
    "more": "Daha Fazla",
    "others": "Diğerleri"
  },
  "get": {
    "title": "Bir Cüzdan Edinin",
    "action": {
      "label": "AL"
    },
    "mobile": {
      "description": "Mobil Cüzdan"
    },
    "extension": {
      "description": "Tarayıcı Eklentisi"
    },
    "mobile_and_extension": {
      "description": "Mobil Cüzdan ve Eklenti"
    },
    "mobile_and_desktop": {
      "description": "Mobil ve Masaüstü Cüzdan"
    },
    "looking_for": {
      "title": "Aradığınız şey bu değil mi?",
      "mobile": {
        "description": "Ana ekranda başka bir cüzdan sağlayıcısıyla başlamak için bir cüzdan seçin."
      },
      "desktop": {
        "compact_description": "Ana ekranda başka bir cüzdan sağlayıcısıyla başlamak için bir cüzdan seçin.",
        "wide_description": "Başka bir cüzdan sağlayıcısıyla başlamak için sol tarafta bir cüzdan seçin."
      }
    }
  },
  "get_options": {
    "title": "%{wallet}ile başlayın",
    "short_title": "%{wallet}Edinin",
    "mobile": {
      "title": "%{wallet} Mobil İçin",
      "description": "Mobil cüzdanı kullanarak Ethereum dünyasını keşfedin.",
      "download": {
        "label": "Uygulamayı alın"
      }
    },
    "extension": {
      "title": "%{wallet} için %{browser}",
      "description": "Cüzdanınıza favori web tarayıcınızdan doğrudan erişin.",
      "download": {
        "label": "%{browser}'e ekle"
      }
    },
    "desktop": {
      "title": "%{wallet} için %{platform}",
      "description": "Güçlü masaüstünüzden cüzdanınıza yerel olarak erişin.",
      "download": {
        "label": "%{platform}ekleyin"
      }
    }
  },
  "get_mobile": {
    "title": "%{wallet}'i yükleyin",
    "description": "iOS veya Android'de indirmek için telefonunuzla tarayın",
    "continue": {
      "label": "Devam et"
    }
  },
  "get_instructions": {
    "mobile": {
      "connect": {
        "label": "Bağlan"
      },
      "learn_more": {
        "label": "Daha fazla bilgi edinin"
      }
    },
    "extension": {
      "refresh": {
        "label": "Yenile"
      },
      "learn_more": {
        "label": "Daha fazla bilgi edinin"
      }
    },
    "desktop": {
      "connect": {
        "label": "Bağlan"
      },
      "learn_more": {
        "label": "Daha fazla bilgi edinin"
      }
    }
  },
  "chains": {
    "title": "Ağları Değiştir",
    "wrong_network": "Yanlış ağ algılandı, devam etmek için bağlantıyı kesin veya değiştirin.",
    "confirm": "Cüzdanında Onayla",
    "switching_not_supported": "Cüzdanınız %{appName}. ağları değiştirmeyi desteklemiyor. Bunun yerine cüzdanınızdan ağları değiştirmeyi deneyin.",
    "switching_not_supported_fallback": "Cüzdanınız bu uygulamadan ağları değiştirmeyi desteklemiyor. Bunun yerine cüzdanınızdaki ağları değiştirmeyi deneyin.",
    "disconnect": "Bağlantıyı Kes",
    "connected": "Bağlı"
  },
  "profile": {
    "disconnect": {
      "label": "Bağlantıyı Kes"
    },
    "copy_address": {
      "label": "Adresi Kopyala",
      "copied": "Kopyalandı!"
    },
    "explorer": {
      "label": "Explorer üzerinde daha fazlasını görün"
    },
    "transactions": {
      "description": "%{appName} işlem burada görünecek...",
      "description_fallback": "İşlemleriniz burada görünecek...",
      "recent": {
        "title": "Son İşlemler"
      },
      "clear": {
        "label": "Hepsini Temizle"
      }
    }
  },
  "wallet_connectors": {
    "argent": {
      "qr_code": {
        "step1": {
          "description": "Cüzdanınıza daha hızlı erişim için Argent'i ana ekranınıza koyun.",
          "title": "Argent uygulamasını açın"
        },
        "step2": {
          "description": "Bir cüzdan ve kullanıcı adı oluşturun veya mevcut bir cüzdanı içe aktarın.",
          "title": "Cüzdan Oluştur veya Cüzdanı İçe Aktar"
        },
        "step3": {
          "description": "Taradıktan sonra, cüzdanınızı bağlamak için bir bağlantı istemi görünecektir.",
          "title": "QR tarayıcı düğmesine dokunun"
        }
      }
    },
    "bifrost": {
      "qr_code": {
        "step1": {
          "description": "Daha hızlı erişim için Bifrost Cüzdan'ı ana ekranınıza koymanızı öneririz.",
          "title": "Bifrost Cüzdan uygulamasını açın"
        },
        "step2": {
          "description": "Kurtarma ifadenizle bir cüzdan oluşturun veya içe aktarın.",
          "title": "Cüzdan Oluştur veya Cüzdanı İçe Aktar"
        },
        "step3": {
          "description": "Tarama işlemi sonrasında, cüzdanınızı bağlamak için bir bağlantı istemi gözükecektir.",
          "title": "Tarayıcı düğmesine dokunun"
        }
      }
    },
    "bitget": {
      "qr_code": {
        "step1": {
          "description": "Daha hızlı erişim için Bitget Cüzdanınızı ana ekranınıza koymanızı öneririz.",
          "title": "Bitget Cüzdan uygulamasını açın"
        },
        "step2": {
          "description": "Cüzdanınızı güvenli bir yöntemle yedeklemeye emin olun. Gizli ifadenizi asla kimseyle paylaşmayın.",
          "title": "Cüzdan Oluştur veya Cüzdanı İçe Aktar"
        },
        "step3": {
          "description": "Tarama yaptıktan sonra, cüzdanınızı bağlamak için bir bağlantı istemi görünecektir.",
          "title": "Tarama düğmesine dokunun"
        }
      },
      "extension": {
        "step1": {
          "description": "Cüzdanınıza daha hızlı erişim için Bitget Cüzdanını görev çubuğunuza sabitlemenizi öneririz.",
          "title": "Bitget Cüzdan eklentisini yükleyin"
        },
        "step2": {
          "description": "Cüzdanınızı güvenli bir yöntemle yedeklemekten emin olun. Gizli ifadenizi hiç kimseyle paylaşmayın.",
          "title": "Bir Cüzdan Oluşturun veya İçe Aktarın"
        },
        "step3": {
          "description": "Cüzdanınızı kurduktan sonra, aşağıya tıklayın ve tarayıcıyı yenileyin ve eklentiyi yükleyin.",
          "title": "Tarayıcınızı yenileyin"
        }
      }
    },
    "bitski": {
      "extension": {
        "step1": {
          "description": "Cüzdanınıza daha hızlı erişim için Bitski'yi görev çubuğunuza sabitlemenizi öneririz.",
          "title": "Bitski eklentisini yükleyin"
        },
        "step2": {
          "description": "Cüzdanınızı güvenli bir yöntem kullanarak yedeklediğinizden emin olun. Gizli ifadenizi kimseyle paylaşmayın.",
          "title": "Bir Cüzdan Oluşturun veya İçe Aktarın"
        },
        "step3": {
          "description": "Cüzdanınızı kurduktan sonra, tarayıcıyı yenilemek ve eklentiyi yüklemek için aşağıya tıklayın.",
          "title": "Tarayıcınızı yenileyin"
        }
      }
    },
    "coin98": {
      "qr_code": {
        "step1": {
          "description": "Cüzdanınıza daha hızlı erişim için Coin98 Cüzdanınızı ana ekranınıza koymanızı öneririz.",
          "title": "Coin98 Cüzdan uygulamasını açın"
        },
        "step2": {
          "description": "Telefonunuzdaki yedekleme özelliğimizi kullanarak cüzdanınızı kolayca yedekleyebilirsiniz.",
          "title": "Cüzdan Oluştur veya Cüzdanı İçe Aktar"
        },
        "step3": {
          "description": "Tarama işlemi yaptıktan sonra, cüzdanınızı bağlamak için bir bağlantı istemi görünecektir.",
          "title": "CüzdanBağlantısı düğmesine dokunun"
        }
      },
      "extension": {
        "step1": {
          "description": "Tarayıcınızın sağ üst köşesinde tıklayın ve Coin98 Cüzdanınızı kolay erişim için sabitleyin.",
          "title": "Coin98 Cüzdan eklentisini yükleyin"
        },
        "step2": {
          "description": "Yeni bir cüzdan oluşturun veya mevcut birini içe aktarın.",
          "title": "Bir cüzdan oluşturun veya içe aktarın"
        },
        "step3": {
          "description": "Coin98 Cüzdan'ı kurduktan sonra, tarayıcıyı yenilemek ve eklentiyi yüklemek için aşağıya tıklayın.",
          "title": "Tarayıcınızı yenileyin"
        }
      }
    },
    "coinbase": {
      "qr_code": {
        "step1": {
          "description": "Coinbase Cüzdan'ı ana ekranınıza koymanızı öneririz, böylece daha hızlı erişim sağlanır.",
          "title": "Coinbase Wallet uygulamasını açın"
        },
        "step2": {
          "description": "Cüzdanınızı bulut yedekleme özelliğini kullanarak kolayca yedekleyebilirsiniz.",
          "title": "Bir Cüzdan Oluşturun veya İçe Aktarın"
        },
        "step3": {
          "description": "Tarama yaptıktan sonra, cüzdanınızı bağlamanız için bir bağlantı istemi belirecektir.",
          "title": "Tarama düğmesine dokunun"
        }
      },
      "extension": {
        "step1": {
          "description": "Cüzdanınıza daha hızlı erişim için Coinbase Wallet'ı görev çubuğunuza sabitlemenizi öneririz.",
          "title": "Coinbase Wallet uzantısını yükleyin"
        },
        "step2": {
          "description": "Cüzdanınızı güvenli bir yöntem kullanarak yedekleyin. Gizli ifadenizi asla başkalarıyla paylaşmayın.",
          "title": "Cüzdan Oluştur veya İçe Aktar"
        },
        "step3": {
          "description": "Cüzdanınızı kurduktan sonra, tarayıcıyı yenilemek ve eklentiyi yüklemek için aşağıya tıklayın.",
          "title": "Tarayıcınızı yenileyin"
        }
      }
    },
    "core": {
      "qr_code": {
        "step1": {
          "description": "Cüzdanınıza daha hızlı erişim için Core'u ana ekranınıza koymanızı öneririz.",
          "title": "Core uygulamasını açın"
        },
        "step2": {
          "description": "Cüzdanınızın yedeğini telefonunuzda bulunan yedekleme özelliğimizi kullanarak kolayca alabilirsiniz.",
          "title": "Cüzdan Oluştur veya İçe Aktar"
        },
        "step3": {
          "description": "Tarama yaptıktan sonra, cüzdanınızı bağlamak üzere bir bağlantı istemi görünecektir.",
          "title": "WalletConnect düğmesine dokunun"
        }
      },
      "extension": {
        "step1": {
          "description": "Cüzdanınıza daha hızlı erişim için Core'u görev çubuğunuza sabitlemenizi öneririz.",
          "title": "Core eklentisini yükleyin"
        },
        "step2": {
          "description": "Cüzdanınızı güvenli bir yöntemle yedeklemeye dikkat edin. Gizli ifadenizi asla kimseyle paylaşmayın.",
          "title": "Bir Cüzdan Oluşturun veya İçe Aktarın"
        },
        "step3": {
          "description": "Cüzdanınızı kurduktan sonra, aşağıya tıklayarak tarayıcıyı yenileyin ve eklentiyi yükleyin.",
          "title": "Tarayıcınızı yenileyin"
        }
      }
    },
    "fox": {
      "qr_code": {
        "step1": {
          "description": "Daha hızlı erişim için FoxWallet'ı ana ekranınıza koymanızı öneririz.",
          "title": "FoxWallet uygulamasını açın"
        },
        "step2": {
          "description": "Cüzdanınızı güvenli bir yöntem kullanarak yedeklediğinizden emin olun. Gizli ifadenizi asla kimseyle paylaşmayın.",
          "title": "Cüzdan Oluştur veya Cüzdanı İçe Aktar"
        },
        "step3": {
          "description": "Tarama yaptıktan sonra cüzdanınızı bağlamanız için bir bağlantı istemi belirecektir.",
          "title": "Tarama düğmesine dokunun"
        }
      }
    },
    "frontier": {
      "qr_code": {
        "step1": {
          "description": "Daha hızlı erişim için Frontier Cüzdanını ana ekranınıza koymanızı öneririz.",
          "title": "Frontier Cüzdan uygulamasını açın"
        },
        "step2": {
          "description": "Cüzdanınızı güvenli bir yöntem kullanarak yedeklediğinizden emin olun. Gizli ifadenizi asla kimseyle paylaşmayın.",
          "title": "Cüzdan Oluştur veya Cüzdanı İçe Aktar"
        },
        "step3": {
          "description": "Taramadan sonra, cüzdanınızı bağlamak için bir bağlantı istemi görünecektir.",
          "title": "Tarama düğmesine dokunun"
        }
      },
      "extension": {
        "step1": {
          "description": "Cüzdanınıza daha hızlı erişim için Frontier Cüzdanını görev çubuğunuza sabitlemenizi öneririz.",
          "title": "Frontier Cüzdan eklentisini yükleyin"
        },
        "step2": {
          "description": "Cüzdanınızı güvenli bir yöntemle yedeklediğinizden emin olun. Gizli ifadenizi hiç kimseyle paylaşmayın.",
          "title": "Cüzdan Oluştur veya Cüzdanı İçe Aktar"
        },
        "step3": {
          "description": "Cüzdanınızı ayarladıktan sonra, tarayıcıyı yenilemeye ve eklentiyi yüklemeye başlamak için aşağıya tıklayın.",
          "title": "Tarayıcınızı Yenileyin"
        }
      }
    },
    "im_token": {
      "qr_code": {
        "step1": {
          "title": "imToken uygulamasını açın",
          "description": "Cüzdanınıza daha hızlı erişim için imToken uygulamasını ana ekranınıza koyun."
        },
        "step2": {
          "title": "Cüzdan Oluştur veya Cüzdanı İçe Aktar",
          "description": "Yeni bir cüzdan oluşturun veya mevcut bir cüzdanı içe aktarın."
        },
        "step3": {
          "title": "Sağ üst köşede Tarayıcı Simgesine dokunun",
          "description": "Yeni Bağlantı'yı seçin, ardından QR kodunu tarayın ve bağlantıyı onaylamak için istemi onaylayın."
        }
      }
    },
    "metamask": {
      "qr_code": {
        "step1": {
          "title": "MetaMask uygulamasını açın",
          "description": "Daha hızlı erişim için MetaMask'ı ana ekranınıza koymanızı öneririz."
        },
        "step2": {
          "title": "Bir Cüzdan Oluşturun veya İçe Aktarın",
          "description": "Cüzdanınızı güvenli bir yöntem kullanarak yedekleyin. Gizli kurtarma ifadenizi asla başkalarıyla paylaşmayın."
        },
        "step3": {
          "title": "Tarama düğmesine dokunun",
          "description": "Taramayı yaptıktan sonra, cüzdanınızı bağlamak için bir bağlantı istemi belirecektir."
        }
      },
      "extension": {
        "step1": {
          "title": "MetaMask eklentisini yükleyin",
          "description": "Cüzdanınıza daha hızlı erişim için MetaMask'i görev çubuğunuza sabitlemenizi öneririz."
        },
        "step2": {
          "title": "Bir Cüzdan Oluşturun veya İçe Aktarın",
          "description": "Cüzdanınızı güvenli bir yöntemle yedeklediğinizden emin olun. Gizli ifadenizi hiç kimseyle paylaşmayın."
        },
        "step3": {
          "title": "Tarayıcınızı Yenileyin",
          "description": "Cüzdanınızı ayarladıktan sonra, tarayıcıyı yenilemek ve eklentiyi yüklemek için aşağıya tıklayın."
        }
      }
    },
    "okx": {
      "qr_code": {
        "step1": {
          "title": "OKX Wallet uygulamasını açın",
          "description": "Daha hızlı erişim için OKX Wallet'ı ana ekranınıza koymanızı öneririz."
        },
        "step2": {
          "title": "Bir Cüzdan Oluşturun veya İçe Aktarın",
          "description": "Cüzdanınızı güvenli bir yöntem kullanarak yedeklediğinizden emin olun. Gizli cümlenizi asla kimseyle paylaşmayın."
        },
        "step3": {
          "title": "Tarama düğmesine dokunun",
          "description": "Tarama yaptıktan sonra, cüzdanınızı bağlama istemi görünecektir."
        }
      },
      "extension": {
        "step1": {
          "title": "OKX Cüzdan eklentisini yükleyin",
          "description": "Cüzdanınıza daha hızlı erişim için OKX Cüzdan'ı görev çubuğunuza sabitlemenizi öneririz."
        },
        "step2": {
          "title": "Cüzdan Oluşturun veya İçe Aktarın",
          "description": "Cüzdanınızı güvenli bir yöntem kullanarak yedeklediğinizden emin olun. Gizli cümlenizi asla kimseyle paylaşmayın."
        },
        "step3": {
          "title": "Tarayıcınızı yenileyin",
          "description": "Cüzdanınızı kurduktan sonra, tarayıcıyı yenilemek ve eklentiyi yüklemek için aşağıya tıklayın."
        }
      }
    },
    "omni": {
      "qr_code": {
        "step1": {
          "title": "Omni uygulamasını açın",
          "description": "Cüzdanınıza daha hızlı erişim için Omni'yi ana ekranınıza ekleyin."
        },
        "step2": {
          "title": "Bir Cüzdan Oluşturun ya da İçe Aktarın",
          "description": "Yeni bir cüzdan oluşturun veya mevcut birini içe aktarın."
        },
        "step3": {
          "title": "QR simgesine dokunun ve tarayın",
          "description": "Ana ekranınızdaki QR simgesine dokunun, kodu tarayın ve bağlanmak için istemi onaylayın."
        }
      }
    },
    "token_pocket": {
      "qr_code": {
        "step1": {
          "title": "TokenPocket uygulamasını açın",
          "description": "Daha hızlı erişim için TokenPocket'ı ana ekranınıza koymanızı öneririz."
        },
        "step2": {
          "title": "Bir Cüzdan Oluşturun veya Cüzdanı İçe Aktarın",
          "description": "Cüzdanınızı güvenli bir yöntem kullanarak yedekleyin. Gizli ifadenizi asla başkalarıyla paylaşmayın."
        },
        "step3": {
          "title": "Tarama düğmesine dokunun",
          "description": "Taramayı yaptıktan sonra, cüzdanınızı bağlamak için bir bağlantı istemi belirecektir."
        }
      },
      "extension": {
        "step1": {
          "title": "TokenPocket eklentisini yükleyin",
          "description": "Cüzdanınıza daha hızlı erişim için TokenPocket'i görev çubuğunuza sabitlemenizi öneririz."
        },
        "step2": {
          "title": "Cüzdan Oluştur veya Cüzdanı İçe Aktar",
          "description": "Cüzdanınızı güvenli bir yöntemle yedeklediğinizden emin olun. Gizli cümlenizi asla başkalarıyla paylaşmayın."
        },
        "step3": {
          "title": "Tarayıcınızı yenileyin",
          "description": "Cüzdanınızı ayarladıktan sonra, tarayıcıyı yenilemekte ve eklentiyi yüklemek için aşağıya tıklayın."
        }
      }
    },
    "trust": {
      "qr_code": {
        "step1": {
          "title": "Trust Wallet uygulamasını açın",
          "description": "Cüzdanınıza daha hızlı erişim için Trust Wallet'ı ana ekranınıza koyun."
        },
        "step2": {
          "title": "Cüzdan Oluştur veya Cüzdanı İçe Aktar",
          "description": "Yeni bir cüzdan oluşturun veya mevcut bir tane içe aktarın."
        },
        "step3": {
          "title": "Ayarlar'da WalletConnect'e dokunun",
          "description": "Yeni Bağlantı'yı seçin, ardından QR kodunu tarayın ve bağlanmak için istemi onaylayın."
        }
      },
      "extension": {
        "step1": {
          "title": "Trust Wallet eklentisini yükleyin",
          "description": "Tarayıcınızın sağ üst köşesine tıklayın ve kolay erişim için Trust Wallet'i sabitleyin."
        },
        "step2": {
          "title": "Bir cüzdan oluşturun veya içe aktarın",
          "description": "Yeni bir cüzdan oluşturun veya mevcut bir tane içe aktarın."
        },
        "step3": {
          "title": "Tarayıcınızı yenileyin",
          "description": "Trust Wallet'ı kurduktan sonra, tarayıcıyı yenilemek ve eklentiyi yüklemek için aşağıya tıklayın."
        }
      }
    },
    "uniswap": {
      "qr_code": {
        "step1": {
          "title": "Uniswap uygulamasını açın",
          "description": "Cüzdanınıza daha hızlı erişim için Uniswap Cüzdanınızı ana ekranınıza ekleyin."
        },
        "step2": {
          "title": "Cüzdan Oluştur veya İçe Aktar",
          "description": "Yeni bir cüzdan oluşturun veya mevcut birini içe aktarın."
        },
        "step3": {
          "title": "QR ikonuna dokunun ve tarama yapın",
          "description": "Ana ekranınızdaki QR simgesine dokunun, kodu tarayın ve bağlanmayı onaylamak için istemi kabul edin."
        }
      }
    },
    "zerion": {
      "qr_code": {
        "step1": {
          "title": "Zerion uygulamasını açın",
          "description": "Daha hızlı erişim için Zerion'un ana ekranınıza konumlandırmanızı öneririz."
        },
        "step2": {
          "title": "Bir Cüzdan Oluşturun veya İçe Aktarın",
          "description": "Cüzdanınızı güvenli bir yöntem kullanarak yedekleyin. Gizli ifadenizi asla başkalarıyla paylaşmayın."
        },
        "step3": {
          "title": "Tarama düğmesine basın",
          "description": "Taramadan sonra, cüzdanınızı bağlamak için bir bağlantı istemi belirecektir."
        }
      },
      "extension": {
        "step1": {
          "title": "Zerion eklentisini yükleyin",
          "description": "Cüzdanınıza daha hızlı erişim için Zerion'u görev çubuğunuza sabitlemenizi öneririz."
        },
        "step2": {
          "title": "Cüzdan Oluştur veya İçe Aktar",
          "description": "Cüzdanınızı güvenli bir yöntem kullanarak yedeklemeye emin olun. Gizli ifadenizi asla başkalarıyla paylaşmayın."
        },
        "step3": {
          "title": "Tarayıcınızı yenileyin",
          "description": "Cüzdanınızı ayarladıktan sonra, tarayıcıyı yenilemek ve eklentiyi yüklemek için aşağıya tıklayın."
        }
      }
    },
    "rainbow": {
      "qr_code": {
        "step1": {
          "title": "Rainbow uygulamasını açın",
          "description": "Cüzdanınıza daha hızlı erişim için Rainbow'u ana ekranınıza koymanızı öneririz."
        },
        "step2": {
          "title": "Cüzdan Oluştur veya İçe Aktar",
          "description": "Telefonunuzdaki yedekleme özelliğimizi kullanarak cüzdanınızı kolayca yedekleyebilirsiniz."
        },
        "step3": {
          "title": "Tarama düğmesine dokunun",
          "description": "Tarama yaptıktan sonra, cüzdanınızı bağlamanız için bir bağlantı istemi belirecektir."
        }
      }
    },
    "enkrypt": {
      "extension": {
        "step1": {
          "description": "Cüzdanınıza daha hızlı erişim sağlamak için Enkrypt Cüzdan'ı görev çubuğunuza sabitlemenizi öneririz.",
          "title": "Enkrypt Cüzdan eklentisini yükleyin"
        },
        "step2": {
          "description": "Cüzdanınızı güvenli bir yöntemle yedeklediğinizden emin olun. Gizli ifadenizi hiç kimseyle paylaşmayın.",
          "title": "Bir Cüzdan Oluşturun veya İçe Aktarın"
        },
        "step3": {
          "description": "Cüzdanınızı kurduktan sonra, tarayıcıyı yenilemek ve eklentiyi yüklemek için aşağıya tıklayın.",
          "title": "Tarayıcınızı yenileyin"
        }
      }
    },
    "frame": {
      "extension": {
        "step1": {
          "description": "Cüzdanınıza daha hızlı erişim sağlamak için Frame'ı görev çubuğunuza sabitlemenizi öneririz.",
          "title": "Frame ve eşlik eden uzantıyı yükleyin"
        },
        "step2": {
          "description": "Cüzdanınızı güvenli bir yöntem kullanarak yedeklediğinizden emin olun. Gizli ifadenizi asla başkasıyla paylaşmayın.",
          "title": "Cüzdan Oluştur veya İçe Aktar"
        },
        "step3": {
          "description": "Cüzdanınızı ayarladıktan sonra, tarayıcıyı yenilemek ve uzantıyı yüklemek için aşağıya tıklayın.",
          "title": "Tarayıcınızı yenileyin"
        }
      }
    },
    "one_key": {
      "extension": {
        "step1": {
          "title": "OneKey Wallet uzantısını yükleyin",
          "description": "Cüzdanınıza daha hızlı erişim için OneKey Wallet'ı görev çubuğunuza sabitlemenizi öneririz."
        },
        "step2": {
          "title": "Cüzdan Oluştur veya İçe Aktar",
          "description": "Cüzdanınızı güvenli bir yöntem kullanarak yedeklediğinizden emin olun. Gizli ifadenizi kimseyle paylaşmayın."
        },
        "step3": {
          "title": "Tarayıcınızı yenileyin",
          "description": "Cüzdanınızı kurduktan sonra, tarayıcıyı yenilemek ve eklentiyi yüklemek için aşağıya tıklayın."
        }
      }
    },
    "phantom": {
      "extension": {
        "step1": {
          "title": "Phantom eklentisini yükleyin",
          "description": "Cüzdanınıza daha kolay erişim sağlamak için Phantom'u görev çubuğunuza sabitlemenizi öneririz."
        },
        "step2": {
          "title": "Bir Cüzdan Oluşturun veya İçe Aktarın",
          "description": "Cüzdanınızı güvenli bir yöntem kullanarak yedeklediğinizden emin olun. Gizli kurtarma ifadenizi kimseyle paylaşmayın."
        },
        "step3": {
          "title": "Tarayıcınızı yenileyin",
          "description": "Cüzdanınızı ayarladıktan sonra, tarayıcıyı yenilemek ve eklentiyi yüklemek için aşağıya tıklayın."
        }
      }
    },
    "rabby": {
      "extension": {
        "step1": {
          "title": "Rabby eklentisini yükleyin",
          "description": "Cüzdanınıza daha hızlı erişim için Rabby'yi görev çubuğunuza sabitlemenizi öneririz."
        },
        "step2": {
          "title": "Cüzdan Oluştur veya İçe Aktar",
          "description": "Cüzdanınızı güvenli bir yöntemle yedeklediğinizden emin olun. Gizli ifadenizi asla başkalarıyla paylaşmayın."
        },
        "step3": {
          "title": "Tarayıcınızı yenileyin",
          "description": "Cüzdanınızı kurduktan sonra, tarayıcıyı yenilemek ve eklentiyi yüklemek için aşağıdaki düğmeye tıklayın."
        }
      }
    },
    "safeheron": {
      "extension": {
        "step1": {
          "title": "Core eklentisini yükleyin",
          "description": "Cüzdanınıza daha hızlı erişim için Safeheron'u görev çubuğunuza sabitlemenizi öneririz."
        },
        "step2": {
          "title": "Cüzdan Oluştur veya İçe Aktar",
          "description": "Cüzdanınızı güvenli bir yöntemle yedeklediğinizden emin olun. Gizli ifadenizi hiç kimseyle paylaşmayın."
        },
        "step3": {
          "title": "Tarayıcınızı yenileyin",
          "description": "Cüzdanınızı ayarladıktan sonra, tarayıcıyı yenilemek ve eklentiyi yüklemek için aşağıya tıklayın."
        }
      }
    },
    "taho": {
      "extension": {
        "step1": {
          "title": "Taho uzantısını yükleyin",
          "description": "Cüzdanınıza daha hızlı erişim için Taho'yu görev çubuğunuza sabitlemenizi öneririz."
        },
        "step2": {
          "title": "Bir Cüzdan Oluşturun veya İçe Aktarın",
          "description": "Cüzdanınızı güvenli bir yöntemle yedeklediğinizden emin olun. Gizli ifadenizi hiç kimseyle paylaşmayın."
        },
        "step3": {
          "title": "Tarayıcınızı yenileyin",
          "description": "Cüzdanınızı ayarladıktan sonra, tarayıcıyı yenilemek ve eklentiyi yüklemek için aşağıya tıklayın."
        }
      }
    },
    "talisman": {
      "extension": {
        "step1": {
          "title": "Talisman eklentisini yükleyin",
          "description": "Cüzdanınıza daha hızlı erişim için Talisman'ı görev çubuğunuza sabitlemenizi öneririz."
        },
        "step2": {
          "title": "Ethereum Cüzdanı Oluşturun veya İçe Aktarın",
          "description": "Cüzdanınızı güvenli bir yöntemle yedeklediğinizden emin olun. Kurtarma ifadenizi hiç kimseyle paylaşmayın."
        },
        "step3": {
          "title": "Tarayıcınızı yenileyin",
          "description": "Cüzdanınızı ayarladıktan sonra, tarayıcıyı yenilemek ve eklentiyi yüklemek için aşağıya tıklayın."
        }
      }
    },
    "xdefi": {
      "extension": {
        "step1": {
          "title": "XDEFI Cüzdan eklentisini yükleyin",
          "description": "Cüzdanınıza daha hızlı erişim için XDEFI Wallet'ı görev çubuğunuza sabitlemenizi öneririz."
        },
        "step2": {
          "title": "Bir Cüzdan Oluşturun veya İçe Aktarın",
          "description": "Cüzdanınızı güvenli bir yöntemle yedeklediğinizden emin olun. Gizli ifadenizi hiç kimseyle paylaşmayın."
        },
        "step3": {
          "title": "Tarayıcınızı yenileyin",
          "description": "Cüzdanınızı ayarladıktan sonra, tarayıcıyı yenilemek ve eklentiyi yüklemek için aşağıya tıklayın."
        }
      }
    },
    "zeal": {
      "extension": {
        "step1": {
          "title": "Zeal eklentisini yükleyin",
          "description": "Cüzdanınıza daha hızlı erişim için Zeal'ı görev çubuğunuza sabitlemenizi öneririz."
        },
        "step2": {
          "title": "Cüzdan Oluştur veya Cüzdanı İçe Aktar",
          "description": "Cüzdanınızı güvenli bir yöntemle yedeklemeye emin olun. Gizli ifadenizi asla kimseyle paylaşmayın."
        },
        "step3": {
          "title": "Tarayıcınızı yenileyin",
          "description": "Cüzdanınızı kurduktan sonra, aşağıya tıklayın ve tarayıcıyı yenileyin ve eklentiyi yükleyin."
        }
      }
    },
    "safepal": {
      "extension": {
        "step1": {
          "title": "SafePal Wallet eklentisini yükleyin",
          "description": "Tarayıcınızın sağ üst köşesine tıklayın ve kolay erişim için SafePal Wallet'ı sabitleyin."
        },
        "step2": {
          "title": "Bir cüzdan oluşturun veya içe aktarın",
          "description": "Yeni bir cüzdan oluşturun veya mevcut birini içe aktarın."
        },
        "step3": {
          "title": "Tarayıcınızı yenileyin",
          "description": "SafePal Cüzdan'ı kurduktan sonra, tarayıcıyı yenilemek ve eklentiyi yüklemek için aşağıya tıklayın."
        }
      },
      "qr_code": {
        "step1": {
          "title": "SafePal Cüzdan uygulamasını açın",
          "description": "SafePal Cüzdan'ı ana ekranınıza koyun, cüzdanınıza daha hızlı erişim için."
        },
        "step2": {
          "title": "Cüzdan Oluştur veya Cüzdanı İçe Aktar",
          "description": "Yeni bir cüzdan oluşturun veya mevcut birini içe aktarın."
        },
        "step3": {
          "title": "Ayarlar'da WalletConnect'e dokunun",
          "description": "Yeni Bağlantı'yı seçin, ardından QR kodunu tarayın ve bağlantıyı onaylamak için istemi onaylayın."
        }
      }
    },
    "desig": {
      "extension": {
        "step1": {
          "title": "Desig eklentisini yükleyin",
          "description": "Cüzdanınıza daha kolay erişim sağlamak için Desig'i görev çubuğunuza sabitlemenizi öneririz."
        },
        "step2": {
          "title": "Bir Cüzdan Oluşturun",
          "description": "Cüzdanınızı güvenli bir yöntemle yedeklemeye emin olun. Gizli ifadenizi asla kimseyle paylaşmayın."
        },
        "step3": {
          "title": "Tarayıcınızı yenileyin",
          "description": "Cüzdanınızı kurduktan sonra, aşağıya tıklayın ve tarayıcıyı yenileyin ve eklentiyi yükleyin."
        }
      }
    },
    "subwallet": {
      "extension": {
        "step1": {
          "title": "SubWallet eklentisini yükleyin",
          "description": "Cüzdanınıza daha hızlı erişim için SubWallet'ı görev çubuğunuza sabitlemenizi öneririz."
        },
        "step2": {
          "title": "Cüzdan Oluştur veya Cüzdanı İçe Aktar",
          "description": "Cüzdanınızı güvenli bir yöntemle yedeklediğinizden emin olun. Kurtarma ifadenizi hiç kimseyle paylaşmayın."
        },
        "step3": {
          "title": "Tarayıcınızı yenileyin",
          "description": "Cüzdanınızı kurduktan sonra, aşağıya tıklayın ve tarayıcıyı yenileyin ve eklentiyi yükleyin."
        }
      },
      "qr_code": {
        "step1": {
          "title": "SubWallet uygulamasını açın",
          "description": "Daha hızlı erişim için SubWallet'ı ana ekranınıza koymenizi öneririz."
        },
        "step2": {
          "title": "Cüzdan Oluştur veya Cüzdanı İçe Aktar",
          "description": "Cüzdanınızı güvenli bir yöntemle yedeklemeye emin olun. Gizli ifadenizi asla kimseyle paylaşmayın."
        },
        "step3": {
          "title": "Tarayıcı düğmesine dokunun",
          "description": "Taradıktan sonra, cüzdanınızı bağlamak için bir bağlantı istemi görünecektir."
        }
      }
    },
    "clv": {
      "extension": {
        "step1": {
          "title": "CLV Cüzdanı eklentisini yükleyin",
          "description": "Cüzdanınıza daha hızlı erişim için CLV Cüzdanını görev çubuğunuza sabitlemenizi öneririz."
        },
        "step2": {
          "title": "Cüzdan Oluştur veya Cüzdanı İçe Aktar",
          "description": "Cüzdanınızı güvenli bir yöntemle yedeklemeye emin olun. Gizli ifadenizi asla kimseyle paylaşmayın."
        },
        "step3": {
          "title": "Tarayıcınızı yenileyin",
          "description": "Cüzdanınızı kurduktan sonra, aşağıya tıklayın ve tarayıcıyı yenileyin ve eklentiyi yükleyin."
        }
      },
      "qr_code": {
        "step1": {
          "title": "CLV Cüzdan uygulamasını açın",
          "description": "Daha hızlı erişim için CLV Cüzdanını ana ekranınıza koymanızı öneririz."
        },
        "step2": {
          "title": "Cüzdan Oluştur veya Cüzdanı İçe Aktar",
          "description": "Cüzdanınızı güvenli bir yöntemle yedeklemeye emin olun. Gizli ifadenizi asla kimseyle paylaşmayın."
        },
        "step3": {
          "title": "Tarayıcı düğmesine dokunun",
          "description": "Taradıktan sonra, cüzdanınızı bağlamak için bir bağlantı istemi görünecektir."
        }
      }
    },
    "okto": {
      "qr_code": {
        "step1": {
          "title": "Okto uygulamasını açın",
          "description": "Hızlı erişim için Okto'yu ana ekranınıza ekleyin"
        },
        "step2": {
          "title": "MPC Cüzdanı oluşturun",
          "description": "Bir hesap oluşturun ve bir cüzdan oluşturun"
        },
        "step3": {
          "title": "Ayarlar'da WalletConnect'e dokunun",
          "description": "Sağ üstteki Tarama QR simgesine dokunun ve bağlanmak için istemi onaylayın."
        }
      }
    },
    "ledger": {
      "desktop": {
        "step1": {
          "title": "Ledger Live uygulamasını açın",
          "description": "Daha hızlı erişim için Ledger Live'ı ana ekranınıza koymanızı öneririz."
        },
        "step2": {
          "title": "Ledger'ınızı kurun",
          "description": "Yeni bir Ledger kurun veya mevcut birine bağlanın."
        },
        "step3": {
          "title": "Bağlan",
          "description": "Cüzdanınızı bağlamak için bir bağlantı istemi belirecektir."
        }
      },
      "qr_code": {
        "step1": {
          "title": "Ledger Live uygulamasını açın",
          "description": "Daha hızlı erişim için Ledger Live'ı ana ekranınıza koymanızı öneririz."
        },
        "step2": {
          "title": "Ledger'ınızı kurun",
          "description": "Masaüstü uygulama ile senkronize olabilir veya Ledger'ınızı bağlayabilirsiniz."
        },
        "step3": {
          "title": "Kodu tarayın",
          "description": "WalletConnect'e dokunun ve ardından Tarayıcı'ya geçin. Taramadan sonra, cüzdanınızı bağlamak için bir bağlantı istemi belirecektir."
        }
      }
    }
  }
}
`;const Dn=Object.freeze(Object.defineProperty({__proto__:null,default:rn},Symbol.toStringTag,{value:"Module"}));var cn=`{
  "connect_wallet": {
    "label": "Під'єднати гаманець"
  },
  "intro": {
    "title": "Що таке гаманець?",
    "description": "Гаманець використовується для відправлення, отримання, зберігання та відображення цифрових активів. Це також новий спосіб входу, без необхідності створювати нові облікові записи та паролі на кожному сайті.",
    "digital_asset": {
      "title": "Дім для ваших цифрових активів",
      "description": "Гаманці використовуються для відправлення, отримання, зберігання та відображення цифрових активів, таких як Ethereum та NFT."
    },
    "login": {
      "title": "Новий спосіб увійти",
      "description": "Замість створення нових облікових записів та паролів на кожному сайті, просто під'єднайте ваш гаманець."
    },
    "get": {
      "label": "Отримати гаманець"
    },
    "learn_more": {
      "label": "Дізнатися більше"
    }
  },
  "sign_in": {
    "label": "Перевірте свій обліковий запис",
    "description": "Щоб завершити підключення, вам потрібно підписати повідомлення у вашому гаманці, щоб підтвердити, що ви є власником цього облікового запису.",
    "message": {
      "send": "Підписати повідомлення",
      "preparing": "Підготовка повідомлення...",
      "cancel": "Скасувати",
      "preparing_error": "Помилка підготовки повідомлення, будь ласка, спробуйте ще раз!"
    },
    "signature": {
      "waiting": "Очікування підпису...",
      "verifying": "Перевірка підпису...",
      "signing_error": "Помилка підпису повідомлення, будь ласка, спробуйте ще раз!",
      "verifying_error": "Помилка перевірки підпису, будь ласка, спробуйте ще раз!",
      "oops_error": "Ой, щось пішло не так!"
    }
  },
  "connect": {
    "label": "Під'єднати",
    "title": "Під'єднати гаманець",
    "new_to_ethereum": {
      "description": "Вперше зіткнулися з гаманцями Ethereum?",
      "learn_more": {
        "label": "Дізнатися більше"
      }
    },
    "learn_more": {
      "label": "Дізнатися більше"
    },
    "recent": "Недавні",
    "status": {
      "opening": "Відкриття %{wallet}...",
      "connecting": "Підключення",
      "connect_mobile": "Продовжити в %{wallet}",
      "not_installed": "%{wallet} не встановлено",
      "not_available": "%{wallet} недоступний",
      "confirm": "Підтвердіть з'єднання в розширенні",
      "confirm_mobile": "Підтвердіть запит на підключення у гаманці"
    },
    "secondary_action": {
      "get": {
        "description": "Не маєте %{wallet}?",
        "label": "ОТРИМАТИ"
      },
      "install": {
        "label": "ВСТАНОВИТИ"
      },
      "retry": {
        "label": "ПОВТОРИТИ"
      }
    },
    "walletconnect": {
      "description": {
        "full": "Потрібне офіційне модальне вікно WalletConnect?",
        "compact": "Потрібне модальне вікно WalletConnect?"
      },
      "open": {
        "label": "ВІДКРИТИ"
      }
    }
  },
  "connect_scan": {
    "title": "Сканувати за допомогою %{wallet}",
    "fallback_title": "Сканувати за допомогою вашого телефону"
  },
  "connector_group": {
    "recommended": "Рекомендовано",
    "other": "Інші",
    "popular": "Популярні",
    "more": "Більше",
    "others": "Інші"
  },
  "get": {
    "title": "Отримати гаманець",
    "action": {
      "label": "ОТРИМАТИ"
    },
    "mobile": {
      "description": "Мобільний Гаманець"
    },
    "extension": {
      "description": "Розширення Браузера"
    },
    "mobile_and_extension": {
      "description": "Мобільний Гаманець та Розширення"
    },
    "mobile_and_desktop": {
      "description": "Мобільний та Настільний Гаманець"
    },
    "looking_for": {
      "title": "Не те, що ви шукаєте?",
      "mobile": {
        "description": "Виберіть гаманець на головному екрані, щоб розпочати роботу з іншим провайдером гаманця."
      },
      "desktop": {
        "compact_description": "Виберіть гаманець на головному екрані, щоб розпочати роботу з іншим провайдером гаманця.",
        "wide_description": "Виберіть гаманець зліва, щоб розпочати роботу з іншим провайдером гаманця."
      }
    }
  },
  "get_options": {
    "title": "Розпочніть з %{wallet}",
    "short_title": "Отримати %{wallet}",
    "mobile": {
      "title": "%{wallet} для Мобільних",
      "description": "Використовуйте мобільний гаманець для вивчення світу Ethereum.",
      "download": {
        "label": "Отримати додаток"
      }
    },
    "extension": {
      "title": "%{wallet} для %{browser}",
      "description": "Отримайте доступ до свого гаманця прямо з улюбленого веб-браузера.",
      "download": {
        "label": "Додати до %{browser}"
      }
    },
    "desktop": {
      "title": "%{wallet} для %{platform}",
      "description": "Отримайте доступ до вашого гаманця нативно з потужного настільного комп'ютера.",
      "download": {
        "label": "Додати до %{platform}"
      }
    }
  },
  "get_mobile": {
    "title": "Встановити %{wallet}",
    "description": "Скануйте за допомогою телефону, щоб завантажити на iOS або Android",
    "continue": {
      "label": "Продовжити"
    }
  },
  "get_instructions": {
    "mobile": {
      "connect": {
        "label": "Під'єднати"
      },
      "learn_more": {
        "label": "Дізнатися більше"
      }
    },
    "extension": {
      "refresh": {
        "label": "Оновити"
      },
      "learn_more": {
        "label": "Дізнатися більше"
      }
    },
    "desktop": {
      "connect": {
        "label": "Під'єднати"
      },
      "learn_more": {
        "label": "Дізнатися більше"
      }
    }
  },
  "chains": {
    "title": "Перемкнути мережу",
    "wrong_network": "Виявлено неправильну мережу, змініть її або від'єднайтеся, щоб продовжити.",
    "confirm": "Підтвердіть у гаманці",
    "switching_not_supported": "Ваш гаманець не підтримує зміну мереж з %{appName}. Спробуйте змінити мережу безпосередньо через ваш гаманець.",
    "switching_not_supported_fallback": "Ваш гаманець не підтримує зміну мереж з цього додатку. Спробуйте змінити мережу безпосередньо через ваш гаманець.",
    "disconnect": "Від'єднатися",
    "connected": "Під'єднано"
  },
  "profile": {
    "disconnect": {
      "label": "Від'єднатися"
    },
    "copy_address": {
      "label": "Скопіювати адресу",
      "copied": "Скопійовано!"
    },
    "explorer": {
      "label": "Переглянути більше в експлорері"
    },
    "transactions": {
      "description": "%{appName} транзакції з'являться тут...",
      "description_fallback": "Тут з'являться ваші транзакції...",
      "recent": {
        "title": "Останні Транзакції"
      },
      "clear": {
        "label": "Очистити Все"
      }
    }
  },
  "wallet_connectors": {
    "argent": {
      "qr_code": {
        "step1": {
          "description": "Додайте Argent на домашній екран для швидшого доступу до вашого гаманця.",
          "title": "Відкрийте додаток Argent"
        },
        "step2": {
          "description": "Створіть гаманець та ім'я користувача, або імпортуйте існуючий гаманець.",
          "title": "Створити або Імпортувати Гаманець"
        },
        "step3": {
          "description": "Після сканування з'явиться запит на під'єднання для підключення вашого гаманця.",
          "title": "Натисніть кнопку 'Сканувати QR-код'"
        }
      }
    },
    "bifrost": {
      "qr_code": {
        "step1": {
          "description": "Ми рекомендуємо додати Bifrost Wallet на ваш домашній екран для швидшого доступу.",
          "title": "Відкрийте додаток Bifrost Wallet"
        },
        "step2": {
          "description": "Створіть або імпортуйте гаманець, використовуючи вашу фразу для відновлення.",
          "title": "Створити або Імпортувати Гаманець"
        },
        "step3": {
          "description": "Після сканування з'явиться запит на під'єднання для підключення вашого гаманця.",
          "title": "Натисніть кнопку сканування"
        }
      }
    },
    "bitget": {
      "qr_code": {
        "step1": {
          "description": "Ми рекомендуємо розмістити Bitget Wallet на вашому домашньому екрані для швидшого доступу.",
          "title": "Відкрийте додаток Bitget Wallet"
        },
        "step2": {
          "description": "Не забудьте зробити резервну копію вашого гаманця за допомогою безпечного методу. Ніколи не діліться вашою секретною фразою з кимось.",
          "title": "Створити або Імпортувати Гаманець"
        },
        "step3": {
          "description": "Після сканування з'явиться запит на під'єднання для підключення вашого гаманця.",
          "title": "Натисніть кнопку сканування"
        }
      },
      "extension": {
        "step1": {
          "description": "Ми рекомендуємо закріпити Bitget Wallet на вашій панелі задач для швидшого доступу до вашого гаманця.",
          "title": "Встановіть розширення Bitget Wallet"
        },
        "step2": {
          "description": "Не забудьте зробити резервну копію вашого гаманця за допомогою безпечного методу. Ніколи не діліться вашою секретною фразою з кимось.",
          "title": "Створити або Імпортувати Гаманець"
        },
        "step3": {
          "description": "Після налаштування вашого гаманця, натисніть нижче, щоб оновити браузер і завантажити розширення.",
          "title": "Оновіть ваш браузер"
        }
      }
    },
    "bitski": {
      "extension": {
        "step1": {
          "description": "Ми рекомендуємо закріпити Bitski на панелі задач для швидшого доступу до вашого гаманця.",
          "title": "Встановіть розширення Bitski"
        },
        "step2": {
          "description": "Не забудьте зробити резервну копію вашого гаманця за допомогою безпечного методу. Ніколи не діліться вашою секретною фразою з кимось.",
          "title": "Створити або Імпортувати Гаманець"
        },
        "step3": {
          "description": "Після налаштування вашого гаманця, натисніть нижче, щоб оновити браузер і завантажити розширення.",
          "title": "Оновіть ваш браузер"
        }
      }
    },
    "coin98": {
      "qr_code": {
        "step1": {
          "description": "Ми рекомендуємо розмістити Coin98 Wallet на домашньому екрані для швидшого доступу до вашого гаманця.",
          "title": "Відкрийте додаток Coin98 Wallet"
        },
        "step2": {
          "description": "Ви можете легко зробити резервну копію вашого гаманця, використовуючи нашу функцію резервного копіювання на вашому телефоні.",
          "title": "Створити або Імпортувати Гаманець"
        },
        "step3": {
          "description": "Після сканування з'явиться запит на під'єднання для підключення вашого гаманця.",
          "title": "Натисніть кнопку WalletConnect"
        }
      },
      "extension": {
        "step1": {
          "description": "Клацніть у верхньому правому куті вашого браузера та закріпіть Coin98 Wallet для зручного доступу.",
          "title": "Встановіть розширення Coin98 Wallet"
        },
        "step2": {
          "description": "Створіть новий гаманець або імпортуйте існуючий.",
          "title": "Створіть або імпортуйте гаманець"
        },
        "step3": {
          "description": "Після налаштування гаманця Coin98 натисніть нижче, щоб оновити браузер і завантажити розширення.",
          "title": "Оновіть ваш браузер"
        }
      }
    },
    "coinbase": {
      "qr_code": {
        "step1": {
          "description": "Ми рекомендуємо додати Coinbase Wallet на домашній екран для швидшого доступу.",
          "title": "Відкрийте додаток Coinbase Wallet"
        },
        "step2": {
          "description": "Ви можете легко створити резервну копію гаманця за допомогою функції хмарного резервного копіювання.",
          "title": "Створити або Імпортувати Гаманець"
        },
        "step3": {
          "description": "Після сканування з'явиться запит на під'єднання для підключення вашого гаманця.",
          "title": "Натисніть кнопку сканування"
        }
      },
      "extension": {
        "step1": {
          "description": "Ми рекомендуємо закріпити Coinbase Wallet на панелі задач для швидшого доступу до вашого гаманця.",
          "title": "Встановіть розширення Coinbase Wallet"
        },
        "step2": {
          "description": "Не забудьте зробити резервну копію вашого гаманця за допомогою безпечного методу. Ніколи не діліться вашою секретною фразою з кимось.",
          "title": "Створити або Імпортувати Гаманець"
        },
        "step3": {
          "description": "Після налаштування вашого гаманця, натисніть нижче, щоб оновити браузер і завантажити розширення.",
          "title": "Оновіть ваш браузер"
        }
      }
    },
    "core": {
      "qr_code": {
        "step1": {
          "description": "Ми рекомендуємо додати Core на домашній екран для швидшого доступу до вашого гаманця.",
          "title": "Відкрийте додаток Core"
        },
        "step2": {
          "description": "Ви можете легко зробити резервну копію вашого гаманця, використовуючи нашу функцію резервного копіювання на вашому телефоні.",
          "title": "Створити або Імпортувати Гаманець"
        },
        "step3": {
          "description": "Після сканування з'явиться запит на під'єднання для підключення вашого гаманця.",
          "title": "Натисніть кнопку WalletConnect"
        }
      },
      "extension": {
        "step1": {
          "description": "Ми рекомендуємо закріпити Core на панелі задач для швидшого доступу до вашого гаманця.",
          "title": "Встановіть розширення Core"
        },
        "step2": {
          "description": "Не забудьте зробити резервну копію вашого гаманця за допомогою безпечного методу. Ніколи не діліться вашою секретною фразою з кимось.",
          "title": "Створити або Імпортувати Гаманець"
        },
        "step3": {
          "description": "Після налаштування вашого гаманця, натисніть нижче, щоб оновити браузер і завантажити розширення.",
          "title": "Оновіть ваш браузер"
        }
      }
    },
    "fox": {
      "qr_code": {
        "step1": {
          "description": "Ми рекомендуємо розмістити FoxWallet на головному екрані для швидшого доступу.",
          "title": "Відкрийте додаток FoxWallet"
        },
        "step2": {
          "description": "Не забудьте зробити резервну копію вашого гаманця за допомогою безпечного методу. Ніколи не діліться вашою секретною фразою з кимось.",
          "title": "Створити або Імпортувати Гаманець"
        },
        "step3": {
          "description": "Після сканування з'явиться запит на під'єднання для підключення вашого гаманця.",
          "title": "Натисніть кнопку сканування"
        }
      }
    },
    "frontier": {
      "qr_code": {
        "step1": {
          "description": "Ми рекомендуємо розмістити Frontier Wallet на головному екрані для швидшого доступу.",
          "title": "Відкрийте додаток Frontier Wallet"
        },
        "step2": {
          "description": "Не забудьте зробити резервну копію вашого гаманця за допомогою безпечного методу. Ніколи не діліться вашою секретною фразою з кимось.",
          "title": "Створити або Імпортувати Гаманець"
        },
        "step3": {
          "description": "Після сканування з'явиться запит на під'єднання для підключення вашого гаманця.",
          "title": "Натисніть кнопку сканування"
        }
      },
      "extension": {
        "step1": {
          "description": "Ми рекомендуємо закріпити Frontier Wallet на панелі задач для швидкого доступу до вашого гаманця.",
          "title": "Встановіть розширення Frontier Wallet"
        },
        "step2": {
          "description": "Не забудьте зробити резервну копію вашого гаманця за допомогою безпечного методу. Ніколи не діліться вашою секретною фразою з кимось.",
          "title": "Створити або Імпортувати Гаманець"
        },
        "step3": {
          "description": "Після налаштування вашого гаманця, натисніть нижче, щоб оновити браузер і завантажити розширення.",
          "title": "Оновіть ваш браузер"
        }
      }
    },
    "im_token": {
      "qr_code": {
        "step1": {
          "title": "Відкрийте додаток imToken",
          "description": "Розмістіть додаток imToken на головному екрані для швидшого доступу до вашого гаманця."
        },
        "step2": {
          "title": "Створити або Імпортувати Гаманець",
          "description": "Створіть новий гаманець або імпортуйте існуючий."
        },
        "step3": {
          "title": "Натисніть на іконку сканера в правому верхньому куті",
          "description": "Виберіть 'Нове з'єднання', потім відскануйте QR-код і підтвердіть запит на підключення."
        }
      }
    },
    "metamask": {
      "qr_code": {
        "step1": {
          "title": "Відкрийте додаток MetaMask",
          "description": "Ми рекомендуємо розмістити MetaMask на головному екрані для швидкого доступу."
        },
        "step2": {
          "title": "Створити або Імпортувати Гаманець",
          "description": "Не забудьте зробити резервну копію вашого гаманця за допомогою безпечного методу. Ніколи не діліться вашою секретною фразою з кимось."
        },
        "step3": {
          "title": "Натисніть кнопку сканування",
          "description": "Після сканування з'явиться запит на під'єднання для підключення вашого гаманця."
        }
      },
      "extension": {
        "step1": {
          "title": "Встановіть розширення MetaMask",
          "description": "Ми рекомендуємо закріпити MetaMask на панелі задач для швидкого доступу до вашого гаманця."
        },
        "step2": {
          "title": "Створити або Імпортувати Гаманець",
          "description": "Не забудьте зробити резервну копію вашого гаманця за допомогою безпечного методу. Ніколи не діліться вашою секретною фразою з кимось."
        },
        "step3": {
          "title": "Оновіть ваш браузер",
          "description": "Після налаштування вашого гаманця, натисніть нижче, щоб оновити браузер і завантажити розширення."
        }
      }
    },
    "okx": {
      "qr_code": {
        "step1": {
          "title": "Відкрийте додаток OKX Wallet",
          "description": "Ми рекомендуємо розмістити OKX Wallet на головному екрані для швидкого доступу."
        },
        "step2": {
          "title": "Створити або Імпортувати Гаманець",
          "description": "Не забудьте зробити резервну копію вашого гаманця за допомогою безпечного методу. Ніколи не діліться вашою секретною фразою з кимось."
        },
        "step3": {
          "title": "Натисніть кнопку сканування",
          "description": "Після сканування з'явиться запит на під'єднання для підключення вашого гаманця."
        }
      },
      "extension": {
        "step1": {
          "title": "Встановіть розширення OKX Wallet",
          "description": "Ми рекомендуємо закріпити OKX Wallet на панелі задач для швидкого доступу до вашого гаманця."
        },
        "step2": {
          "title": "Створити або Імпортувати Гаманець",
          "description": "Не забудьте зробити резервну копію вашого гаманця за допомогою безпечного методу. Ніколи не діліться вашою секретною фразою з кимось."
        },
        "step3": {
          "title": "Оновіть ваш браузер",
          "description": "Після налаштування вашого гаманця, натисніть нижче, щоб оновити браузер і завантажити розширення."
        }
      }
    },
    "omni": {
      "qr_code": {
        "step1": {
          "title": "Відкрийте додаток Omni",
          "description": "Додайте Omni на головний екран для швидшого доступу до вашого гаманця."
        },
        "step2": {
          "title": "Створити або Імпортувати Гаманець",
          "description": "Створіть новий гаманець або імпортуйте існуючий."
        },
        "step3": {
          "title": "Натисніть на іконку QR та відскануйте",
          "description": "Натисніть на іконку QR на вашому головному екрані, відскануйте код та підтвердіть запит для підключення."
        }
      }
    },
    "token_pocket": {
      "qr_code": {
        "step1": {
          "title": "Відкрийте додаток TokenPocket",
          "description": "Ми рекомендуємо розмістити TokenPocket на вашому головному екрані для швидшого доступу."
        },
        "step2": {
          "title": "Створити або Імпортувати Гаманець",
          "description": "Не забудьте зробити резервну копію вашого гаманця за допомогою безпечного методу. Ніколи не діліться вашою секретною фразою з кимось."
        },
        "step3": {
          "title": "Натисніть кнопку сканування",
          "description": "Після сканування з'явиться запит на під'єднання для підключення вашого гаманця."
        }
      },
      "extension": {
        "step1": {
          "title": "Встановіть розширення TokenPocket",
          "description": "Ми рекомендуємо прикріпити TokenPocket до вашої панелі задач для швидкого доступу до вашого гаманця."
        },
        "step2": {
          "title": "Створити або Імпортувати Гаманець",
          "description": "Не забудьте зробити резервну копію вашого гаманця за допомогою безпечного методу. Ніколи не діліться вашою секретною фразою з кимось."
        },
        "step3": {
          "title": "Оновіть ваш браузер",
          "description": "Після налаштування вашого гаманця, натисніть нижче, щоб оновити браузер і завантажити розширення."
        }
      }
    },
    "trust": {
      "qr_code": {
        "step1": {
          "title": "Відкрийте додаток Trust Wallet",
          "description": "Розмістіть Trust Wallet на вашому головному екрані для швидшого доступу до гаманця."
        },
        "step2": {
          "title": "Створити або Імпортувати Гаманець",
          "description": "Створіть новий гаманець або імпортуйте існуючий."
        },
        "step3": {
          "title": "Натисніть WalletConnect у Налаштуваннях",
          "description": "Виберіть 'Нове з'єднання', потім відскануйте QR-код і підтвердіть запит на підключення."
        }
      },
      "extension": {
        "step1": {
          "title": "Встановіть розширення Trust Wallet",
          "description": "Натисніть у верхньому правому куті вашого браузера та закріпіть Trust Wallet для зручного доступу."
        },
        "step2": {
          "title": "Створіть або імпортуйте гаманець",
          "description": "Створіть новий гаманець або імпортуйте існуючий."
        },
        "step3": {
          "title": "Оновіть ваш браузер",
          "description": "Після налаштування Trust Wallet натисніть нижче, щоб оновити браузер та завантажити розширення."
        }
      }
    },
    "uniswap": {
      "qr_code": {
        "step1": {
          "title": "Відкрийте додаток Uniswap",
          "description": "Додайте Uniswap Wallet на свій домашній екран для швидшого доступу до вашого гаманця."
        },
        "step2": {
          "title": "Створити або Імпортувати Гаманець",
          "description": "Створіть новий гаманець або імпортуйте існуючий."
        },
        "step3": {
          "title": "Натисніть на іконку QR та відскануйте",
          "description": "Торкніться іконки QR на вашому домашньому екрані, відскануйте код та підтвердіть запит на підключення."
        }
      }
    },
    "zerion": {
      "qr_code": {
        "step1": {
          "title": "Відкрийте додаток Zerion",
          "description": "Ми рекомендуємо розмістити Zerion на вашому домашньому екрані для швидшого доступу."
        },
        "step2": {
          "title": "Створити або Імпортувати Гаманець",
          "description": "Не забудьте зробити резервну копію вашого гаманця за допомогою безпечного методу. Ніколи не діліться вашою секретною фразою з кимось."
        },
        "step3": {
          "title": "Натисніть кнопку сканування",
          "description": "Після сканування з'явиться запит на під'єднання для підключення вашого гаманця."
        }
      },
      "extension": {
        "step1": {
          "title": "Встановіть розширення Zerion",
          "description": "Ми рекомендуємо закріпити Zerion на вашій панелі завдань для швидшого доступу до вашого гаманця."
        },
        "step2": {
          "title": "Створити або Імпортувати Гаманець",
          "description": "Не забудьте зробити резервну копію вашого гаманця за допомогою безпечного методу. Ніколи не діліться вашою секретною фразою з кимось."
        },
        "step3": {
          "title": "Оновіть ваш браузер",
          "description": "Після налаштування вашого гаманця, натисніть нижче, щоб оновити браузер і завантажити розширення."
        }
      }
    },
    "rainbow": {
      "qr_code": {
        "step1": {
          "title": "Відкрийте додаток Rainbow",
          "description": "Ми рекомендуємо додати Rainbow на домашній екран для швидшого доступу до вашого гаманця."
        },
        "step2": {
          "title": "Створити або Імпортувати Гаманець",
          "description": "Ви можете легко зробити резервну копію вашого гаманця, використовуючи нашу функцію резервного копіювання на вашому телефоні."
        },
        "step3": {
          "title": "Натисніть кнопку сканування",
          "description": "Після сканування з'явиться запит на під'єднання для підключення вашого гаманця."
        }
      }
    },
    "enkrypt": {
      "extension": {
        "step1": {
          "description": "Ми рекомендуємо закріпити Enkrypt Wallet на панелі задач для швидшого доступу до вашого гаманця.",
          "title": "Встановіть розширення Enkrypt Wallet"
        },
        "step2": {
          "description": "Не забудьте зробити резервну копію вашого гаманця за допомогою безпечного методу. Ніколи не діліться вашою секретною фразою з кимось.",
          "title": "Створити або Імпортувати Гаманець"
        },
        "step3": {
          "description": "Після налаштування вашого гаманця, натисніть нижче, щоб оновити браузер і завантажити розширення.",
          "title": "Оновіть ваш браузер"
        }
      }
    },
    "frame": {
      "extension": {
        "step1": {
          "description": "Ми рекомендуємо закріпити Frame на панелі задач для швидшого доступу до вашого гаманця.",
          "title": "Встановіть Frame та супутнє розширення"
        },
        "step2": {
          "description": "Не забудьте зробити резервну копію вашого гаманця за допомогою безпечного методу. Ніколи не діліться вашою секретною фразою з кимось.",
          "title": "Створити або Імпортувати Гаманець"
        },
        "step3": {
          "description": "Після налаштування вашого гаманця, натисніть нижче, щоб оновити браузер і завантажити розширення.",
          "title": "Оновіть ваш браузер"
        }
      }
    },
    "one_key": {
      "extension": {
        "step1": {
          "title": "Встановіть розширення OneKey Wallet",
          "description": "Ми рекомендуємо закріпити OneKey Wallet на панелі задач для швидшого доступу до вашого гаманця."
        },
        "step2": {
          "title": "Створити або Імпортувати Гаманець",
          "description": "Не забудьте зробити резервну копію вашого гаманця за допомогою безпечного методу. Ніколи не діліться вашою секретною фразою з кимось."
        },
        "step3": {
          "title": "Оновіть ваш браузер",
          "description": "Після налаштування вашого гаманця, натисніть нижче, щоб оновити браузер і завантажити розширення."
        }
      }
    },
    "phantom": {
      "extension": {
        "step1": {
          "title": "Встановіть розширення Phantom",
          "description": "Ми рекомендуємо закріпити Phantom на панелі задач для легшого доступу до вашого гаманця."
        },
        "step2": {
          "title": "Створити або Імпортувати Гаманець",
          "description": "Не забудьте зробити резервну копію вашого гаманця за допомогою безпечного методу. Ніколи не діліться вашою секретною фразою відновлення з кимось."
        },
        "step3": {
          "title": "Оновіть ваш браузер",
          "description": "Після налаштування вашого гаманця, натисніть нижче, щоб оновити браузер і завантажити розширення."
        }
      }
    },
    "rabby": {
      "extension": {
        "step1": {
          "title": "Встановіть розширення Rabby",
          "description": "Ми рекомендуємо закріпити Rabby на панелі задач для швидшого доступу до вашого гаманця."
        },
        "step2": {
          "title": "Створити або Імпортувати Гаманець",
          "description": "Не забудьте зробити резервну копію вашого гаманця за допомогою безпечного методу. Ніколи не діліться вашою секретною фразою з кимось."
        },
        "step3": {
          "title": "Оновіть ваш браузер",
          "description": "Після налаштування вашого гаманця, натисніть нижче, щоб оновити браузер і завантажити розширення."
        }
      }
    },
    "safeheron": {
      "extension": {
        "step1": {
          "title": "Встановіть розширення Core",
          "description": "Ми рекомендуємо закріпити Safeheron на панелі задач для швидшого доступу до вашого гаманця."
        },
        "step2": {
          "title": "Створити або Імпортувати Гаманець",
          "description": "Не забудьте зробити резервну копію вашого гаманця за допомогою безпечного методу. Ніколи не діліться вашою секретною фразою з кимось."
        },
        "step3": {
          "title": "Оновіть ваш браузер",
          "description": "Після налаштування вашого гаманця, натисніть нижче, щоб оновити браузер і завантажити розширення."
        }
      }
    },
    "taho": {
      "extension": {
        "step1": {
          "title": "Встановіть розширення Taho",
          "description": "Ми рекомендуємо закріпити Taho на панелі задач для швидшого доступу до вашого гаманця."
        },
        "step2": {
          "title": "Створити або Імпортувати Гаманець",
          "description": "Не забудьте зробити резервну копію вашого гаманця за допомогою безпечного методу. Ніколи не діліться вашою секретною фразою з кимось."
        },
        "step3": {
          "title": "Оновіть ваш браузер",
          "description": "Після налаштування вашого гаманця, натисніть нижче, щоб оновити браузер і завантажити розширення."
        }
      }
    },
    "talisman": {
      "extension": {
        "step1": {
          "title": "Встановіть розширення Talisman",
          "description": "Ми рекомендуємо закріпити Talisman на панелі задач для швидшого доступу до вашого гаманця."
        },
        "step2": {
          "title": "Створіть або Імпортуйте Ethereum гаманець",
          "description": "Не забудьте зробити резервну копію вашого гаманця за допомогою безпечного методу. Ніколи не діліться своєю фразою для відновлення з кимось."
        },
        "step3": {
          "title": "Оновіть ваш браузер",
          "description": "Після налаштування вашого гаманця, натисніть нижче, щоб оновити браузер і завантажити розширення."
        }
      }
    },
    "xdefi": {
      "extension": {
        "step1": {
          "title": "Встановіть розширення гаманця XDEFI",
          "description": "Ми рекомендуємо закріпити гаманець XDEFI на панелі задач для швидшого доступу до вашого гаманця."
        },
        "step2": {
          "title": "Створити або Імпортувати Гаманець",
          "description": "Не забудьте зробити резервну копію вашого гаманця за допомогою безпечного методу. Ніколи не діліться вашою секретною фразою з кимось."
        },
        "step3": {
          "title": "Оновіть ваш браузер",
          "description": "Після налаштування вашого гаманця, натисніть нижче, щоб оновити браузер і завантажити розширення."
        }
      }
    },
    "zeal": {
      "extension": {
        "step1": {
          "title": "Встановіть розширення Zeal",
          "description": "Ми рекомендуємо закріпити Zeal на панелі задач для швидшого доступу до вашого гаманця."
        },
        "step2": {
          "title": "Створити або Імпортувати Гаманець",
          "description": "Не забудьте зробити резервну копію вашого гаманця за допомогою безпечного методу. Ніколи не діліться вашою секретною фразою з кимось."
        },
        "step3": {
          "title": "Оновіть ваш браузер",
          "description": "Після налаштування вашого гаманця, натисніть нижче, щоб оновити браузер і завантажити розширення."
        }
      }
    },
    "safepal": {
      "extension": {
        "step1": {
          "title": "Встановіть розширення SafePal Wallet",
          "description": "Клацніть у верхньому правому куті вашого браузера та закріпіть SafePal Wallet для зручного доступу."
        },
        "step2": {
          "title": "Створіть або імпортуйте гаманець",
          "description": "Створіть новий гаманець або імпортуйте існуючий."
        },
        "step3": {
          "title": "Оновіть ваш браузер",
          "description": "Після налаштування SafePal Wallet натисніть нижче, щоб оновити браузер і завантажити розширення."
        }
      },
      "qr_code": {
        "step1": {
          "title": "Відкрийте додаток SafePal Wallet",
          "description": "Додайте SafePal Wallet на домашній екран для швидшого доступу до вашого гаманця."
        },
        "step2": {
          "title": "Створити або Імпортувати Гаманець",
          "description": "Створіть новий гаманець або імпортуйте існуючий."
        },
        "step3": {
          "title": "Натисніть WalletConnect у Налаштуваннях",
          "description": "Виберіть 'Нове з'єднання', потім відскануйте QR-код і підтвердіть запит на підключення."
        }
      }
    },
    "desig": {
      "extension": {
        "step1": {
          "title": "Встановіть розширення Desig",
          "description": "Ми рекомендуємо закріпити Desig на панелі задач для легшого доступу до вашого гаманця."
        },
        "step2": {
          "title": "Створіть гаманець",
          "description": "Не забудьте зробити резервну копію вашого гаманця за допомогою безпечного методу. Ніколи не діліться вашою секретною фразою з кимось."
        },
        "step3": {
          "title": "Оновіть ваш браузер",
          "description": "Після налаштування вашого гаманця, натисніть нижче, щоб оновити браузер і завантажити розширення."
        }
      }
    },
    "subwallet": {
      "extension": {
        "step1": {
          "title": "Встановіть розширення SubWallet",
          "description": "Ми рекомендуємо закріпити SubWallet на панелі задач для швидшого доступу до вашого гаманця."
        },
        "step2": {
          "title": "Створити або Імпортувати Гаманець",
          "description": "Не забудьте зробити резервну копію вашого гаманця за допомогою безпечного методу. Ніколи не діліться своєю фразою для відновлення з кимось."
        },
        "step3": {
          "title": "Оновіть ваш браузер",
          "description": "Після налаштування вашого гаманця, натисніть нижче, щоб оновити браузер і завантажити розширення."
        }
      },
      "qr_code": {
        "step1": {
          "title": "Відкрийте додаток SubWallet",
          "description": "Ми рекомендуємо розмістити SubWallet на головному екрані для швидшого доступу."
        },
        "step2": {
          "title": "Створити або Імпортувати Гаманець",
          "description": "Не забудьте зробити резервну копію вашого гаманця за допомогою безпечного методу. Ніколи не діліться вашою секретною фразою з кимось."
        },
        "step3": {
          "title": "Натисніть кнопку сканування",
          "description": "Після сканування з'явиться запит на під'єднання для підключення вашого гаманця."
        }
      }
    },
    "clv": {
      "extension": {
        "step1": {
          "title": "Встановіть розширення CLV Wallet",
          "description": "Ми рекомендуємо закріпити CLV Wallet на панелі задач для швидшого доступу до вашого гаманця."
        },
        "step2": {
          "title": "Створити або Імпортувати Гаманець",
          "description": "Не забудьте зробити резервну копію вашого гаманця за допомогою безпечного методу. Ніколи не діліться вашою секретною фразою з кимось."
        },
        "step3": {
          "title": "Оновіть ваш браузер",
          "description": "Після налаштування вашого гаманця, натисніть нижче, щоб оновити браузер і завантажити розширення."
        }
      },
      "qr_code": {
        "step1": {
          "title": "Відкрийте додаток CLV Wallet",
          "description": "Ми рекомендуємо розмістити CLV Wallet на головному екрані для швидшого доступу."
        },
        "step2": {
          "title": "Створити або Імпортувати Гаманець",
          "description": "Не забудьте зробити резервну копію вашого гаманця за допомогою безпечного методу. Ніколи не діліться вашою секретною фразою з кимось."
        },
        "step3": {
          "title": "Натисніть кнопку сканування",
          "description": "Після сканування з'явиться запит на під'єднання для підключення вашого гаманця."
        }
      }
    },
    "okto": {
      "qr_code": {
        "step1": {
          "title": "Відкрийте додаток Okto",
          "description": "Додайте Okto на домашній екран для швидкого доступу"
        },
        "step2": {
          "title": "Створіть MPC гаманець",
          "description": "Створіть обліковий запис та згенеруйте гаманець"
        },
        "step3": {
          "title": "Натисніть WalletConnect у Налаштуваннях",
          "description": "Натисніть на іконку Сканування QR-коду в правому верхньому куті та підтвердіть запит для підключення."
        }
      }
    },
    "ledger": {
      "desktop": {
        "step1": {
          "title": "Відкрийте додаток Ledger Live",
          "description": "Рекомендуємо розмістити Ledger Live на головному екрані для швидшого доступу."
        },
        "step2": {
          "title": "Налаштуйте ваш Ledger",
          "description": "Налаштуйте новий Ledger або під'єднайте існуючий."
        },
        "step3": {
          "title": "Під'єднати",
          "description": "З'явиться запит на підключення для того, щоб ви могли під'єднати свій гаманець."
        }
      },
      "qr_code": {
        "step1": {
          "title": "Відкрийте додаток Ledger Live",
          "description": "Рекомендуємо розмістити Ledger Live на головному екрані для швидшого доступу."
        },
        "step2": {
          "title": "Налаштуйте ваш Ledger",
          "description": "Ви можете синхронізувати з десктопним додатком або підключити ваш Ledger."
        },
        "step3": {
          "title": "Сканувати код",
          "description": "Натисніть WalletConnect, потім перейдіть до сканера. Після сканування з'явиться запит на підключення для того, щоб ви могли під'єднати свій гаманець."
        }
      }
    }
  }
}
`;const sn=Object.freeze(Object.defineProperty({__proto__:null,default:cn},Symbol.toStringTag,{value:"Module"}));var An=`{
  "connect_wallet": {
    "label": "连接钱包"
  },
  "intro": {
    "title": "什么是钱包？",
    "description": "钱包用于发送、接收、存储和显示数字资产。它也是一种新型的登录方式，无需在每个网站上创建新账户和密码。",
    "digital_asset": {
      "title": "您的数字资产之家",
      "description": "钱包用于发送、接收、存储和显示像以太坊和NFT这样的数字资产。"
    },
    "login": {
      "title": "一种新的登录方式",
      "description": "而不是在每个网站上创建新的账户和密码，只需连接您的钱包。"
    },
    "get": {
      "label": "获取钱包"
    },
    "learn_more": {
      "label": "了解更多"
    }
  },
  "sign_in": {
    "label": "验证您的账户",
    "description": "为了完成连接，您必须在钱包中签署一条消息，以验证您是此账户的所有者。",
    "message": {
      "send": "发送消息",
      "preparing": "准备消息中...",
      "cancel": "取消",
      "preparing_error": "准备消息时出错，请重试！"
    },
    "signature": {
      "waiting": "等待签名...",
      "verifying": "正在验证签名...",
      "signing_error": "签署消息时出错，请重试！",
      "verifying_error": "验证签名时出错，请重试！",
      "oops_error": "哎呀，出了点问题！"
    }
  },
  "connect": {
    "label": "连接",
    "title": "连接钱包",
    "new_to_ethereum": {
      "description": "对以太坊钱包不熟悉？",
      "learn_more": {
        "label": "了解更多"
      }
    },
    "learn_more": {
      "label": "了解更多"
    },
    "recent": "近期",
    "status": {
      "opening": "正在打开 %{wallet}...",
      "connecting": "正在连接",
      "connect_mobile": "在 %{wallet}中继续",
      "not_installed": "%{wallet} 尚未安装",
      "not_available": "%{wallet} 不可用",
      "confirm": "在扩展中确认连接",
      "confirm_mobile": "在钱包中接受连接请求"
    },
    "secondary_action": {
      "get": {
        "description": "没有 %{wallet}吗？",
        "label": "获取"
      },
      "install": {
        "label": "安装"
      },
      "retry": {
        "label": "重试"
      }
    },
    "walletconnect": {
      "description": {
        "full": "需要官方的 WalletConnect 弹窗吗？",
        "compact": "需要 WalletConnect 弹窗吗？"
      },
      "open": {
        "label": "打开"
      }
    }
  },
  "connect_scan": {
    "title": "使用 %{wallet}扫描",
    "fallback_title": "使用您的手机扫描"
  },
  "connector_group": {
    "recommended": "推荐",
    "other": "其他",
    "popular": "流行",
    "more": "更多",
    "others": "其他的"
  },
  "get": {
    "title": "获取一个钱包",
    "action": {
      "label": "获取"
    },
    "mobile": {
      "description": "移动钱包"
    },
    "extension": {
      "description": "浏览器扩展"
    },
    "mobile_and_extension": {
      "description": "移动钱包和扩展"
    },
    "mobile_and_desktop": {
      "description": "移动和桌面钱包"
    },
    "looking_for": {
      "title": "不是你要找的吗？",
      "mobile": {
        "description": "在主屏幕上选择一个钱包，以开始使用不同的钱包提供商。"
      },
      "desktop": {
        "compact_description": "在主屏幕上选择一个钱包，以开始使用不同的钱包提供商。",
        "wide_description": "在左侧选择一个钱包，以开始使用不同的钱包提供商。"
      }
    }
  },
  "get_options": {
    "title": "开始使用 %{wallet}",
    "short_title": "获取 %{wallet}",
    "mobile": {
      "title": "%{wallet} 用于移动",
      "description": "使用移动钱包探索以太坊的世界。",
      "download": {
        "label": "获取应用"
      }
    },
    "extension": {
      "title": "%{wallet} 为 %{browser}",
      "description": "从您最喜欢的网络浏览器直接访问您的钱包。",
      "download": {
        "label": "添加到 %{browser}"
      }
    },
    "desktop": {
      "title": "%{wallet} 对于 %{platform}",
      "description": "从您强大的桌面原生访问您的钱包。",
      "download": {
        "label": "添加到 %{platform}"
      }
    }
  },
  "get_mobile": {
    "title": "安装 %{wallet}",
    "description": "用手机扫描下载 iOS 或 Android",
    "continue": {
      "label": "继续"
    }
  },
  "get_instructions": {
    "mobile": {
      "connect": {
        "label": "连接"
      },
      "learn_more": {
        "label": "了解更多"
      }
    },
    "extension": {
      "refresh": {
        "label": "刷新"
      },
      "learn_more": {
        "label": "了解更多"
      }
    },
    "desktop": {
      "connect": {
        "label": "连接"
      },
      "learn_more": {
        "label": "了解更多"
      }
    }
  },
  "chains": {
    "title": "切换网络",
    "wrong_network": "检测到错误的网络，请切换或断开连接以继续。",
    "confirm": "在钱包中确认",
    "switching_not_supported": "您的钱包不支持从 %{appName}切换网络。请尝试从您的钱包内部切换网络。",
    "switching_not_supported_fallback": "您的钱包不支持从此应用切换网络。尝试从您的钱包内切换网络。",
    "disconnect": "断开连接",
    "connected": "已连接"
  },
  "profile": {
    "disconnect": {
      "label": "断开连接"
    },
    "copy_address": {
      "label": "复制地址",
      "copied": "已复制！"
    },
    "explorer": {
      "label": "在浏览器上查看更多"
    },
    "transactions": {
      "description": "%{appName} 交易将会出现在这里...",
      "description_fallback": "您的交易将会出现在这里...",
      "recent": {
        "title": "最近交易"
      },
      "clear": {
        "label": "清除全部"
      }
    }
  },
  "wallet_connectors": {
    "argent": {
      "qr_code": {
        "step1": {
          "description": "将 Argent 放到您的主屏幕上，以便更快地访问您的钱包。",
          "title": "打开 Argent 应用"
        },
        "step2": {
          "description": "创建钱包和用户名，或导入现有钱包。",
          "title": "创建或导入钱包"
        },
        "step3": {
          "description": "在您扫描后，将出现连接提示，供您连接您的钱包。",
          "title": "点击扫描二维码按钮"
        }
      }
    },
    "bifrost": {
      "qr_code": {
        "step1": {
          "description": "我们建议将Bifrost Wallet放在您的主屏幕上，以便更快地访问。",
          "title": "打开 Bifrost Wallet 应用"
        },
        "step2": {
          "description": "使用恢复短语创建或导入钱包。",
          "title": "创建或导入钱包"
        },
        "step3": {
          "description": "在您扫描后，将出现连接提示，供您连接您的钱包。",
          "title": "点击扫描按钮"
        }
      }
    },
    "bitget": {
      "qr_code": {
        "step1": {
          "description": "我们建议您将Bitget钱包添加到主屏幕，以便更快地访问。",
          "title": "打开Bitget钱包应用程序"
        },
        "step2": {
          "description": "务必使用安全的方法备份您的钱包。决不与任何人分享您的秘密短语。",
          "title": "创建或导入钱包"
        },
        "step3": {
          "description": "扫描后，将出现一个连接提示，供您连接您的钱包。",
          "title": "点击扫描按钮"
        }
      },
      "extension": {
        "step1": {
          "description": "我们建议您将Bitget钱包固定在任务栏，以便更快地访问您的钱包。",
          "title": "安装Bitget Wallet扩展"
        },
        "step2": {
          "description": "确保使用安全的方式备份您的钱包。绝不与任何人分享您的秘密短语。",
          "title": "创建或导入钱包"
        },
        "step3": {
          "description": "设置钱包后，点击下方刷新浏览器并加载扩展。",
          "title": "刷新您的浏览器"
        }
      }
    },
    "bitski": {
      "extension": {
        "step1": {
          "description": "我们建议您将Bitski固定在任务栏上，以便更快地访问您的钱包。",
          "title": "安装Bitski扩展"
        },
        "step2": {
          "description": "请确保用安全的方法备份您的钱包。绝不与任何人共享您的秘密短语。",
          "title": "创建或导入钱包"
        },
        "step3": {
          "description": "设置完您的钱包后，点击下方以刷新浏览器并加载扩展程序。",
          "title": "刷新您的浏览器"
        }
      }
    },
    "coin98": {
      "qr_code": {
        "step1": {
          "description": "我们建议将Coin98钱包放在您的主屏幕上，以便更快地访问您的钱包。",
          "title": "打开Coin98钱包应用程序"
        },
        "step2": {
          "description": "您可以使用我们的手机上的备份功能轻松备份您的钱包。",
          "title": "创建或导入钱包"
        },
        "step3": {
          "description": "扫描后，将出现一个连接提示，让您连接您的钱包。",
          "title": "点击WalletConnect按钮"
        }
      },
      "extension": {
        "step1": {
          "description": "点击浏览器右上角并固定Coin98钱包，以便轻松访问。",
          "title": "安装Coin98钱包扩展"
        },
        "step2": {
          "description": "创建新钱包或导入现有钱包。",
          "title": "创建或导入钱包。"
        },
        "step3": {
          "description": "设置完成Coin98 钱包后，单击下方以刷新浏览器并加载扩展程序。",
          "title": "刷新您的浏览器"
        }
      }
    },
    "coinbase": {
      "qr_code": {
        "step1": {
          "description": "我们建议您把Coinbase钱包放到主屏幕上，以便更快地访问。",
          "title": "打开Coinbase钱包应用"
        },
        "step2": {
          "description": "您可以轻松地使用云备份功能备份您的钱包。",
          "title": "创建或导入钱包"
        },
        "step3": {
          "description": "扫描后，将出现连接提示，供您连接您的钱包。",
          "title": "点击扫描按钮"
        }
      },
      "extension": {
        "step1": {
          "description": "我们建议您将Coinbase钱包固定在任务栏上，以便更快地访问您的钱包。",
          "title": "安装Coinbase钱包扩展"
        },
        "step2": {
          "description": "务必使用安全的方法备份您的钱包。永远不要与任何人分享您的秘密短语。",
          "title": "创建或导入钱包"
        },
        "step3": {
          "description": "设置好钱包后，点击下方以刷新浏览器并加载扩展。",
          "title": "刷新您的浏览器"
        }
      }
    },
    "core": {
      "qr_code": {
        "step1": {
          "description": "我们建议您将Core添加到主屏幕，以便更快地访问您的钱包。",
          "title": "打开Core应用程序"
        },
        "step2": {
          "description": "您可以使用我们的手机备份功能轻松备份您的钱包。",
          "title": "创建或导入钱包"
        },
        "step3": {
          "description": "扫描后，将出现连接提示，让您连接您的钱包。",
          "title": "点击WalletConnect按钮"
        }
      },
      "extension": {
        "step1": {
          "description": "我们建议将 Core 固定到任务栏，以便更快地访问您的钱包。",
          "title": "安装 Core 扩展"
        },
        "step2": {
          "description": "一定要使用安全的方法备份您的钱包。切勿与任何人分享您的秘密短语。",
          "title": "创建或导入钱包"
        },
        "step3": {
          "description": "设置好钱包后，点击下方以刷新浏览器并加载扩展。",
          "title": "刷新你的浏览器"
        }
      }
    },
    "fox": {
      "qr_code": {
        "step1": {
          "description": "我们建议您将 FoxWallet 放到主屏幕上，以便更快的访问。",
          "title": "打开 FoxWallet 应用"
        },
        "step2": {
          "description": "确保使用安全的方法备份您的钱包。永远不要与任何人共享您的秘密短语。",
          "title": "创建或导入钱包"
        },
        "step3": {
          "description": "扫描后，将出现连接提示，让您连接您的钱包。",
          "title": "点击扫描按钮"
        }
      }
    },
    "frontier": {
      "qr_code": {
        "step1": {
          "description": "我们建议将 Frontier 钱包放在您的主屏幕上，以便更快地访问。",
          "title": "打开 Frontier 钱包应用"
        },
        "step2": {
          "description": "确保使用安全的方法备份您的钱包。永远不要与任何人共享您的秘密短语。",
          "title": "创建或导入钱包"
        },
        "step3": {
          "description": "扫描后，将出现连接提示，让您连接您的钱包。",
          "title": "点击扫描按钮"
        }
      },
      "extension": {
        "step1": {
          "description": "我们建议您将Frontier钱包固定到任务栏，以便更快地访问您的钱包。",
          "title": "安装Frontier钱包扩展"
        },
        "step2": {
          "description": "确保使用安全的方法备份您的钱包。永远不要与任何人分享您的秘密短语。",
          "title": "创建或导入钱包"
        },
        "step3": {
          "description": "设置完成钱包后，点击下方刷新浏览器并加载扩展。",
          "title": "刷新你的浏览器"
        }
      }
    },
    "im_token": {
      "qr_code": {
        "step1": {
          "title": "打开imToken应用",
          "description": "将imToken应用放在您的主屏幕上，以更快地访问您的钱包。"
        },
        "step2": {
          "title": "创建或导入钱包",
          "description": "创建新钱包或导入已有的钱包。"
        },
        "step3": {
          "title": "点击右上角的扫描图标",
          "description": "选择新连接，然后扫描二维码并确认提示以进行连接。"
        }
      }
    },
    "metamask": {
      "qr_code": {
        "step1": {
          "title": "打开 MetaMask 应用",
          "description": "我们建议将 MetaMask 放在您的主屏幕上，以便更快地访问。"
        },
        "step2": {
          "title": "创建或导入钱包",
          "description": "确保使用安全的方法备份您的钱包。永远不要与任何人分享你的秘密短语。"
        },
        "step3": {
          "title": "点击扫描按钮",
          "description": "扫描后，将出现连接提示，以便你连接你的钱包。"
        }
      },
      "extension": {
        "step1": {
          "title": "安装 MetaMask 扩展",
          "description": "我们建议将MetaMask固定在您的任务栏上，以便更快地访问您的钱包。"
        },
        "step2": {
          "title": "创建或导入钱包",
          "description": "请务必使用安全的方法备份您的钱包。切勿与任何人分享您的秘密短语。"
        },
        "step3": {
          "title": "刷新您的浏览器",
          "description": "一旦您设置好您的钱包，点击下面刷新浏览器并加载扩展。"
        }
      }
    },
    "okx": {
      "qr_code": {
        "step1": {
          "title": "打开OKX钱包应用程序",
          "description": "我们建议将OKX钱包放在您的主屏幕上，以便更快地访问。"
        },
        "step2": {
          "title": "创建或导入钱包",
          "description": "务必使用安全的方法备份您的钱包。千万不要与任何人分享您的秘密短语。"
        },
        "step3": {
          "title": "点击扫描按钮",
          "description": "扫描后，将出现一个连接提示，让您连接您的钱包。"
        }
      },
      "extension": {
        "step1": {
          "title": "安装 OKX 钱包扩展",
          "description": "我们建议将 OKX 钱包固定到您的任务栏，以便更快地访问您的钱包。"
        },
        "step2": {
          "title": "创建或导入钱包",
          "description": "务必使用安全的方法备份您的钱包。千万不要与任何人分享您的秘密短语。"
        },
        "step3": {
          "title": "刷新您的浏览器",
          "description": "一旦你设置好你的钱包，点击下方刷新浏览器并加载扩展。"
        }
      }
    },
    "omni": {
      "qr_code": {
        "step1": {
          "title": "打开Omni应用",
          "description": "将Omni添加到你的主屏幕，以便更快地访问你的钱包。"
        },
        "step2": {
          "title": "创建或导入钱包",
          "description": "创建新的钱包或导入现有的钱包。"
        },
        "step3": {
          "title": "点击QR图标并扫描",
          "description": "点击首页的二维码图标，扫描代码并确认提示以连接。"
        }
      }
    },
    "token_pocket": {
      "qr_code": {
        "step1": {
          "title": "打开TokenPocket应用",
          "description": "我们建议将TokenPocket放在您的主屏幕上以便更快的访问。"
        },
        "step2": {
          "title": "创建或导入钱包",
          "description": "一定要使用安全的方法备份您的钱包。切勿与任何人分享您的秘密短语。"
        },
        "step3": {
          "title": "点击扫描按钮",
          "description": "扫描后，将出现连接提示，供您连接钱包。"
        }
      },
      "extension": {
        "step1": {
          "title": "安装TokenPocket扩展",
          "description": "我们建议将TokenPocket固定到任务栏，以便更快地访问您的钱包。"
        },
        "step2": {
          "title": "创建或导入一个钱包",
          "description": "一定要使用安全的方法备份您的钱包。绝对不要与任何人分享您的秘密短语。"
        },
        "step3": {
          "title": "刷新您的浏览器",
          "description": "设置好您的钱包后，点击下面刷新浏览器并加载扩展。"
        }
      }
    },
    "trust": {
      "qr_code": {
        "step1": {
          "title": "打开Trust Wallet应用",
          "description": "将Trust Wallet放在主屏幕上，以便更快地访问您的钱包。"
        },
        "step2": {
          "title": "创建或导入一个钱包",
          "description": "创建新的钱包或导入现有的钱包。"
        },
        "step3": {
          "title": "在设置中点击WalletConnect",
          "description": "选择新的连接，然后扫描二维码并确认提示以进行连接。"
        }
      },
      "extension": {
        "step1": {
          "title": "安装Trust Wallet扩展程序",
          "description": "在浏览器的右上角点击并固定Trust Wallet以便于访问。"
        },
        "step2": {
          "title": "创建或导入钱包",
          "description": "创建新的钱包或导入现有的钱包。"
        },
        "step3": {
          "title": "刷新您的浏览器",
          "description": "设置Trust Wallet后，点击下面以刷新浏览器并加载扩展程序。"
        }
      }
    },
    "uniswap": {
      "qr_code": {
        "step1": {
          "title": "打开Uniswap应用",
          "description": "将Uniswap钱包添加到您的主屏幕，以便更快地访问您的钱包。"
        },
        "step2": {
          "title": "创建或导入钱包",
          "description": "创建新钱包或导入现有钱包。"
        },
        "step3": {
          "title": "点击QR图标并扫描",
          "description": "在您的主屏幕上点击QR图标，扫描代码并确认提示以进行连接。"
        }
      }
    },
    "zerion": {
      "qr_code": {
        "step1": {
          "title": "打开Zerion应用",
          "description": "我们建议将Zerion放在您的主屏幕上以便更快地访问。"
        },
        "step2": {
          "title": "创建或导入钱包",
          "description": "确保使用安全的方式备份你的钱包。绝对不要与任何人分享你的私人密语。"
        },
        "step3": {
          "title": "点击扫描按钮",
          "description": "你扫描后，会出现一个连接提示让你连接你的钱包。"
        }
      },
      "extension": {
        "step1": {
          "title": "安装 Zerion 扩展",
          "description": "我们建议将 Zerion 固定在你的任务栏以便更快访问你的钱包。"
        },
        "step2": {
          "title": "创建或导入钱包",
          "description": "确保使用安全的方法备份你的钱包。永远不要与任何人分享你的秘密短语。"
        },
        "step3": {
          "title": "刷新您的浏览器",
          "description": "设置您的钱包后，点击下面以刷新浏览器并加载扩展程序。"
        }
      }
    },
    "rainbow": {
      "qr_code": {
        "step1": {
          "title": "打开 Rainbow 应用",
          "description": "我们建议将 Rainbow 放在您的主屏幕上，以便更快地访问您的钱包。"
        },
        "step2": {
          "title": "创建或导入钱包",
          "description": "您可以使用我们的备份功能在您的手机上轻松备份你的钱包。"
        },
        "step3": {
          "title": "点击扫描按钮",
          "description": "扫描后，将出现连接提示，让您连接您的钱包。"
        }
      }
    },
    "enkrypt": {
      "extension": {
        "step1": {
          "description": "我们建议将Enkrypt Wallet固定到任务栏，以便更快地访问您的钱包。",
          "title": "安装Enkrypt Wallet扩展"
        },
        "step2": {
          "description": "请确保使用安全方法备份您的钱包。永远不要与任何人分享您的秘密短语。",
          "title": "创建钱包或导入钱包"
        },
        "step3": {
          "description": "设置钱包后，点击下面刷新浏览器并加载扩展。",
          "title": "刷新您的浏览器"
        }
      }
    },
    "frame": {
      "extension": {
        "step1": {
          "description": "我们建议将Frame固定到任务栏，以便更快地访问您的钱包。",
          "title": "安装Frame及其配套扩展"
        },
        "step2": {
          "description": "务必使用安全的方法备份您的钱包。决不与任何人分享您的秘密短语。",
          "title": "创建或导入钱包"
        },
        "step3": {
          "description": "设置钱包后，点击下方以刷新浏览器并加载扩展。",
          "title": "刷新你的浏览器"
        }
      }
    },
    "one_key": {
      "extension": {
        "step1": {
          "title": "安装OneKey Wallet扩展",
          "description": "我们建议将OneKey Wallet固定到任务栏，以便更快地访问您的钱包。"
        },
        "step2": {
          "title": "创建或导入钱包",
          "description": "确保使用安全的方法备份您的钱包。切勿与任何人分享您的秘密短语。"
        },
        "step3": {
          "title": "刷新您的浏览器",
          "description": "设置您的钱包后，点击下方以刷新浏览器并加载扩展程序。"
        }
      }
    },
    "phantom": {
      "extension": {
        "step1": {
          "title": "安装 Phantom 扩展程序",
          "description": "我们建议将 Phantom 固定到您的任务栏，以便更容易访问您的钱包。"
        },
        "step2": {
          "title": "创建或导入钱包",
          "description": "确保使用安全的方法备份您的钱包。切勿与任何人分享您的秘密恢复短语。"
        },
        "step3": {
          "title": "刷新您的浏览器",
          "description": "设置好您的钱包后，点击下方以刷新浏览器并加载扩展程序。"
        }
      }
    },
    "rabby": {
      "extension": {
        "step1": {
          "title": "安装 Rabby 扩展程序",
          "description": "我们建议将 Rabby 固定在您的任务栏，以便更快地访问您的钱包。"
        },
        "step2": {
          "title": "创建或导入钱包",
          "description": "一定要使用安全的方法备份您的钱包。切勿与任何人分享您的密钥短语。"
        },
        "step3": {
          "title": "刷新您的浏览器",
          "description": "一旦您设置好您的钱包，点击以下以刷新浏览器并加载扩展程序。"
        }
      }
    },
    "safeheron": {
      "extension": {
        "step1": {
          "title": "安装 Core 扩展",
          "description": "我们建议将 Safeheron 固定在您的任务栏，以便更快地访问您的钱包。"
        },
        "step2": {
          "title": "创建或导入钱包",
          "description": "确保使用安全的方法备份您的钱包。切勿与任何人分享您的秘密短语。"
        },
        "step3": {
          "title": "刷新您的浏览器",
          "description": "设置好您的钱包后，点击下方以刷新浏览器并加载扩展程序。"
        }
      }
    },
    "taho": {
      "extension": {
        "step1": {
          "title": "安装Taho扩展程序",
          "description": "我们建议将Taho固定在您的任务栏上，以便更快地访问您的钱包。"
        },
        "step2": {
          "title": "创建或导入钱包",
          "description": "确保使用安全的方法备份您的钱包。切勿与任何人分享您的秘密短语。"
        },
        "step3": {
          "title": "刷新您的浏览器",
          "description": "设置好您的钱包后，点击下方以刷新浏览器并加载扩展程序。"
        }
      }
    },
    "talisman": {
      "extension": {
        "step1": {
          "title": "安装 Talisman 扩展程序",
          "description": "我们建议将 Talisman 固定在任务栏上，以便更快地访问您的钱包。"
        },
        "step2": {
          "title": "创建或导入以太坊钱包",
          "description": "确保使用安全的方法备份您的钱包。永远不要与任何人分享您的恢复短语。"
        },
        "step3": {
          "title": "刷新您的浏览器",
          "description": "设置好您的钱包后，点击下方以刷新浏览器并加载扩展程序。"
        }
      }
    },
    "xdefi": {
      "extension": {
        "step1": {
          "title": "安装 XDEFI 钱包扩展程序",
          "description": "我们建议将XDEFI钱包固定到您的任务栏，以便更快地访问您的钱包。"
        },
        "step2": {
          "title": "创建或导入钱包",
          "description": "确保使用安全的方法备份您的钱包。永远不要与任何人共享您的秘密短语。"
        },
        "step3": {
          "title": "刷新您的浏览器",
          "description": "一旦你设置好你的钱包，点击下面刷新浏览器和加载扩展。"
        }
      }
    },
    "zeal": {
      "extension": {
        "step1": {
          "title": "安装Zeal扩展程序",
          "description": "我们建议将Zeal固定在您的任务栏上，以便更快地访问您的钱包。"
        },
        "step2": {
          "title": "创建或导入钱包",
          "description": "务必使用安全的方法备份您的钱包。决不与任何人分享您的秘密短语。"
        },
        "step3": {
          "title": "刷新您的浏览器",
          "description": "设置钱包后，点击下方刷新浏览器并加载扩展。"
        }
      }
    },
    "safepal": {
      "extension": {
        "step1": {
          "title": "安装SafePal Wallet扩展程序",
          "description": "点击浏览器右上角并固定SafePal Wallet以便于快速访问。"
        },
        "step2": {
          "title": "创建或导入钱包。",
          "description": "创建新钱包或导入现有钱包。"
        },
        "step3": {
          "title": "刷新您的浏览器",
          "description": "一旦设置了SafePal钱包，点击下方刷新浏览器并加载扩展程序。"
        }
      },
      "qr_code": {
        "step1": {
          "title": "打开SafePal钱包应用程序",
          "description": "将SafePal钱包放在主屏幕上以更快地访问您的钱包。"
        },
        "step2": {
          "title": "创建或导入钱包",
          "description": "创建新钱包或导入现有钱包。"
        },
        "step3": {
          "title": "在设置中点击WalletConnect",
          "description": "选择新连接，然后扫描二维码并确认提示以进行连接。"
        }
      }
    },
    "desig": {
      "extension": {
        "step1": {
          "title": "安装 Desig 扩展",
          "description": "我们建议将 Desig 固定到任务栏，以便更轻松地访问您的钱包。"
        },
        "step2": {
          "title": "创建一个钱包",
          "description": "务必使用安全的方法备份您的钱包。决不与任何人分享您的秘密短语。"
        },
        "step3": {
          "title": "刷新您的浏览器",
          "description": "设置钱包后，点击下方刷新浏览器并加载扩展。"
        }
      }
    },
    "subwallet": {
      "extension": {
        "step1": {
          "title": "安装 SubWallet 扩展",
          "description": "我们建议将 SubWallet 固定到任务栏，以便更快地访问您的钱包。"
        },
        "step2": {
          "title": "创建或导入钱包",
          "description": "确保使用安全的方法备份您的钱包。永远不要与任何人分享您的恢复短语。"
        },
        "step3": {
          "title": "刷新您的浏览器",
          "description": "设置钱包后，点击下方刷新浏览器并加载扩展。"
        }
      },
      "qr_code": {
        "step1": {
          "title": "打开 SubWallet 应用",
          "description": "我们建议将 SubWallet 放置在主屏幕上，以便更快地访问。"
        },
        "step2": {
          "title": "创建或导入钱包",
          "description": "务必使用安全的方法备份您的钱包。决不与任何人分享您的秘密短语。"
        },
        "step3": {
          "title": "点击扫描按钮",
          "description": "在您扫描后，将出现连接提示，供您连接您的钱包。"
        }
      }
    },
    "clv": {
      "extension": {
        "step1": {
          "title": "安装 CLV Wallet 扩展",
          "description": "我们建议将 CLV Wallet 固定到任务栏，以便更快地访问您的钱包。"
        },
        "step2": {
          "title": "创建或导入钱包",
          "description": "务必使用安全的方法备份您的钱包。决不与任何人分享您的秘密短语。"
        },
        "step3": {
          "title": "刷新您的浏览器",
          "description": "设置钱包后，点击下方刷新浏览器并加载扩展。"
        }
      },
      "qr_code": {
        "step1": {
          "title": "打开 CLV 钱包应用",
          "description": "我们建议将 CLV 钱包添加到您的主屏幕，以便更快地访问。"
        },
        "step2": {
          "title": "创建或导入钱包",
          "description": "务必使用安全的方法备份您的钱包。决不与任何人分享您的秘密短语。"
        },
        "step3": {
          "title": "点击扫描按钮",
          "description": "在您扫描后，将出现连接提示，供您连接您的钱包。"
        }
      }
    },
    "okto": {
      "qr_code": {
        "step1": {
          "title": "打开 Okto 应用",
          "description": "将 Okto 添加到您的主屏幕以便快速访问"
        },
        "step2": {
          "title": "创建一个 MPC 钱包",
          "description": "创建一个账户并生成一个钱包"
        },
        "step3": {
          "title": "在设置中点击WalletConnect",
          "description": "点击右上角的扫描二维码图标，并确认提示以连接。"
        }
      }
    },
    "ledger": {
      "desktop": {
        "step1": {
          "title": "打开Ledger Live应用",
          "description": "我们建议将Ledger Live放在您的主屏幕上，以便更快地访问。"
        },
        "step2": {
          "title": "设置您的Ledger",
          "description": "设置一个新的Ledger或连接到一个现有的。"
        },
        "step3": {
          "title": "连接",
          "description": "你扫描后，会出现一个连接提示让你连接你的钱包。"
        }
      },
      "qr_code": {
        "step1": {
          "title": "打开Ledger Live应用",
          "description": "我们建议将Ledger Live放在您的主屏幕上，以便更快地访问。"
        },
        "step2": {
          "title": "设置您的Ledger",
          "description": "您可以同步桌面应用程式，或连接您的Ledger。"
        },
        "step3": {
          "title": "扫描代码",
          "description": "点击 WalletConnect 然后切换到扫描器。你扫描后，会出现一个连接提示让你连接你的钱包。"
        }
      }
    }
  }
}
`;const dn=Object.freeze(Object.defineProperty({__proto__:null,default:An},Symbol.toStringTag,{value:"Module"}));var jn="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyOCIgaGVpZ2h0PSIyOCIgZmlsbD0ibm9uZSI+PHJlY3Qgd2lkdGg9IjI2LjYiIGhlaWdodD0iMjYuNiIgeD0iLjciIHk9Ii43IiBmaWxsPSIjMkQzNzRCIiBzdHJva2U9IiM5NkJFREMiIHN0cm9rZS13aWR0aD0iMS40IiByeD0iMTMuMyIvPjxtYXNrIGlkPSJhIiB3aWR0aD0iMjgiIGhlaWdodD0iMjgiIHg9IjAiIHk9IjAiIG1hc2tVbml0cz0idXNlclNwYWNlT25Vc2UiIHN0eWxlPSJtYXNrLXR5cGU6YWxwaGEiPjxyZWN0IHdpZHRoPSIyOCIgaGVpZ2h0PSIyOCIgZmlsbD0iI0M0QzRDNCIgcng9IjE0Ii8+PC9tYXNrPjxnIG1hc2s9InVybCgjYSkiPjxwYXRoIGZpbGw9IiMyOEEwRjAiIGQ9Im0xNC4wODYxIDE4LjYwNDEgNi41MDE0IDEwLjIyMzkgNC4wMDU3LTIuMzIxMy03Ljg2LTEyLjM5NDMtMi42NDcxIDQuNDkxN1ptMTMuMDc0NCAzLjQ2OTItLjAwMy0xLjg1OTktNy4zMDY0LTExLjQwNy0yLjMwODcgMy45MTczIDcuMDkxIDExLjQzMDMgMi4xNzItMS4yNTg2YS45NjI4Ljk2MjggMCAwIDAgLjM1NTUtLjcwMDlsLS4wMDA0LS4xMjEyWiIvPjxyZWN0IHdpZHRoPSIyNS45IiBoZWlnaHQ9IjI1LjkiIHg9IjEuMDUiIHk9IjEuMDUiIGZpbGw9InVybCgjYikiIGZpbGwtb3BhY2l0eT0iLjMiIHN0cm9rZT0iIzk2QkVEQyIgc3Ryb2tlLXdpZHRoPSIyLjEiIHJ4PSIxMi45NSIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Im0uMzYzNCAyOC4yMjA3LTMuMDctMS43Njc0LS4yMzQtLjgzMzNMNy43NDYxIDkuMDE5NGMuNzI5OC0xLjE5MTMgMi4zMTk3LTEuNTc1IDMuNzk1Ny0xLjU1NDFsMS43MzIzLjA0NTdMLjM2MzQgMjguMjIwN1pNMTkuMTY1NSA3LjUxMWwtNC41NjUzLjAxNjZMMi4yNCAyNy45NTMzbDMuNjEwMyAyLjA3ODguOTgxOC0xLjY2NTJMMTkuMTY1NSA3LjUxMVoiLz48L2c+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJiIiB4MT0iMCIgeDI9IjE0IiB5MT0iMCIgeTI9IjI4IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agc3RvcC1jb2xvcj0iI2ZmZiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI2ZmZiIgc3RvcC1vcGFjaXR5PSIwIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PC9zdmc+Cg==";const Nn=Object.freeze(Object.defineProperty({__proto__:null,default:jn},Symbol.toStringTag,{value:"Module"}));var In="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyOCIgaGVpZ2h0PSIyOCIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTIzIDVINXYxOGgxOFY1WiIvPjxwYXRoIGZpbGw9IiNFODQxNDIiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTE0IDI4Yy03LjUxMy4wMDgtMTQtNi40ODctMTQtMTRDMCA2LjE5NiA2LjA0My0uMDA4IDE0IDBjNy45NS4wMDggMTQgNi4xOTYgMTQgMTQgMCA3LjUwNS02LjQ5NSAxMy45OTItMTQgMTRabS0zLjk3MS03LjQzNkg3LjMxNWMtLjU3IDAtLjg1MSAwLTEuMDIzLS4xMWEuNjkuNjkgMCAwIDEtLjMxMy0uNTRjLS4wMS0uMjAyLjEzLS40NS40MTItLjk0NGw2LjctMTEuODA5Yy4yODUtLjUwMS40My0uNzUyLjYxMi0uODQ1LjE5NS0uMS40MjktLjEuNjI1IDAgLjE4Mi4wOTMuMzI2LjM0NC42MTEuODQ1bDEuMzc3IDIuNDA0LjAwNy4wMTNjLjMwOC41MzguNDY0LjgxLjUzMyAxLjA5N2EyLjA0IDIuMDQgMCAwIDEgMCAuOTU0Yy0uMDcuMjg5LS4yMjQuNTY0LS41MzYgMS4xMWwtMy41MiA2LjIyLS4wMDkuMDE3Yy0uMzEuNTQyLS40NjcuODE3LS42ODQgMS4wMjRhMi4wNDggMi4wNDggMCAwIDEtLjgzNS40ODVjLS4yODUuMDc5LS42MDQuMDc5LTEuMjQzLjA3OVptNi44NTIgMGgzLjg4OGMuNTc0IDAgLjg2MiAwIDEuMDM0LS4xMTNhLjY4Ny42ODcgMCAwIDAgLjMxMy0uNTQzYy4wMS0uMTk2LS4xMjgtLjQzNC0uMzk4LS45YTguMTk4IDguMTk4IDAgMCAxLS4wMjgtLjA0OGwtMS45NDgtMy4zMzItLjAyMi0uMDM3Yy0uMjc0LS40NjMtLjQxMi0uNjk3LS41OS0uNzg3YS42ODQuNjg0IDAgMCAwLS42MjEgMGMtLjE3OS4wOTMtLjMyMy4zMzctLjYwOC44MjhsLTEuOTQgMy4zMzEtLjAwNy4wMTJjLS4yODQuNDktLjQyNi43MzUtLjQxNi45MzYuMDE0LjIyLjEyNy40MjMuMzEzLjU0My4xNjguMTEuNDU2LjExIDEuMDMuMTFaIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiLz48L3N2Zz4K";const Ln=Object.freeze(Object.defineProperty({__proto__:null,default:In},Symbol.toStringTag,{value:"Module"}));var pn="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyOCIgaGVpZ2h0PSIyOCI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBmaWxsPSIjMDA1MkZGIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik0xNCAyOGExNCAxNCAwIDEgMCAwLTI4IDE0IDE0IDAgMCAwIDAgMjhaIi8+PHBhdGggZmlsbD0iI0ZGRiIgZD0iTTEzLjk2NyAyMy44NmM1LjQ0NSAwIDkuODYtNC40MTUgOS44Ni05Ljg2IDAtNS40NDUtNC40MTUtOS44Ni05Ljg2LTkuODYtNS4xNjYgMC05LjQwMyAzLjk3NC05LjgyNSA5LjAzaDE0LjYzdjEuNjQySDQuMTQyYy40MTMgNS4wNjUgNC42NTQgOS4wNDcgOS44MjYgOS4wNDdaIi8+PC9nPjwvc3ZnPg==";const Fn=Object.freeze(Object.defineProperty({__proto__:null,default:pn},Symbol.toStringTag,{value:"Module"}));var gn="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyOCIgaGVpZ2h0PSIyOCIgZmlsbD0ibm9uZSI+PGcgY2xpcC1wYXRoPSJ1cmwoI2EpIj48cGF0aCBmaWxsPSIjRjBCOTBCIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xNCAwYzcuNzMzIDAgMTQgNi4yNjcgMTQgMTRzLTYuMjY3IDE0LTE0IDE0UzAgMjEuNzMzIDAgMTQgNi4yNjcgMCAxNCAwWiIgY2xpcC1ydWxlPSJldmVub2RkIi8+PHBhdGggZmlsbD0iI2ZmZiIgZD0ibTcuNjk0IDE0IC4wMSAzLjcwMiAzLjE0NiAxLjg1djIuMTY4bC00Ljk4Ni0yLjkyNHYtNS44NzhMNy42OTQgMTRabTAtMy43MDJ2Mi4xNTdsLTEuODMyLTEuMDgzVjkuMjE0bDEuODMyLTEuMDgzIDEuODQxIDEuMDgzLTEuODQgMS4wODRabTQuNDctMS4wODQgMS44MzItMS4wODMgMS44NCAxLjA4My0xLjg0IDEuMDg0LTEuODMyLTEuMDg0WiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik05LjAxOCAxNi45MzV2LTIuMTY4bDEuODMyIDEuMDg0djIuMTU3bC0xLjgzMi0xLjA3M1ptMy4xNDYgMy4zOTQgMS44MzIgMS4wODQgMS44NC0xLjA4NHYyLjE1N2wtMS44NCAxLjA4NC0xLjgzMi0xLjA4NFYyMC4zM1ptNi4zLTExLjExNSAxLjgzMi0xLjA4MyAxLjg0IDEuMDgzdjIuMTU4bC0xLjg0IDEuMDgzdi0yLjE1N2wtMS44MzItMS4wODRabTEuODMyIDguNDg4LjAxLTMuNzAyIDEuODMxLTEuMDg0djUuODc5bC00Ljk4NiAyLjkyNHYtMi4xNjdsMy4xNDUtMS44NVoiLz48cGF0aCBmaWxsPSIjZmZmIiBkPSJtMTguOTgyIDE2LjkzNS0xLjgzMiAxLjA3M3YtMi4xNTdsMS44MzItMS4wODR2Mi4xNjhaIi8+PHBhdGggZmlsbD0iI2ZmZiIgZD0ibTE4Ljk4MiAxMS4wNjUuMDEgMi4xNjgtMy4xNTUgMS44NXYzLjcxMmwtMS44MzEgMS4wNzMtMS44MzItMS4wNzN2LTMuNzExbC0zLjE1NS0xLjg1MXYtMi4xNjhsMS44NC0xLjA4MyAzLjEzNSAxLjg2IDMuMTU1LTEuODYgMS44NCAxLjA4M2gtLjAwN1ptLTkuOTY0LTMuNyA0Ljk3Ny0yLjkzNSA0Ljk4NyAyLjkzNS0xLjgzMiAxLjA4My0zLjE1NC0xLjg2LTMuMTQ2IDEuODYtMS44MzItMS4wODNaIi8+PC9nPjxkZWZzPjxjbGlwUGF0aCBpZD0iYSI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTAgMGgyOHYyOEgweiIvPjwvY2xpcFBhdGg+PC9kZWZzPjwvc3ZnPg==";const Bn=Object.freeze(Object.defineProperty({__proto__:null,default:gn},Symbol.toStringTag,{value:"Module"}));var xn="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjgiIGhlaWdodD0iMjgiPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iQSIgeDE9Ii0xOC4yNzUlIiB4Mj0iODQuOTU5JSIgeTE9IjguMjE5JSIgeTI9IjcxLjM5MyUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiMwMDJkNzQiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMwMDEyNDYiLz48L2xpbmVhckdyYWRpZW50PjxjaXJjbGUgaWQ9IkIiIGN4PSIxNCIgY3k9IjE0IiByPSIxNCIvPjwvZGVmcz48ZyBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxtYXNrIGlkPSJDIiBmaWxsPSIjZmZmIj48dXNlIHhsaW5rOmhyZWY9IiNCIi8+PC9tYXNrPjxnIGZpbGwtcnVsZT0ibm9uemVybyI+PHBhdGggZmlsbD0idXJsKCNBKSIgZD0iTS0xLjMyNi0xLjMyNmgzMC42NTF2MzAuNjUxSC0xLjMyNnoiIG1hc2s9InVybCgjQykiLz48ZyBmaWxsPSIjZmZmIj48cGF0aCBkPSJNMTQuMTg3IDZMNyAxMC4xNzV2OC4zNWw3LjE4NyA0LjE3NSA3LjE3NS00LjE3NXYtOC4zNUwxNC4xODcgNnptNS4wNDYgMTEuMjg2bC01LjA1OCAyLjkzNi01LjA0Ni0yLjkzNnYtNS44NzFsNS4wNTgtMi45MzYgNS4wNDYgMi45MzZ2NS44NzF6Ii8+PHBhdGggZD0iTTE0LjE4NyAyMi43bDcuMTc1LTQuMTc1di04LjM1TDE0LjE4NyA2djIuNDc5bDUuMDQ2IDIuOTM2djUuODgzbC01LjA1OCAyLjkzNlYyMi43aC4wMTJ6Ii8+PHBhdGggZD0iTTE0LjE3NSA2TDcgMTAuMTc1djguMzVsNy4xNzUgNC4xNzV2LTIuNDc5bC01LjA0Ni0yLjkzNnYtNS44ODNsNS4wNDYtMi45MjRWNnptMy4zNiAxMC4yOTlsLTMuMzQ4IDEuOTQ5LTMuMzYtMS45NDl2LTMuODk4bDMuMzYtMS45NDkgMy4zNDggMS45NDktMS4zOTkuODE4LTEuOTYxLTEuMTQzLTEuOTQ5IDEuMTQzdjIuMjc0bDEuOTYxIDEuMTQzIDEuOTYxLTEuMTQzIDEuMzg3LjgwNnoiLz48L2c+PC9nPjwvZz48L3N2Zz4=";const zn=Object.freeze(Object.defineProperty({__proto__:null,default:xn},Symbol.toStringTag,{value:"Module"}));var yn="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyOCIgaGVpZ2h0PSIyOCIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iIzI1MjkyRSIgZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMTQgMjhhMTQgMTQgMCAxIDAgMC0yOCAxNCAxNCAwIDAgMCAwIDI4WiIgY2xpcC1ydWxlPSJldmVub2RkIi8+PHBhdGggZmlsbD0idXJsKCNhKSIgZmlsbC1vcGFjaXR5PSIuMyIgZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMTQgMjhhMTQgMTQgMCAxIDAgMC0yOCAxNCAxNCAwIDAgMCAwIDI4WiIgY2xpcC1ydWxlPSJldmVub2RkIi8+PHBhdGggZmlsbD0idXJsKCNiKSIgZD0iTTguMTkgMTQuNzcgMTQgMTguMjFsNS44LTMuNDQtNS44IDguMTktNS44MS04LjE5WiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Im0xNCAxNi45My01LjgxLTMuNDRMMTQgNC4zNGw1LjgxIDkuMTVMMTQgMTYuOTNaIi8+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJhIiB4MT0iMCIgeDI9IjE0IiB5MT0iMCIgeTI9IjI4IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agc3RvcC1jb2xvcj0iI2ZmZiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI2ZmZiIgc3RvcC1vcGFjaXR5PSIwIi8+PC9saW5lYXJHcmFkaWVudD48bGluZWFyR3JhZGllbnQgaWQ9ImIiIHgxPSIxNCIgeDI9IjE0IiB5MT0iMTQuNzciIHkyPSIyMi45NiIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiNmZmYiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNmZmYiIHN0b3Atb3BhY2l0eT0iLjkiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48L3N2Zz4K";const mn=Object.freeze(Object.defineProperty({__proto__:null,default:yn},Symbol.toStringTag,{value:"Module"}));var Tn="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyOCIgaGVpZ2h0PSIyOCIgZmlsbD0ibm9uZSI+PHJlY3Qgd2lkdGg9IjI4IiBoZWlnaHQ9IjI4IiBmaWxsPSJ1cmwoI2EpIiByeD0iMTQiLz48ZyBjbGlwLXBhdGg9InVybCgjYikiPjxwYXRoIGZpbGw9IiNGRkYxMDAiIGQ9Ik0yMi40NTggMTguNDA5di0uODc1YzAtLjE2Mi0uMjU4LS4zMTctLjcyLS40NTdsLjAxMS0xLjA4OGMwLTEuNjc2LS40OS0zLjMxMi0xLjQwMi00LjY4NWE3LjgzMyA3LjgzMyAwIDAgMC0zLjcwMi0yLjk5NGwtLjAzMy0uMjE4YS42MzkuNjM5IDAgMCAwLS4xMzgtLjMxNS41OTIuNTkyIDAgMCAwLS4yNzctLjE4OCA3LjQyOSA3LjQyOSAwIDAgMC00LjM5NSAwIC41OTIuNTkyIDAgMCAwLS4yNzguMTg4LjY0LjY0IDAgMCAwLS4xNC4zMTVsLS4wMzEuMjAzYTcuODMgNy44MyAwIDAgMC0zLjcyNyAyLjk5MSA4LjQ3NCA4LjQ3NCAwIDAgMC0xLjQxNCA0LjcwM3YxLjA5M2MtLjQ1Ni4xMzktLjcxLjI5Mi0uNzEuNDU0di44NzRhLjIyNC4yMjQgMCAwIDAgLjAzLjE0N2MuMjI3LS4xNzguNDg3LS4zMDMuNzY0LS4zNjYuNzA0LS4xODEgMS40Mi0uMzA3IDIuMTQzLS4zNzguMjAyLS4wMjQuNDA3LS4wMDMuNjAxLjA2M3MuMzcyLjE3NC41MjMuMzE4YTIuOTQ1IDIuOTQ1IDAgMCAwIDIuMDQzLjgzNmg0Ljc0OGMuNzU2IDAgMS40ODUtLjI5OSAyLjA0My0uODM2YTEuNDIgMS40MiAwIDAgMSAuNTIyLS4zMmMuMTk0LS4wNjcuNC0uMDkuNjAyLS4wNjZhMTQuMiAxNC4yIDAgMCAxIDIuMTQzLjM3NmMuMjYyLjA1My41MS4xNjcuNzI0LjMzNC4wMTIuMDEzLjAyNy4wMjQuMDM3LjAzNmEuMjI3LjIyNyAwIDAgMCAuMDMzLS4xNDVaIi8+PHBhdGggZmlsbD0idXJsKCNjKSIgZD0iTTkuNTc0IDE2LjU2OWMtLjAwNi0uMi0uMDEtLjQwMi0uMDEtLjYwNC4wMDMtMy4wNC42NzctNS43NjUgMS43OS03LjY2OGE3LjgzIDcuODMgMCAwIDAtMy43MjggMi45OSA4LjQ3NCA4LjQ3NCAwIDAgMC0xLjQxNCA0LjcwMnYxLjA5M2ExNy45OCAxNy45OCAwIDAgMSAzLjM2Mi0uNTEzWiIvPjxwYXRoIGZpbGw9InVybCgjZCkiIGQ9Ik0yMS43NDkgMTUuOTg5YTguNDA5IDguNDA5IDAgMCAwLTEuNzczLTUuMTk5Yy40OTggMS42NzQuNzQ2IDMuNDIuNzM1IDUuMTczIDAgLjI5Ni0uMDA4LjU5LS4wMi44OGE5LjIgOS4yIDAgMCAxIDEuMDQ1LjIzNGwuMDEzLTEuMDg4WiIvPjxwYXRoIGZpbGw9InVybCgjZSkiIGQ9Ik0yMS42NjQgMTguMTg3Yy0uNzA1LS4xOC0xLjQyLS4zMDYtMi4xNDMtLjM3N2ExLjM2NSAxLjM2NSAwIDAgMC0uNjAyLjA2NCAxLjQxNiAxLjQxNiAwIDAgMC0uNTIzLjMyIDIuOTQzIDIuOTQzIDAgMCAxLTIuMDQzLjgzNWgtNC43NDVhMi45NDUgMi45NDUgMCAwIDEtMi4wNDMtLjgzNSAxLjQxNyAxLjQxNyAwIDAgMC0uNTIyLS4zMjIgMS4zNjYgMS4zNjYgMCAwIDAtLjYwMi0uMDY1IDE0LjE4IDE0LjE4IDAgMCAwLTIuMTQzLjM3NyAxLjk2MiAxLjk2MiAwIDAgMC0uNzY0LjM2N2MuMzYuNTggNC4wMDYgMS4xOSA4LjQ0OCAxLjE5czguMDg2LS42MTIgOC40NDctMS4xOWMtLjAxMy0uMDEyLS4wMjctLjAyMy0uMDM3LS4wMzVhMS44IDEuOCAwIDAgMC0uNzI4LS4zMjlaIi8+PHBhdGggZmlsbD0iIzBBMEEwQSIgZD0ibTEzLjk4IDkuODIzLTEuODE4IDMuMjU4IDEuODE3IDEuMTg4VjkuODI0WiIvPjxwYXRoIGZpbGw9IiM0QjRENEQiIGQ9Ik0xMy45OCA5LjgyNHY0LjQ0NGwxLjgxNy0xLjE4Ni0xLjgxNy0zLjI1OFptMCA1LjA5djEuNTVjLjAzNC0uMDUyIDEuODE3LTIuNzM4IDEuODE3LTIuNzRsLTEuODE3IDEuMTlaIi8+PHBhdGggZmlsbD0iIzBBMEEwQSIgZD0ibTEzLjk4IDE0LjkxNC0xLjgxOC0xLjE4NyAxLjgxOCAyLjczN3YtMS41NVoiLz48L2c+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJhIiB4MT0iMTQiIHgyPSIxNCIgeTE9IjAiIHkyPSIyOCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiNGN0YxRkQiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNGQkZDREMiLz48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCBpZD0iYyIgeDE9IjguNzgzIiB4Mj0iOC43ODMiIHkxPSIxNy4wODIiIHkyPSI4LjI5NyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiNFRENGMDAiLz48c3RvcCBvZmZzZXQ9Ii4zMyIgc3RvcC1jb2xvcj0iI0YwRDUwMCIvPjxzdG9wIG9mZnNldD0iLjc3IiBzdG9wLWNvbG9yPSIjRjlFNTAwIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjRkZGMTAwIi8+PC9saW5lYXJHcmFkaWVudD48bGluZWFyR3JhZGllbnQgaWQ9ImQiIHgxPSIyMC44NjIiIHgyPSIyMC44NjIiIHkxPSIxNy4xNDYiIHkyPSIxMC43OSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiNFRENGMDAiLz48c3RvcCBvZmZzZXQ9Ii41OSIgc3RvcC1jb2xvcj0iI0Y3RTEwMCIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0ZGRjEwMCIvPjwvbGluZWFyR3JhZGllbnQ+PHJhZGlhbEdyYWRpZW50IGlkPSJlIiBjeD0iMCIgY3k9IjAiIHI9IjEiIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoNi4zMDM1MyAwIDAgNi42NDkzNSA2LjQ1IDIzLjA4NCkiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBzdG9wLWNvbG9yPSIjRkZGMTAwIi8+PHN0b3Agb2Zmc2V0PSIuMjMiIHN0b3AtY29sb3I9IiNGOUU1MDAiLz48c3RvcCBvZmZzZXQ9Ii42NyIgc3RvcC1jb2xvcj0iI0YwRDUwMCIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0VEQ0YwMCIvPjwvcmFkaWFsR3JhZGllbnQ+PGNsaXBQYXRoIGlkPSJiIj48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMCAwaDE3djEzSDB6IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg1LjUgNykiLz48L2NsaXBQYXRoPjwvZGVmcz48L3N2Zz4K";const Sn=Object.freeze(Object.defineProperty({__proto__:null,default:Tn},Symbol.toStringTag,{value:"Module"}));var kn="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyOCIgaGVpZ2h0PSIyOCIgZmlsbD0ibm9uZSI+PHJlY3Qgd2lkdGg9IjI4IiBoZWlnaHQ9IjI4IiBmaWxsPSIjRkYzMTMxIiByeD0iMTQiLz48cmVjdCB3aWR0aD0iMjgiIGhlaWdodD0iMjgiIGZpbGw9InVybCgjYSkiIGZpbGwtb3BhY2l0eT0iLjMiIHJ4PSIxNCIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik05LjIyIDE4LjM1YzIuNyAwIDQuODYtMi4yIDQuODYtNS4zOCAwLTIuMTktMS40Ny0zLjgtMy45OC0zLjgtMi43MiAwLTQuODUgMi4yLTQuODUgNS4zOCAwIDIuMiAxLjUgMy44IDMuOTcgMy44Wm0uODMtNy4zNWMxLjA2IDAgMS43NC44MSAxLjc0IDIuMSAwIDEuOS0xLjExIDMuNDItMi41MSAzLjQyLTEuMDYgMC0xLjc0LS44Mi0xLjc0LTIuMSAwLTEuODkgMS4xMS0zLjQyIDIuNS0zLjQyWm02LjM4LTEuNjgtMS44OCA4Ljg4aDIuMjZsLjU1LTIuNmgxLjQ3YzIuNDMgMCA0LjAxLTEuMzggNC4wMS0zLjYgMC0xLjYxLTEuMTctMi42OC0zLjEtMi42OGgtMy4zWm0xLjkgMS43NGguOTRjLjgzIDAgMS4zLjM4IDEuMyAxLjE0IDAgMS0uNjggMS43LTEuNzQgMS43aC0xLjExbC42LTIuODRaIi8+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJhIiB4MT0iMCIgeDI9IjE0IiB5MT0iMCIgeTI9IjI4IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agc3RvcC1jb2xvcj0iI2ZmZiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI2ZmZiIgc3RvcC1vcGFjaXR5PSIwIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PC9zdmc+Cg==";const wn=Object.freeze(Object.defineProperty({__proto__:null,default:kn},Symbol.toStringTag,{value:"Module"}));var bn="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjgiIGhlaWdodD0iMjgiPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iQSIgeDE9Ii0xOC4yNzUlIiB4Mj0iODQuOTU5JSIgeTE9IjguMjE5JSIgeTI9IjcxLjM5MyUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNhMjI5YzUiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiM3YjNmZTQiLz48L2xpbmVhckdyYWRpZW50PjxjaXJjbGUgaWQ9IkIiIGN4PSIxNCIgY3k9IjE0IiByPSIxNCIvPjwvZGVmcz48ZyBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxtYXNrIGlkPSJDIiBmaWxsPSIjZmZmIj48dXNlIHhsaW5rOmhyZWY9IiNCIi8+PC9tYXNrPjxnIGZpbGwtcnVsZT0ibm9uemVybyI+PHBhdGggZmlsbD0idXJsKCNBKSIgZD0iTS0xLjMyNi0xLjMyNmgzMC42NTF2MzAuNjUxSC0xLjMyNnoiIG1hc2s9InVybCgjQykiLz48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMTguMDQ5IDE3LjAyMWwzLjk2LTIuMjg3YS42ODEuNjgxIDAgMCAwIC4zNC0uNTg5VjkuNTcyYS42ODMuNjgzIDAgMCAwLS4zNC0uNTlsLTMuOTYtMi4yODZhLjY4Mi42ODIgMCAwIDAtLjY4IDBsLTMuOTYgMi4yODdhLjY4Mi42ODIgMCAwIDAtLjM0LjU4OXY4LjE3M0wxMC4yOSAxOS4zNWwtMi43NzctMS42MDR2LTMuMjA3bDIuNzc3LTEuNjA0IDEuODMyIDEuMDU4VjExLjg0bC0xLjQ5Mi0uODYxYS42ODEuNjgxIDAgMCAwLS42OCAwbC0zLjk2IDIuMjg3YS42ODEuNjgxIDAgMCAwLS4zNC41ODl2NC41NzNjMCAuMjQyLjEzLjQ2OC4zNC41OWwzLjk2IDIuMjg2YS42OC42OCAwIDAgMCAuNjggMGwzLjk2LTIuMjg2YS42ODIuNjgyIDAgMCAwIC4zNC0uNTg5di04LjE3NGwuMDUtLjAyOCAyLjcyOC0xLjU3NSAyLjc3NyAxLjYwM3YzLjIwOGwtMi43NzcgMS42MDMtMS44My0xLjA1NnYyLjE1MWwxLjQ5Ljg2YS42OC42OCAwIDAgMCAuNjggMHoiLz48L2c+PC9nPjwvc3ZnPg==";const Un=Object.freeze(Object.defineProperty({__proto__:null,default:bn},Symbol.toStringTag,{value:"Module"}));var Zn="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyOCAyOCI+PGcgY2xpcC1wYXRoPSJ1cmwoI2EpIj48cGF0aCBmaWxsPSIjQjdCNUIxIiBkPSJNOCA4aDEydjEySDh6Ii8+PHBhdGggZmlsbD0iI0I3QjVCMSIgZD0iTTI4IDEyLjY2N0MyNC43ODYtNS45Ny40NDgtMi4zNjMuMDExIDEyLjY2N2MxLjQuNzI4IDIuMjg1IDEuMTc2IDIuMjg1IDEuMTc2cy0uNzQuNDQ4LTIuMjk2IDEuNDM0YzIuOCAxOC4yNzggMjYuNzIzIDE1LjYyNCAyOC0uMDIzLTEuNTIzLS45My0yLjM1Mi0xLjQyMi0yLjM1Mi0xLjQyMnMuNzE3LS4zMzYgMi4zNTItMS4xNjVabS0xMS45NzMgNi41MDctMi4yODUtMy45Mi0yLjMxOCAzLjkyLTEuNzU4LS4xMjMgMy4zMDQtNS41NjZMOS45OSA4LjY4bDEuNzkyLS4xNTcgMi4xMTcgMy41NjIgMi4xMTctMy40MDUgMS42NjkuMDQ1LTIuNzc4IDQuNzI2IDMuMDU4IDUuNjktMS45Ni4wNDUuMDIyLS4wMTJaIi8+PHBhdGggZmlsbD0iIzI0NEI4MSIgZD0iTTI2Ljg2OSAxMS45NEMyMi41MTItNC42MjcgMi41Mi0uMTQ3IDEuMTU0IDExLjk0YTI0OS41MTQgMjQ5LjUxNCAwIDAgMSAzLjQwNCAxLjkyNmwtMy40MTYgMi4xNzJjMi45OCAxNS45MjcgMjQuNTQgMTIuODU4IDI1LjcyNy0uMDIyLTIuMTczLTEuMzY2LTMuNDYxLTIuMTYyLTMuNDYxLTIuMTYyczIuOTM0LTEuNjM1IDMuNDYtMS45MTVabS0xMC44NDIgNy4yNDYtMi4yODUtMy45Mi0yLjMxOCAzLjkyLTEuNzQ3LS4xMjQgMy4zMDQtNS41NjZMMTAgOC42OTFsMS43OTMtLjE1NyAyLjExNiAzLjU2MiAyLjExNy0zLjQwNSAxLjY2OS4wNDUtMi43NjYgNC43MjYgMy4wNTcgNS42OS0xLjk2LjA0NXYtLjAxMVoiLz48L2c+PGRlZnM+PGNsaXBQYXRoIGlkPSJhIj48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMCAwaDI4djI4SDB6Ii8+PC9jbGlwUGF0aD48L2RlZnM+PC9zdmc+";const On=Object.freeze(Object.defineProperty({__proto__:null,default:Zn},Symbol.toStringTag,{value:"Module"}));var Yn="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyOCAyOCI+PGcgY2xpcC1wYXRoPSJ1cmwoI2EpIj48cGF0aCBmaWxsPSIjRjlGN0VDIiBkPSJNMTQgMjhjNy43MzIgMCAxNC02LjI2OCAxNC0xNFMyMS43MzIgMCAxNCAwIDAgNi4yNjggMCAxNHM2LjI2OCAxNCAxNCAxNFoiLz48cGF0aCBmaWxsPSIjMDAwIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Im0yMi4xMiAxMy45My00LjY2OS00LjY0OHYzLjQwMmwtNC42MzQgMy40MDloNC42MzR2Mi40ODVsNC42NjktNC42NDhaTTUuNjcgMTMuOTNsNC42NjkgNC42NDh2LTMuMzgxbDQuNjM0LTMuNDM3aC00LjYzNFY5LjI3NUw1LjY3IDEzLjkzWiIgY2xpcC1ydWxlPSJldmVub2RkIi8+PC9nPjxkZWZzPjxjbGlwUGF0aCBpZD0iYSI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTAgMGgyOHYyOEgweiIvPjwvY2xpcFBhdGg+PC9kZWZzPjwvc3ZnPg==";const vn=Object.freeze(Object.defineProperty({__proto__:null,default:Yn},Symbol.toStringTag,{value:"Module"}));var hn="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyOCIgaGVpZ2h0PSIyOCIgZmlsbD0ibm9uZSI+PGcgY2xpcC1wYXRoPSJ1cmwoI2EpIj48cGF0aCBmaWxsPSJ1cmwoI2IpIiBkPSJNLjk0MyAxMy43NTRjMCA3LjU4NiA1Ljk0NCAxMy43NTUgMTMuMjUyIDEzLjc1NSA3LjMwOCAwIDEzLjI1Mi02LjE3IDEzLjI1Mi0xMy43NTVDMjcuNDQgNi4xNyAyMS40OTcgMCAxNC4xOTUgMCA2Ljg4NyAwIC45NDMgNi4xNy45NDMgMTMuNzU0WiIvPjxwYXRoIGZpbGw9InVybCgjYykiIGQ9Ik0uOTQzIDEzLjc1NGMwIDcuNTg2IDUuOTQ0IDEzLjc1NSAxMy4yNTIgMTMuNzU1IDcuMzA4IDAgMTMuMjUyLTYuMTcgMTMuMjUyLTEzLjc1NUMyNy40NCA2LjE3IDIxLjQ5NyAwIDE0LjE5NSAwIDYuODg3IDAgLjk0MyA2LjE3Ljk0MyAxMy43NTRaIi8+PHBhdGggZmlsbD0idXJsKCNkKSIgZD0iTS45NDMgMTMuNzU0YzAgNy41ODYgNS45NDQgMTMuNzU1IDEzLjI1MiAxMy43NTUgNy4zMDggMCAxMy4yNTItNi4xNyAxMy4yNTItMTMuNzU1QzI3LjQ0IDYuMTcgMjEuNDk3IDAgMTQuMTk1IDAgNi44ODcgMCAuOTQzIDYuMTcuOTQzIDEzLjc1NFoiLz48L2c+PGRlZnM+PHJhZGlhbEdyYWRpZW50IGlkPSJiIiBjeD0iMCIgY3k9IjAiIHI9IjEiIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMTkuOTU0NyAwIDAgMjAuNzExMyAxOC4xNiA2LjcpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agb2Zmc2V0PSIuMDA1IiBzdG9wLWNvbG9yPSIjZmZmIi8+PHN0b3Agb2Zmc2V0PSIuNDU4IiBzdG9wLWNvbG9yPSIjQjdEOEM4Ii8+PHN0b3Agb2Zmc2V0PSIuNjU2IiBzdG9wLWNvbG9yPSIjNkQ5NDg3Ii8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjNEI0QzNDIi8+PC9yYWRpYWxHcmFkaWVudD48cmFkaWFsR3JhZGllbnQgaWQ9ImMiIGN4PSIwIiBjeT0iMCIgcj0iMSIgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgxOS45NTQ3IDAgMCAyMC43MTEzIDE4LjE2IDYuNykiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBvZmZzZXQ9Ii4wMDUiIHN0b3AtY29sb3I9IiNmZmYiLz48c3RvcCBvZmZzZXQ9Ii40NTgiIHN0b3AtY29sb3I9IiNCNUI0QzYiLz48c3RvcCBvZmZzZXQ9Ii42NTYiIHN0b3AtY29sb3I9IiM5QjhGOEYiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM0QjRDM0MiLz48L3JhZGlhbEdyYWRpZW50PjxyYWRpYWxHcmFkaWVudCBpZD0iZCIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDE5Ljk1NDcgMCAwIDIwLjcxMTMgMTguMTYgNi43KSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIG9mZnNldD0iLjE1NiIgc3RvcC1jb2xvcj0iI0RDQzhEMCIvPjxzdG9wIG9mZnNldD0iLjMwMiIgc3RvcC1jb2xvcj0iIzc4QzhDRiIvPjxzdG9wIG9mZnNldD0iLjQyNyIgc3RvcC1jb2xvcj0iIzREOTU5RSIvPjxzdG9wIG9mZnNldD0iLjU1NyIgc3RvcC1jb2xvcj0iIzMwNUVCOSIvPjxzdG9wIG9mZnNldD0iLjc5NyIgc3RvcC1jb2xvcj0iIzMxMUYxMiIvPjxzdG9wIG9mZnNldD0iLjkwNiIgc3RvcC1jb2xvcj0iIzY4NDIzMiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzJEMUMxMyIvPjwvcmFkaWFsR3JhZGllbnQ+PGNsaXBQYXRoIGlkPSJhIj48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMCAwaDI4djI4SDB6Ii8+PC9jbGlwUGF0aD48L2RlZnM+PC9zdmc+";const Wn=Object.freeze(Object.defineProperty({__proto__:null,default:hn},Symbol.toStringTag,{value:"Module"}));var Qn="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCA0OCA0OCI+PHBhdGggZmlsbD0idXJsKCNhKSIgZD0iTTEuMDkgNS40NkMwIDcuNiAwIDEwLjQgMCAxNnYxNmMwIDUuNiAwIDguNCAxLjA5IDEwLjU0YTEwIDEwIDAgMCAwIDQuMzcgNC4zN0M3LjYgNDggMTAuNCA0OCAxNiA0OGgxNmMxLjc1MiAwIDMuMjMgMCA0LjUtLjAzMyAwLTEuMzYyIDAtMi4wNDQuMDY2LTIuNjE2YTEwIDEwIDAgMCAxIDguNzg1LTguNzg1Yy41NzItLjA2NiAxLjI1NC0uMDY2IDIuNjE2LS4wNjZDNDggMzUuMjMgNDggMzMuNzUyIDQ4IDMyVjE2YzAtNS42IDAtOC40LTEuMDktMTAuNTRhMTAgMTAgMCAwIDAtNC4zNy00LjM3QzQwLjQgMCAzNy42IDAgMzIgMEgxNkMxMC40IDAgNy42IDAgNS40NiAxLjA5YTEwIDEwIDAgMCAwLTQuMzcgNC4zN1oiLz48cGF0aCBmaWxsPSJ1cmwoI2IpIiBkPSJNMS4wOSA1LjQ2QzAgNy42IDAgMTAuNCAwIDE2djE2YzAgNS42IDAgOC40IDEuMDkgMTAuNTRhMTAgMTAgMCAwIDAgNC4zNyA0LjM3QzcuNiA0OCAxMC40IDQ4IDE2IDQ4aDE2YzEuNzUyIDAgMy4yMyAwIDQuNS0uMDMzIDAtMS4zNjIgMC0yLjA0NC4wNjYtMi42MTZhMTAgMTAgMCAwIDEgOC43ODUtOC43ODVjLjU3Mi0uMDY2IDEuMjU0LS4wNjYgMi42MTYtLjA2NkM0OCAzNS4yMyA0OCAzMy43NTIgNDggMzJWMTZjMC01LjYgMC04LjQtMS4wOS0xMC41NGExMCAxMCAwIDAgMC00LjM3LTQuMzdDNDAuNCAwIDM3LjYgMCAzMiAwSDE2QzEwLjQgMCA3LjYgMCA1LjQ2IDEuMDlhMTAgMTAgMCAwIDAtNC4zNyA0LjM3WiIvPjxwYXRoIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iLjA0IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0zNS41IDM1LjVoMTEuNDg2QzQ3IDM0LjQ3NSA0NyAzMy4zMiA0NyAzMlYxNmMwLTIuODE3IDAtNC44Ny0uMTMzLTYuNDg3LS4xMzEtMS42MDUtLjM4Ny0yLjY5NC0uODQ4LTMuNTk5YTkgOSAwIDAgMC0zLjkzMy0zLjkzM2MtLjkwNS0uNDYxLTEuOTk0LS43MTctMy42LS44NDhDMzYuODcgMSAzNC44MTYgMSAzMiAxSDE2Yy0yLjgxNyAwLTQuODcgMC02LjQ4Ny4xMzMtMS42MDUuMTMxLTIuNjk0LjM4Ny0zLjU5OS44NDhhOSA5IDAgMCAwLTMuOTMzIDMuOTMzYy0uNDYxLjkwNS0uNzE3IDEuOTk0LS44NDggMy42QzEgMTEuMTMgMSAxMy4xODMgMSAxNnYxNmMwIDIuODE3IDAgNC44Ny4xMzMgNi40ODYuMTMxIDEuNjA2LjM4NyAyLjY5NS44NDggMy42YTkgOSAwIDAgMCAzLjkzMyAzLjkzM2MuOTA1LjQ2MSAxLjk5NC43MTcgMy42Ljg0OEMxMS4xMyA0NyAxMy4xODMgNDcgMTYgNDdoMTZjMS4zMiAwIDIuNDc1IDAgMy41LS4wMTRWMzUuNVptMSAxMi40NjdDMzUuMjMgNDggMzMuNzUyIDQ4IDMyIDQ4SDE2Yy01LjYgMC04LjQgMC0xMC41NC0xLjA5YTEwIDEwIDAgMCAxLTQuMzctNC4zN0MwIDQwLjQgMCAzNy42IDAgMzJWMTZjMC01LjYgMC04LjQgMS4wOS0xMC41NGExMCAxMCAwIDAgMSA0LjM3LTQuMzdDNy42IDAgMTAuNCAwIDE2IDBoMTZjNS42IDAgOC40IDAgMTAuNTQgMS4wOWExMCAxMCAwIDAgMSA0LjM3IDQuMzdDNDggNy42IDQ4IDEwLjQgNDggMTZ2MTZjMCAxLjc1MiAwIDMuMjMtLjAzMyA0LjVIMzYuNXYxMS40NjdaIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiLz48cGF0aCBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9Ii44IiBkPSJNMyAxNC4yYzAtMy45MiAwLTUuODguNzYzLTcuMzc4YTcgNyAwIDAgMSAzLjA2LTMuMDU5QzguMzE4IDMgMTAuMjggMyAxNC4yIDNoMTkuNmMzLjkyIDAgNS44OCAwIDcuMzc4Ljc2M2E3IDcgMCAwIDEgMy4wNTkgMy4wNkM0NSA4LjMxOCA0NSAxMC4yOCA0NSAxNC4ydjE5LjZjMCAzLjkyIDAgNS44OC0uNzYzIDcuMzc4YTcgNyAwIDAgMS0zLjA2IDMuMDU5QzM5LjY4MiA0NSAzNy43MiA0NSAzMy44IDQ1SDE0LjJjLTMuOTIgMC01Ljg4IDAtNy4zNzgtLjc2M2E3IDcgMCAwIDEtMy4wNTktMy4wNkMzIDM5LjY4MiAzIDM3LjcyIDMgMzMuOFYxNC4yWiIvPjxwYXRoIGZpbGw9IiMwMDAiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTMzLjggMy41SDE0LjJjLTEuOTY4IDAtMy40MTUgMC00LjU1Ny4wOTQtMS4xMzYuMDkzLTEuOTI3LjI3NS0yLjU5NC42MTRBNi41IDYuNSAwIDAgMCA0LjIxIDcuMDVjLS4zNC42NjctLjUyMiAxLjQ1OC0uNjE1IDIuNTk0QzMuNSAxMC43ODUgMy41IDEyLjIzMiAzLjUgMTQuMnYxOS42YzAgMS45NjggMCAzLjQxNS4wOTQgNC41NTcuMDkzIDEuMTM2LjI3NSAxLjkyOC42MTQgMi41OTRhNi41IDYuNSAwIDAgMCAyLjg0MSAyLjg0Yy42NjcuMzQgMS40NTguNTIyIDIuNTk0LjYxNSAxLjE0Mi4wOTQgMi41ODkuMDk0IDQuNTU3LjA5NGgxOS42YzEuOTY4IDAgMy40MTUgMCA0LjU1Ny0uMDk0IDEuMTM2LS4wOTMgMS45MjgtLjI3NSAyLjU5NC0uNjE0YTYuNDk5IDYuNDk5IDAgMCAwIDIuODQtMi44NDFjLjM0LS42NjYuNTIyLTEuNDU4LjYxNS0yLjU5NC4wOTQtMS4xNDIuMDk0LTIuNTg5LjA5NC00LjU1N1YxNC4yYzAtMS45NjggMC0zLjQxNS0uMDk0LTQuNTU3LS4wOTMtMS4xMzYtLjI3NS0xLjkyNy0uNjE0LTIuNTk0YTYuNSA2LjUgMCAwIDAtMi44NDEtMi44NGMtLjY2Ni0uMzQtMS40NTgtLjUyMi0yLjU5NC0uNjE1QzM3LjIxNSAzLjUgMzUuNzY4IDMuNSAzMy44IDMuNVpNMy43NjMgNi44MjJDMyA4LjMyIDMgMTAuMjggMyAxNC4ydjE5LjZjMCAzLjkyIDAgNS44OC43NjMgNy4zNzhhNyA3IDAgMCAwIDMuMDYgMy4wNTlDOC4zMTggNDUgMTAuMjggNDUgMTQuMiA0NWgxOS42YzMuOTIgMCA1Ljg4IDAgNy4zNzgtLjc2M2E3IDcgMCAwIDAgMy4wNTktMy4wNkM0NSAzOS42ODIgNDUgMzcuNzIgNDUgMzMuOFYxNC4yYzAtMy45MiAwLTUuODgtLjc2My03LjM3OGE3IDcgMCAwIDAtMy4wNi0zLjA1OUMzOS42ODIgMyAzNy43MiAzIDMzLjggM0gxNC4yYy0zLjkyIDAtNS44OCAwLTcuMzc4Ljc2M2E3IDcgMCAwIDAtMy4wNTkgMy4wNloiIGNsaXAtcnVsZT0iZXZlbm9kZCIvPjxwYXRoIGZpbGw9IiNERkQ3RDUiIGQ9Ik0yNSAxM2MwLTIuOCAwLTQuMi41NDUtNS4yN2E1IDUgMCAwIDEgMi4xODUtMi4xODVDMjguOCA1IDMwLjIgNSAzMyA1aDJjMi44IDAgNC4yIDAgNS4yNy41NDVhNSA1IDAgMCAxIDIuMTg1IDIuMTg1QzQzIDguOCA0MyAxMC4yIDQzIDEzdjJjMCAyLjggMCA0LjItLjU0NSA1LjI3YTUgNSAwIDAgMS0yLjE4NSAyLjE4NUMzOS4yIDIzIDM3LjggMjMgMzUgMjNoLTJjLTIuOCAwLTQuMiAwLTUuMjctLjU0NWE1IDUgMCAwIDEtMi4xODUtMi4xODVDMjUgMTkuMiAyNSAxNy44IDI1IDE1di0yWiIvPjxwYXRoIGZpbGw9IiNFMUQ3RDUiIGQ9Ik0zOCA1aC04YTUgNSAwIDAgMC01IDV2OGE1IDUgMCAwIDAgNSA1aDhhNSA1IDAgMCAwIDUtNXYtOGE1IDUgMCAwIDAtNS01WiIvPjxwYXRoIGZpbGw9IiNEMjIyMDkiIGQ9Ik0zNy45MzggMTYuODEzaC03Ljg3NnYuNTYyaDcuODc1di0uNTYzWm0wIC41NjJoLTcuODc2di41NjNoNy44NzV2LS41NjNaIi8+PHBhdGggZmlsbD0iI0QyMjIwOSIgZD0iTTM3LjkzOCAxNy45MzhoLTcuODc2di41NjJoNy44NzV2LS41NjNabTAgLjU2MmgtNy44NzZ2LjU2M2g3Ljg3NVYxOC41WiIvPjxwYXRoIGZpbGw9IiNEMjIyMDkiIGQ9Ik0zMS4xODggMTkuMDYzaC0xLjEyNXYuNTYyaDEuMTI1di0uNTYzWm02Ljc1IDBIMzEuNzV2LjU2Mmg2LjE4OHYtLjU2M1ptLTYuNzUuNTYyaC0xLjEyNXYuNTYzaDEuMTI1di0uNTYzWm02Ljc1IDBIMzEuNzV2LjU2M2g2LjE4OHYtLjU2M1oiLz48cGF0aCBmaWxsPSIjRDIyMjA5IiBkPSJNMzEuMTg4IDIwLjE4OGgtMS4xMjV2LjU2MmgxLjEyNXYtLjU2M1ptNi43NSAwSDMxLjc1di41NjJoNi4xODh2LS41NjNabS02Ljc1LjU2MmgtMS4xMjV2LjU2M2gxLjEyNXYtLjU2M1ptNi43NSAwSDMxLjc1di41NjNoNi4xODh2LS41NjNaIi8+PHBhdGggZmlsbD0iI0QyMjIwOSIgZD0iTTMxLjE4OCAyMS4zMTNoLTEuMTI1di41NjJoMS4xMjV2LS41NjNabTYuNzUgMEgzMS43NXYuNTYyaDYuMTg4di0uNTYzWm0tNi43NS41NjJoLTEuMTI1di41NjNoMS4xMjV2LS41NjNabTYuNzUgMEgzMS43NXYuNTYzaDYuMTg4di0uNTYzWiIvPjxwYXRoIGZpbGw9IiNEMjIyMDkiIGQ9Ik0zMS4xODggMjIuNDM4aC0xLjEyNVYyM2gxLjEyNXYtLjU2M1ptNi43NSAwSDMxLjc1VjIzaDYuMTg4di0uNTYzWiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0zMi44NzUgMTcuOTM4aC0uNTYzdi41NjJoLjU2M3YtLjU2M1ptMi4yNSAwSDM0di41NjJoMS4xMjV2LS41NjNabTEuMTI1IDBoLS41NjN2LjU2MmguNTYzdi0uNTYzWm0tMy4zNzUuNTYyaC0uNTYzdi41NjNoLjU2M1YxOC41Wm0yLjI1IDBIMzR2LjU2M2gxLjEyNVYxOC41Wm0xLjEyNSAwaC0uNTYzdi41NjNoLjU2M1YxOC41WiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0zMy40MzggMTkuMDYzaC0xLjEyNnYuNTYyaDEuMTI2di0uNTYzWm0xLjY4NyAwSDM0di41NjJoMS4xMjV2LS41NjNabTEuNjg4IDBoLTEuMTI2di41NjJoMS4xMjZ2LS41NjNaIi8+PHBhdGggZmlsbD0iI0MxNjcxMCIgZD0iTTMzLjQzOCA4LjM3NWgtLjU2M3YuNTYzaC41NjN2LS41NjNabTEuNjg3IDBIMzR2LjU2M2gxLjEyNXYtLjU2M1oiLz48cGF0aCBmaWxsPSIjRDRBMDE1IiBkPSJNMzEuNzUgOC45MzhoLTEuNjg4VjkuNWgxLjY4OHYtLjU2M1oiLz48cGF0aCBmaWxsPSIjQzE2NzEwIiBkPSJNMzUuNjg4IDguOTM4aC0zLjM3NlY5LjVoMy4zNzZ2LS41NjNaIi8+PHBhdGggZmlsbD0iI0Q0QTAxNSIgZD0iTTM3LjkzOCA4LjkzOEgzNi4yNVY5LjVoMS42ODh2LS41NjNaIi8+PHBhdGggZmlsbD0iI0MxNjcxMCIgZD0iTTMwLjA2MyA5LjVoLTEuMTI1di41NjNoMS4xMjVWOS41WiIvPjxwYXRoIGZpbGw9IiNENEEwMTUiIGQ9Ik0zMS43NSA5LjVoLTEuNjg4di41NjNoMS42ODhWOS41WiIvPjxwYXRoIGZpbGw9IiNDMTY3MTAiIGQ9Ik0zNS4xMjUgOS41SDMxLjc1di41NjNoMy4zNzVWOS41WiIvPjxwYXRoIGZpbGw9IiNENEEwMTUiIGQ9Ik0zNy45MzggOS41SDM2LjI1di41NjNoMS42ODhWOS41WiIvPjxwYXRoIGZpbGw9IiNDMTY3MTAiIGQ9Ik0zMC4wNjMgMTAuMDYzaC0xLjEyNXYuNTYyaDEuMTI1di0uNTYzWiIvPjxwYXRoIGZpbGw9IiNENEEwMTUiIGQ9Ik0zNCAxMC4wNjNoLTMuOTM4di41NjJIMzR2LS41NjNaIi8+PHBhdGggZmlsbD0iI0MxNjcxMCIgZD0iTTM0LjU2MyAxMC4wNjNIMzR2LjU2MmguNTYzdi0uNTYzWiIvPjxwYXRoIGZpbGw9IiNENEEwMTUiIGQ9Ik0zNy45MzggMTAuMDYzaC0zLjM3NnYuNTYyaDMuMzc2di0uNTYzWiIvPjxwYXRoIGZpbGw9IiNDMTY3MTAiIGQ9Ik0zMC4wNjMgMTAuNjI1aC0xLjY4OHYuNTYzaDEuNjg4di0uNTYzWiIvPjxwYXRoIGZpbGw9IiNENEEwMTUiIGQ9Ik0zMy40MzggMTAuNjI1aC0zLjM3NnYuNTYzaDMuMzc1di0uNTYzWiIvPjxwYXRoIGZpbGw9IiNGRkU5MzkiIGQ9Ik0zNS4xMjUgMTAuNjI1aC0xLjY4OHYuNTYzaDEuNjg4di0uNTYzWiIvPjxwYXRoIGZpbGw9IiNENEEwMTUiIGQ9Ik0zNy45MzggMTAuNjI1aC0yLjgxM3YuNTYzaDIuODEzdi0uNTYzWiIvPjxwYXRoIGZpbGw9IiNDMTY3MTAiIGQ9Ik0zMC4wNjMgMTEuMTg4aC0xLjEyNXYuNTYyaDEuMTI1di0uNTYzWiIvPjxwYXRoIGZpbGw9IiNENEEwMTUiIGQ9Ik0zNCAxMS4xODhoLTMuOTM4di41NjJIMzR2LS41NjNaIi8+PHBhdGggZmlsbD0iI0ZGRTkzOSIgZD0iTTM0LjU2MyAxMS4xODhIMzR2LjU2MmguNTYzdi0uNTYzWiIvPjxwYXRoIGZpbGw9IiNENEEwMTUiIGQ9Ik0zNy45MzggMTEuMTg4aC0zLjM3NnYuNTYyaDMuMzc2di0uNTYzWiIvPjxwYXRoIGZpbGw9IiNDMTY3MTAiIGQ9Ik0zMC4wNjMgMTEuNzVoLTEuMTI1di41NjNoMS4xMjV2LS41NjNaIi8+PHBhdGggZmlsbD0iI0Q0QTAxNSIgZD0iTTM0IDExLjc1aC0zLjkzOHYuNTYzSDM0di0uNTYzWiIvPjxwYXRoIGZpbGw9IiNGRkU5MzkiIGQ9Ik0zNC41NjMgMTEuNzVIMzR2LjU2M2guNTYzdi0uNTYzWiIvPjxwYXRoIGZpbGw9IiNENEEwMTUiIGQ9Ik0zNy45MzggMTEuNzVoLTMuMzc2di41NjNoMy4zNzZ2LS41NjNaIi8+PHBhdGggZmlsbD0iI0MxNjcxMCIgZD0iTTMwLjA2MyAxMi4zMTNoLTEuNjg4di41NjJoMS42ODh2LS41NjNaIi8+PHBhdGggZmlsbD0iI0Q0QTAxNSIgZD0iTTM0IDEyLjMxM2gtMy45Mzh2LjU2MkgzNHYtLjU2M1oiLz48cGF0aCBmaWxsPSIjRkZFOTM5IiBkPSJNMzQuNTYzIDEyLjMxM0gzNHYuNTYyaC41NjN2LS41NjNaIi8+PHBhdGggZmlsbD0iI0Q0QTAxNSIgZD0iTTM3LjkzOCAxMi4zMTNoLTMuMzc2di41NjJoMy4zNzZ2LS41NjNaIi8+PHBhdGggZmlsbD0iI0MxNjcxMCIgZD0iTTMwLjA2MyAxMi44NzVoLTEuMTI1di41NjNoMS4xMjV2LS41NjNaIi8+PHBhdGggZmlsbD0iI0Q0QTAxNSIgZD0iTTM0IDEyLjg3NWgtMy45Mzh2LjU2M0gzNHYtLjU2M1oiLz48cGF0aCBmaWxsPSIjRkZFOTM5IiBkPSJNMzQuNTYzIDEyLjg3NUgzNHYuNTYzaC41NjN2LS41NjNaIi8+PHBhdGggZmlsbD0iI0Q0QTAxNSIgZD0iTTM3LjkzOCAxMi44NzVoLTMuMzc2di41NjNoMy4zNzZ2LS41NjNaIi8+PHBhdGggZmlsbD0iI0MxNjcxMCIgZD0iTTMwLjA2MyAxMy40MzhoLTEuMTI1VjE0aDEuMTI1di0uNTYzWiIvPjxwYXRoIGZpbGw9IiNENEEwMTUiIGQ9Ik0zNCAxMy40MzhoLTMuOTM4VjE0SDM0di0uNTYzWiIvPjxwYXRoIGZpbGw9IiNGRkU5MzkiIGQ9Ik0zNC41NjMgMTMuNDM4SDM0VjE0aC41NjN2LS41NjNaIi8+PHBhdGggZmlsbD0iI0Q0QTAxNSIgZD0iTTM3LjkzOCAxMy40MzhoLTMuMzc2VjE0aDMuMzc2di0uNTYzWiIvPjxwYXRoIGZpbGw9IiNDMTY3MTAiIGQ9Ik0zMC4wNjMgMTRoLTEuNjg4di41NjNoMS42ODhWMTRaIi8+PHBhdGggZmlsbD0iI0QwOEIxMSIgZD0iTTQwLjE4OCAxNEgzMC4wNjJ2LjU2M2gxMC4xMjVWMTRaIi8+PHBhdGggZmlsbD0iI0MxNjcxMCIgZD0iTTMwLjA2MyAxNC41NjNoLTEuMTI1di41NjJoMS4xMjV2LS41NjNaIi8+PHBhdGggZmlsbD0iI0QwOEIxMSIgZD0iTTM3LjkzOCAxNC41NjNoLTcuODc2di41NjJoNy44NzV2LS41NjNaIi8+PHBhdGggZmlsbD0iIzAwMCIgZD0iTTM4LjUgMTQuNTYzaC0uNTYzdi41NjJoLjU2M3YtLjU2M1oiLz48cGF0aCBmaWxsPSIjRDA4QjExIiBkPSJNMzkuMDYzIDE0LjU2M0gzOC41di41NjJoLjU2M3YtLjU2M1oiLz48cGF0aCBmaWxsPSIjMDAwIiBkPSJNMzkuNjI1IDE0LjU2M2gtLjU2M3YuNTYyaC41NjN2LS41NjNaIi8+PHBhdGggZmlsbD0iI0QwOEIxMSIgZD0iTTQwLjE4OCAxNC41NjNoLS41NjN2LjU2MmguNTYzdi0uNTYzWiIvPjxwYXRoIGZpbGw9IiNDMTY3MTAiIGQ9Ik0zMC4wNjMgMTUuMTI1aC0xLjY4OHYuNTYzaDEuNjg4di0uNTYzWiIvPjxwYXRoIGZpbGw9IiNEMDhCMTEiIGQ9Ik0zMS4xODggMTUuMTI1aC0xLjEyNXYuNTYzaDEuMTI1di0uNTYzWiIvPjxwYXRoIGZpbGw9IiNGRkU5MzkiIGQ9Ik0zMS43NSAxNS4xMjVoLS41NjN2LjU2M2guNTYzdi0uNTYzWiIvPjxwYXRoIGZpbGw9IiMwMDAiIGQ9Ik0zMi4zMTMgMTUuMTI1aC0uNTYzdi41NjNoLjU2M3YtLjU2M1oiLz48cGF0aCBmaWxsPSIjRkZFOTM5IiBkPSJNMzIuODc1IDE1LjEyNWgtLjU2M3YuNTYzaC41NjN2LS41NjNaIi8+PHBhdGggZmlsbD0iIzAwMCIgZD0iTTMzLjQzOCAxNS4xMjVoLS41NjN2LjU2M2guNTYzdi0uNTYzWiIvPjxwYXRoIGZpbGw9IiNGRkU5MzkiIGQ9Ik0zNCAxNS4xMjVoLS41NjN2LjU2M0gzNHYtLjU2M1oiLz48cGF0aCBmaWxsPSIjMDAwIiBkPSJNMzQuNTYzIDE1LjEyNUgzNHYuNTYzaC41NjN2LS41NjNaIi8+PHBhdGggZmlsbD0iI0ZGRTkzOSIgZD0iTTM1LjEyNSAxNS4xMjVoLS41NjN2LjU2M2guNTYzdi0uNTYzWiIvPjxwYXRoIGZpbGw9IiNEMDhCMTEiIGQ9Ik00MC4xODggMTUuMTI1aC01LjA2M3YuNTYzaDUuMDYzdi0uNTYzWiIvPjxwYXRoIGZpbGw9IiNDMTY3MTAiIGQ9Ik0zMC4wNjMgMTUuNjg4aC0yLjI1di41NjJoMi4yNXYtLjU2M1oiLz48cGF0aCBmaWxsPSIjRDA4QjExIiBkPSJNNDAuMTg4IDE1LjY4OEgzMC4wNjJ2LjU2MmgxMC4xMjV2LS41NjNaIi8+PHBhdGggZmlsbD0iI0MxNjcxMCIgZD0iTTMwLjA2MyAxNi4yNWgtMS42ODh2LjU2M2gxLjY4OHYtLjU2M1oiLz48cGF0aCBmaWxsPSIjRDA4QjExIiBkPSJNNDAuMTg4IDE2LjI1SDMwLjA2MnYuNTYzaDEwLjEyNXYtLjU2M1oiLz48cGF0aCBmaWxsPSIjQzE2NzEwIiBkPSJNMjguOTM4IDE2LjgxM2gtLjU2M3YuNTYyaC41NjN2LS41NjNabTEuMTI1IDBIMjkuNXYuNTYyaC41NjN2LS41NjNaIi8+PHBhdGggZmlsbD0iI0QwOEIxMSIgZD0iTTM3LjkzOCAxNi44MTNoLTcuODc2di41NjJoNy44NzV2LS41NjNaIi8+PHBhdGggZmlsbD0iI0I5MTg1QyIgZD0iTTM0IDExLjE4OGgtMy4zNzV2LjU2MkgzNHYtLjU2M1ptMy45MzggMGgtMy4zNzZ2LjU2MmgzLjM3NnYtLjU2M1ptLTYuNzUuNTYyaC0uNTYzdi41NjNoLjU2M3YtLjU2M1oiLz48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMzIuMzEzIDExLjc1aC0xLjEyNnYuNTYzaDEuMTI1di0uNTYzWiIvPjxwYXRoIGZpbGw9IiMwMDAiIGQ9Ik0zMy40MzggMTEuNzVoLTEuMTI2di41NjNoMS4xMjZ2LS41NjNaIi8+PHBhdGggZmlsbD0iI0I5MTg1QyIgZD0iTTM0IDExLjc1aC0uNTYzdi41NjNIMzR2LS41NjNabTEuMTI1IDBoLS41NjN2LjU2M2guNTYzdi0uNTYzWiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0zNi4yNSAxMS43NWgtMS4xMjV2LjU2M2gxLjEyNXYtLjU2M1oiLz48cGF0aCBmaWxsPSIjMDAwIiBkPSJNMzcuMzc1IDExLjc1SDM2LjI1di41NjNoMS4xMjV2LS41NjNaIi8+PHBhdGggZmlsbD0iI0I5MTg1QyIgZD0iTTM3LjkzOCAxMS43NWgtLjU2M3YuNTYzaC41NjN2LS41NjNabS02Ljc1LjU2M2gtMi4yNXYuNTYyaDIuMjV2LS41NjNaIi8+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTMyLjMxMyAxMi4zMTNoLTEuMTI2di41NjJoMS4xMjV2LS41NjNaIi8+PHBhdGggZmlsbD0iIzAwMCIgZD0iTTMzLjQzOCAxMi4zMTNoLTEuMTI2di41NjJoMS4xMjZ2LS41NjNaIi8+PHBhdGggZmlsbD0iI0I5MTg1QyIgZD0iTTM1LjEyNSAxMi4zMTNoLTEuNjg4di41NjJoMS42ODh2LS41NjNaIi8+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTM2LjI1IDEyLjMxM2gtMS4xMjV2LjU2MmgxLjEyNXYtLjU2M1oiLz48cGF0aCBmaWxsPSIjMDAwIiBkPSJNMzcuMzc1IDEyLjMxM0gzNi4yNXYuNTYyaDEuMTI1di0uNTYzWiIvPjxwYXRoIGZpbGw9IiNCOTE4NUMiIGQ9Ik0zNy45MzggMTIuMzEzaC0uNTYzdi41NjJoLjU2M3YtLjU2M1ptLTguNDM4LjU2MmgtLjU2M3YuNTYzaC41NjN2LS41NjNabTEuNjg4IDBoLS41NjN2LjU2M2guNTYzdi0uNTYzWiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0zMi4zMTMgMTIuODc1aC0xLjEyNnYuNTYzaDEuMTI1di0uNTYzWiIvPjxwYXRoIGZpbGw9IiMwMDAiIGQ9Ik0zMy40MzggMTIuODc1aC0xLjEyNnYuNTYzaDEuMTI2di0uNTYzWiIvPjxwYXRoIGZpbGw9IiNCOTE4NUMiIGQ9Ik0zNCAxMi44NzVoLS41NjN2LjU2M0gzNHYtLjU2M1ptMS4xMjUgMGgtLjU2M3YuNTYzaC41NjN2LS41NjNaIi8+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTM2LjI1IDEyLjg3NWgtMS4xMjV2LjU2M2gxLjEyNXYtLjU2M1oiLz48cGF0aCBmaWxsPSIjMDAwIiBkPSJNMzcuMzc1IDEyLjg3NUgzNi4yNXYuNTYzaDEuMTI1di0uNTYzWiIvPjxwYXRoIGZpbGw9IiNCOTE4NUMiIGQ9Ik0zNy45MzggMTIuODc1aC0uNTYzdi41NjNoLjU2M3YtLjU2M1ptLTguNDM4LjU2M2gtLjU2M1YxNGguNTYzdi0uNTYzWm0xLjY4OCAwaC0uNTYzVjE0aC41NjN2LS41NjNaIi8+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTMyLjMxMyAxMy40MzhoLTEuMTI2VjE0aDEuMTI1di0uNTYzWiIvPjxwYXRoIGZpbGw9IiMwMDAiIGQ9Ik0zMy40MzggMTMuNDM4aC0xLjEyNlYxNGgxLjEyNnYtLjU2M1oiLz48cGF0aCBmaWxsPSIjQjkxODVDIiBkPSJNMzQgMTMuNDM4aC0uNTYzVjE0SDM0di0uNTYzWm0xLjEyNSAwaC0uNTYzVjE0aC41NjN2LS41NjNaIi8+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTM2LjI1IDEzLjQzOGgtMS4xMjVWMTRoMS4xMjV2LS41NjNaIi8+PHBhdGggZmlsbD0iIzAwMCIgZD0iTTM3LjM3NSAxMy40MzhIMzYuMjVWMTRoMS4xMjV2LS41NjNaIi8+PHBhdGggZmlsbD0iI0I5MTg1QyIgZD0iTTM3LjkzOCAxMy40MzhoLS41NjNWMTRoLjU2M3YtLjU2M1pNMzQgMTRoLTMuMzc1di41NjNIMzRWMTRabTMuOTM4IDBoLTMuMzc2di41NjNoMy4zNzZWMTRaIi8+PHBhdGggZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIuMyIgZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMzUgNS41aC0yYy0xLjQwOCAwLTIuNDM1IDAtMy4yNDMuMDY2LS44MDMuMDY2LTEuMzQ3LjE5NC0xLjguNDI0YTQuNSA0LjUgMCAwIDAtMS45NjYgMS45NjdjLS4yMzEuNDUzLS4zNTkuOTk3LS40MjQgMS44LS4wNjcuODA4LS4wNjcgMS44MzUtLjA2NyAzLjI0M3YyYzAgMS40MDggMCAyLjQzNS4wNjcgMy4yNDMuMDY1LjgwMy4xOTMgMS4zNDcuNDI0IDEuOGE0LjUgNC41IDAgMCAwIDEuOTY2IDEuOTY2Yy40NTMuMjMxLjk5Ny4zNTkgMS44LjQyNC44MDguMDY3IDEuODM1LjA2NyAzLjI0My4wNjdoMmMxLjQwOCAwIDIuNDM1IDAgMy4yNDMtLjA2Ny44MDMtLjA2NSAxLjM0Ny0uMTkzIDEuOC0uNDI0YTQuNSA0LjUgMCAwIDAgMS45NjctMS45NjZjLjIzLS40NTMuMzU4LS45OTcuNDI0LTEuOC4wNjYtLjgwOC4wNjYtMS44MzUuMDY2LTMuMjQzdi0yYzAtMS40MDggMC0yLjQzNS0uMDY2LTMuMjQzLS4wNjYtLjgwMy0uMTk0LTEuMzQ3LS40MjQtMS44YTQuNSA0LjUgMCAwIDAtMS45NjctMS45NjdjLS40NTMtLjIzLS45OTctLjM1OC0xLjgtLjQyNEMzNy40MzUgNS41IDM2LjQwOCA1LjUgMzUgNS41Wm0tOS40NTUgMi4yM0MyNSA4LjggMjUgMTAuMiAyNSAxM3YyYzAgMi44IDAgNC4yLjU0NSA1LjI3YTUgNSAwIDAgMCAyLjE4NSAyLjE4NUMyOC44IDIzIDMwLjIgMjMgMzMgMjNoMmMyLjggMCA0LjIgMCA1LjI3LS41NDVhNSA1IDAgMCAwIDIuMTg1LTIuMTg1QzQzIDE5LjIgNDMgMTcuOCA0MyAxNXYtMmMwLTIuOCAwLTQuMi0uNTQ1LTUuMjdhNSA1IDAgMCAwLTIuMTg1LTIuMTg1QzM5LjIgNSAzNy44IDUgMzUgNWgtMmMtMi44IDAtNC4yIDAtNS4yNy41NDVhNSA1IDAgMCAwLTIuMTg1IDIuMTg1WiIgY2xpcC1ydWxlPSJldmVub2RkIi8+PHBhdGggZmlsbD0iIzU2NENCRiIgZD0iTTUgMzNjMC0yLjggMC00LjIuNTQ1LTUuMjdhNSA1IDAgMCAxIDIuMTg1LTIuMTg1QzguOCAyNSAxMC4yIDI1IDEzIDI1aDJjMi44IDAgNC4yIDAgNS4yNy41NDVhNSA1IDAgMCAxIDIuMTg1IDIuMTg1QzIzIDI4LjggMjMgMzAuMiAyMyAzM3YyYzAgMi44IDAgNC4yLS41NDUgNS4yN2E1IDUgMCAwIDEtMi4xODUgMi4xODVDMTkuMiA0MyAxNy44IDQzIDE1IDQzaC0yYy0yLjggMC00LjIgMC01LjI3LS41NDVhNSA1IDAgMCAxLTIuMTg1LTIuMTg1QzUgMzkuMiA1IDM3LjggNSAzNXYtMloiLz48cGF0aCBmaWxsPSIjRkY2NkIzIiBkPSJNMTEuMTg4IDI2LjEyNWguNTYydjIuODEzaC41NjN2LTIuODEzaC41NjJWMjkuNWguNTYzdi0zLjM3NUgxNFYyOS41aC41NjN2LTMuMzc1aC41NjJ2Mi44MTNoLjU2M3YtMi44MTNoLjU2MnYyLjI1aC41NjN2LTEuNjg4aC41NjJ2Mi4yNWgtLjU2M3YuNTYzaC0uNTYydi41NjNoLTEuMTI1di41NjJoLTIuODEzdi0uNTYzaC0xLjEyNFYyOS41aC0uNTYzdi0uNTYzaC0uNTYzdi0yLjI1aC41NjN2MS42ODhoLjU2M3YtMi4yNVoiLz48cGF0aCBmaWxsPSIjQjNGRkNDIiBkPSJNMTMuNDM4IDMwLjYyNUgxNHYuNTYzaDEuMTI1djIuMjVoMS4xMjV2LS41NjNoLjU2M1YzNGgtMS42ODh2MS4xMjVoLS41NjN2MS4xMjVoLjU2M3Y1LjYyNWgtLjU2M3YtNS4wNjNIMTR2LS41NjJoLTEuNjg4di0xLjEyNWguNTYzdi41NjNIMTR2LTEuMTI2aC41NjNWMzEuNzVoLTEuMTI2di0xLjEyNVoiLz48cGF0aCBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9Ii45IiBkPSJNMTYuMjUgMjYuMTI1aC41NjN2Mi4yNWgtLjU2M3YtMi4yNVptLTUuNjI1LjU2M2guNTYzdjEuNjg3aC0uNTYzdi0xLjY4OFoiLz48cGF0aCBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9Ii45IiBkPSJNMTcuOTM4IDI2LjY4OGgtLjU2M3YyLjI1aC0uNTYzdi41NjJoLS41NjJ2LjU2M2guNTYzVjI5LjVoLjU2MnYtLjU2M2guNTYzdi0yLjI1Wm0tNi4xODgtLjU2M2guNTYzdjIuODEzaC0uNTYzdi0yLjgxM1ptMy45MzggMGgtLjU2M3YyLjgxM2guNTYzdi0yLjgxM1ptLTIuODEzIDBoLjU2M1YyOS41aC0uNTYzdi0zLjM3NVptMS42ODggMEgxNFYyOS41aC41NjN2LTMuMzc1Wm0uNTYyIDMuOTM4aC41NjN2LjU2MmgtLjU2M3YtLjU2M1ptLS41NjIuNTYySDE0di41NjNoLjU2M3YtLjU2M1ptLjU2Mi41NjNoLjU2M3YyLjI1aC0uNTYzdi0yLjI1Wm0yLjI1IDEuNjg3aC0uNTYzVjM0aC41NjN2LTEuMTI1Wk0xNS4xMjUgMzRoLjU2M3YxLjEyNWgtLjU2M1YzNFptMCAyLjI1di0xLjEyNWgtLjU2M3YxLjEyNWguNTYzWm0wIDB2NS42MjVoLjU2M1YzNi4yNWgtLjU2M1ptLTIuMjUtMS4xMjVoLjU2M3YuNTYzaC0uNTYzdi0uNTYzWiIvPjxwYXRoIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjEyIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xNSAyNS41aC0yYy0xLjQwOCAwLTIuNDM1IDAtMy4yNDMuMDY3LS44MDMuMDY1LTEuMzQ3LjE5My0xLjguNDI0YTQuNSA0LjUgMCAwIDAtMS45NjcgMS45NjZjLS4yMy40NTMtLjM1OC45OTctLjQyNCAxLjhDNS41IDMwLjU2NSA1LjUgMzEuNTkyIDUuNSAzM3YyYzAgMS40MDggMCAyLjQzNS4wNjYgMy4yNDMuMDY2LjgwMy4xOTQgMS4zNDcuNDI0IDEuOGE0LjUgNC41IDAgMCAwIDEuOTY3IDEuOTY3Yy40NTMuMjMuOTk3LjM1OCAxLjguNDI0LjgwOC4wNjYgMS44MzUuMDY2IDMuMjQzLjA2NmgyYzEuNDA4IDAgMi40MzUgMCAzLjI0My0uMDY2LjgwMy0uMDY2IDEuMzQ3LS4xOTQgMS44LS40MjRhNC41IDQuNSAwIDAgMCAxLjk2Ni0xLjk2N2MuMjMxLS40NTMuMzU5LS45OTcuNDI0LTEuOC4wNjctLjgwOC4wNjctMS44MzUuMDY3LTMuMjQzdi0yYzAtMS40MDggMC0yLjQzNS0uMDY3LTMuMjQzLS4wNjUtLjgwMy0uMTkzLTEuMzQ3LS40MjQtMS44YTQuNSA0LjUgMCAwIDAtMS45NjYtMS45NjZjLS40NTMtLjIzMS0uOTk3LS4zNTktMS44LS40MjQtLjgwOC0uMDY3LTEuODM1LS4wNjctMy4yNDMtLjA2N1ptLTkuNDU1IDIuMjNDNSAyOC44IDUgMzAuMiA1IDMzdjJjMCAyLjggMCA0LjIuNTQ1IDUuMjdhNSA1IDAgMCAwIDIuMTg1IDIuMTg1QzguOCA0MyAxMC4yIDQzIDEzIDQzaDJjMi44IDAgNC4yIDAgNS4yNy0uNTQ1YTUgNSAwIDAgMCAyLjE4NS0yLjE4NUMyMyAzOS4yIDIzIDM3LjggMjMgMzV2LTJjMC0yLjggMC00LjItLjU0NS01LjI3YTUgNSAwIDAgMC0yLjE4NS0yLjE4NUMxOS4yIDI1IDE3LjggMjUgMTUgMjVoLTJjLTIuOCAwLTQuMiAwLTUuMjcuNTQ1YTUgNSAwIDAgMC0yLjE4NSAyLjE4NVoiIGNsaXAtcnVsZT0iZXZlbm9kZCIvPjxwYXRoIGZpbGw9IiMxNzJEOTkiIGQ9Ik01IDEzYzAtMi44IDAtNC4yLjU0NS01LjI3QTUgNSAwIDAgMSA3LjczIDUuNTQ1QzguOCA1IDEwLjIgNSAxMyA1aDJjMi44IDAgNC4yIDAgNS4yNy41NDVhNSA1IDAgMCAxIDIuMTg1IDIuMTg1QzIzIDguOCAyMyAxMC4yIDIzIDEzdjJjMCAyLjggMCA0LjItLjU0NSA1LjI3YTUgNSAwIDAgMS0yLjE4NSAyLjE4NUMxOS4yIDIzIDE3LjggMjMgMTUgMjNoLTJjLTIuOCAwLTQuMiAwLTUuMjctLjU0NWE1IDUgMCAwIDEtMi4xODUtMi4xODVDNSAxOS4yIDUgMTcuOCA1IDE1di0yWiIvPjxwYXRoIGZpbGw9IiMwMEEyRDgiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTExLjMgMTMuMUg4LjZ2LjloMi43di0uOVptMCAuOWgxLjh2LjloLjl2MS44aC0uOXYtLjloLS45di0uOWgtLjlWMTRabTIuNyAyLjdoLjl2Mi43SDE0di0yLjdaIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiLz48cGF0aCBmaWxsPSIjMDBERTZGIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMS4zIDEyLjJIOC42di45aDIuN3YtLjlabTAgLjloMS44di45aC0xLjh2LS45Wm0yLjcgMS44aC0uOVYxNGguOXYuOVptLjkgMS44SDE0di0xLjhoLjl2MS44Wm0wIDBoLjl2Mi43aC0uOXYtMi43WiIgY2xpcC1ydWxlPSJldmVub2RkIi8+PHBhdGggZmlsbD0iI0ZGRUIwMCIgZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMTEuMyAxMS4zSDguNnYuOWgyLjd2LS45Wm0wIC45aDEuOHYuOWgtMS44di0uOVpNMTQgMTRoLS45di0uOWguOXYuOVptLjkuOUgxNFYxNGguOXYuOVptLjkgMS44aC0uOXYtMS44aC45djEuOFptMCAwaC45djIuN2gtLjl2LTIuN1oiIGNsaXAtcnVsZT0iZXZlbm9kZCIvPjxwYXRoIGZpbGw9IiNGQTAiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTExLjMgMTAuNEg4LjZ2LjloMi43di0uOVptMCAuOUgxNHYuOWguOXYuOWguOXYuOWguOXYxLjhoLjl2My42aC0uOXYtMi43aC0uOXYtMS44aC0uOVYxNEgxNHYtLjloLS45di0uOWgtMS44di0uOVoiIGNsaXAtcnVsZT0iZXZlbm9kZCIvPjxwYXRoIGZpbGw9IiNERDNEMUMiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTEyLjIgOS41SDguNnYuOWgyLjd2LjlIMTR2LjloLjl2LjloLjl2LjloLjl2MS44aC45djMuNmguOXYtMy42aC0uOVYxNGgtLjl2LS45aC0uOXYtLjloLS45di0uOUgxNHYtLjloLTEuOHYtLjlaIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiLz48cGF0aCBmaWxsPSIjQzAzMDc4IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMi4yIDguNkg4LjZ2LjloMy42di0uOVptMCAuOUgxNHYuOWgtMS44di0uOVptNS40IDQuNWgtLjl2LS45aC0uOXYtLjloLS45di0uOUgxNHYtLjloMS44di45aC45di45aC45VjE0Wm0uOSAxLjhoLS45VjE0aC45djEuOFptMCAwaC45djMuNmgtLjl2LTMuNloiIGNsaXAtcnVsZT0iZXZlbm9kZCIvPjxwYXRoIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjEyIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xNSA1LjVoLTJjLTEuNDA4IDAtMi40MzUgMC0zLjI0My4wNjYtLjgwMy4wNjYtMS4zNDcuMTk0LTEuOC40MjRBNC41IDQuNSAwIDAgMCA1Ljk5IDcuOTU3Yy0uMjMuNDUzLS4zNTguOTk3LS40MjQgMS44QzUuNSAxMC41NjUgNS41IDExLjU5MiA1LjUgMTN2MmMwIDEuNDA4IDAgMi40MzUuMDY2IDMuMjQzLjA2Ni44MDMuMTk0IDEuMzQ3LjQyNCAxLjhhNC41IDQuNSAwIDAgMCAxLjk2NyAxLjk2NmMuNDUzLjIzMS45OTcuMzU5IDEuOC40MjQuODA4LjA2NyAxLjgzNS4wNjcgMy4yNDMuMDY3aDJjMS40MDggMCAyLjQzNSAwIDMuMjQzLS4wNjcuODAzLS4wNjUgMS4zNDctLjE5MyAxLjgtLjQyNGE0LjUgNC41IDAgMCAwIDEuOTY2LTEuOTY2Yy4yMzEtLjQ1My4zNTktLjk5Ny40MjQtMS44LjA2Ny0uODA4LjA2Ny0xLjgzNS4wNjctMy4yNDN2LTJjMC0xLjQwOCAwLTIuNDM1LS4wNjctMy4yNDMtLjA2NS0uODAzLS4xOTMtMS4zNDctLjQyNC0xLjhhNC41IDQuNSAwIDAgMC0xLjk2Ni0xLjk2N2MtLjQ1My0uMjMtLjk5Ny0uMzU4LTEuOC0uNDI0QzE3LjQzNSA1LjUgMTYuNDA4IDUuNSAxNSA1LjVaTTUuNTQ1IDcuNzNDNSA4LjggNSAxMC4yIDUgMTN2MmMwIDIuOCAwIDQuMi41NDUgNS4yN2E1IDUgMCAwIDAgMi4xODUgMi4xODVDOC44IDIzIDEwLjIgMjMgMTMgMjNoMmMyLjggMCA0LjIgMCA1LjI3LS41NDVhNSA1IDAgMCAwIDIuMTg1LTIuMTg1QzIzIDE5LjIgMjMgMTcuOCAyMyAxNXYtMmMwLTIuOCAwLTQuMi0uNTQ1LTUuMjdhNSA1IDAgMCAwLTIuMTg1LTIuMTg1QzE5LjIgNSAxNy44IDUgMTUgNWgtMmMtMi44IDAtNC4yIDAtNS4yNy41NDVBNSA1IDAgMCAwIDUuNTQ1IDcuNzNaIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiLz48cGF0aCBmaWxsPSIjOTlCM0ZGIiBkPSJNNDggMzYuNUM0OCA0Mi44NTEgNDIuODUxIDQ4IDM2LjUgNDhTMjUgNDIuODUxIDI1IDM2LjUgMzAuMTQ5IDI1IDM2LjUgMjUgNDggMzAuMTQ5IDQ4IDM2LjVaIi8+PHBhdGggZmlsbD0iIzAwMCIgZmlsbC1vcGFjaXR5PSIuMTIiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTM2LjUgNDcuNWM2LjA3NSAwIDExLTQuOTI1IDExLTExcy00LjkyNS0xMS0xMS0xMS0xMSA0LjkyNS0xMSAxMSA0LjkyNSAxMSAxMSAxMVptMCAuNUM0Mi44NTEgNDggNDggNDIuODUxIDQ4IDM2LjVTNDIuODUxIDI1IDM2LjUgMjUgMjUgMzAuMTQ5IDI1IDM2LjUgMzAuMTQ5IDQ4IDM2LjUgNDhaIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiLz48cGF0aCBmaWxsPSIjN0Y5MUVCIiBkPSJNNDYgMzYuNWE5LjUgOS41IDAgMSAxLTE5IDAgOS41IDkuNSAwIDAgMSAxOSAwWiIvPjxwYXRoIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iLjEyIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0zNi41IDQ1LjVhOSA5IDAgMSAwIDAtMTggOSA5IDAgMCAwIDAgMThabTAgLjVhOS41IDkuNSAwIDEgMCAwLTE5IDkuNSA5LjUgMCAwIDAgMCAxOVoiIGNsaXAtcnVsZT0iZXZlbm9kZCIvPjxwYXRoIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjIiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTMxLjkxMiAzNy4wMzdhLjUuNSAwIDAgMS0uMTM5LS42NjVsNC4yOTgtNy4xM2EuNS41IDAgMCAxIC44NTYgMGw0LjI5NyA3LjEzYS41LjUgMCAwIDEtLjEzNy42NjQuNS41IDAgMCAxIC4xMTkuNjk4bC00LjMgNi4wNTVhLjUuNSAwIDAgMS0uODE1IDBsLTQuMjk3LTYuMDU1YS41LjUgMCAwIDEgLjExOC0uNjk3Wm0uMjkuNDA4IDQuMjk3IDIuNTM4IDQuMy0yLjUzOC00LjMgNi4wNTUtNC4yOTctNi4wNTVabTAtLjgxNSA0LjI5Ny03LjEzIDQuMjk3IDcuMTMtNC4yOTcgMi41NC00LjI5Ny0yLjU0WiIgY2xpcC1ydWxlPSJldmVub2RkIi8+PHBhdGggZmlsbD0iIzAwMCIgZmlsbC1vcGFjaXR5PSIuNTUiIGQ9Ik0zNi40OTkgMjkuNXY5LjY3bDQuMjk3LTIuNTQtNC4yOTctNy4xM1oiLz48cGF0aCBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9Ii4zIiBkPSJtMzYuNDk5IDI5LjUtNC4yOTcgNy4xMyA0LjI5NyAyLjU0VjI5LjVaIi8+PHBhdGggZmlsbD0iIzAwMCIgZmlsbC1vcGFjaXR5PSIuNTUiIGQ9Ik0zNi40OTkgMzkuOTgzVjQzLjVsNC4zLTYuMDU1LTQuMyAyLjUzOFoiLz48cGF0aCBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9Ii4zIiBkPSJNMzYuNDk5IDQzLjV2LTMuNTE3bC00LjI5Ny0yLjUzOCA0LjI5NyA2LjA1NVoiLz48cGF0aCBmaWxsPSIjMDAwIiBkPSJtMzYuNDk5IDM5LjE3IDQuMjk3LTIuNTQtNC4yOTctMS45NTN2NC40OTNaIi8+PHBhdGggZmlsbD0iIzAwMCIgZmlsbC1vcGFjaXR5PSIuNiIgZD0ibTMyLjIwMiAzNi42MyA0LjI5NyAyLjU0di00LjQ5M2wtNC4yOTcgMS45NTNaIi8+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJhIiB4MT0iMjQiIHgyPSIyNCIgeTE9IjAiIHkyPSI0OCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiMxNzQyOTkiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMwMDFFNTkiLz48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCBpZD0iYiIgeDE9IjI0IiB4Mj0iMjQiIHkxPSIwIiB5Mj0iNDgiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBzdG9wLWNvbG9yPSIjRDJEOEU0Ii8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjQzJDOUQ2Ii8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PC9zdmc+";const Vn=Object.freeze(Object.defineProperty({__proto__:null,default:Qn},Symbol.toStringTag,{value:"Module"}));var Rn="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCA0OCA0OCI+PHBhdGggZmlsbD0idXJsKCNhKSIgZD0iTTAgMTZjMC01LjYgMC04LjQgMS4wOS0xMC41NGExMCAxMCAwIDAgMSA0LjM3LTQuMzdDNy42IDAgMTAuNCAwIDE2IDBoMTZjNS42IDAgOC40IDAgMTAuNTQgMS4wOWExMCAxMCAwIDAgMSA0LjM3IDQuMzdDNDggNy42IDQ4IDEwLjQgNDggMTZ2MTZjMCA1LjYgMCA4LjQtMS4wOSAxMC41NGExMC4wMDEgMTAuMDAxIDAgMCAxLTQuMzcgNC4zN0M0MC40IDQ4IDM3LjYgNDggMzIgNDhIMTZjLTUuNiAwLTguNCAwLTEwLjU0LTEuMDlhMTAgMTAgMCAwIDEtNC4zNy00LjM3QzAgNDAuNCAwIDM3LjYgMCAzMlYxNloiLz48cGF0aCBmaWxsPSJ1cmwoI2IpIiBkPSJNMCAxNmMwLTUuNiAwLTguNCAxLjA5LTEwLjU0YTEwIDEwIDAgMCAxIDQuMzctNC4zN0M3LjYgMCAxMC40IDAgMTYgMGgxNmM1LjYgMCA4LjQgMCAxMC41NCAxLjA5YTEwIDEwIDAgMCAxIDQuMzcgNC4zN0M0OCA3LjYgNDggMTAuNCA0OCAxNnYxNmMwIDUuNiAwIDguNC0xLjA5IDEwLjU0YTEwLjAwMSAxMC4wMDEgMCAwIDEtNC4zNyA0LjM3QzQwLjQgNDggMzcuNiA0OCAzMiA0OEgxNmMtNS42IDAtOC40IDAtMTAuNTQtMS4wOWExMCAxMCAwIDAgMS00LjM3LTQuMzdDMCA0MC40IDAgMzcuNiAwIDMyVjE2WiIvPjxwYXRoIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iLjA0IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xLjEzMyA5LjUxM0MxIDExLjEzMSAxIDEzLjE4MyAxIDE2djE2YzAgMi44MTcgMCA0Ljg3LjEzMyA2LjQ4Ni4xMzEgMS42MDYuMzg3IDIuNjk1Ljg0OCAzLjZhOSA5IDAgMCAwIDMuOTMzIDMuOTMzYy45MDUuNDYxIDEuOTk0LjcxNyAzLjYuODQ4QzExLjEzIDQ3IDEzLjE4MyA0NyAxNiA0N2gxNmMyLjgxNyAwIDQuODcgMCA2LjQ4Ni0uMTMzIDEuNjA2LS4xMzEgMi42OTUtLjM4NyAzLjYtLjg0OGE5IDkgMCAwIDAgMy45MzMtMy45MzNjLjQ2MS0uOTA1LjcxNy0xLjk5NC44NDgtMy42QzQ3IDM2Ljg3IDQ3IDM0LjgxNiA0NyAzMlYxNmMwLTIuODE3IDAtNC44Ny0uMTMzLTYuNDg3LS4xMzEtMS42MDUtLjM4Ny0yLjY5NC0uODQ4LTMuNTk5YTkgOSAwIDAgMC0zLjkzMy0zLjkzM2MtLjkwNS0uNDYxLTEuOTk0LS43MTctMy42LS44NDhDMzYuODcgMSAzNC44MTYgMSAzMiAxSDE2Yy0yLjgxNyAwLTQuODcgMC02LjQ4Ny4xMzMtMS42MDUuMTMxLTIuNjk0LjM4Ny0zLjU5OS44NDhhOSA5IDAgMCAwLTMuOTMzIDMuOTMzYy0uNDYxLjkwNS0uNzE3IDEuOTk0LS44NDggMy42Wk0xLjA5IDUuNDZDMCA3LjYgMCAxMC40IDAgMTZ2MTZjMCA1LjYgMCA4LjQgMS4wOSAxMC41NGExMCAxMCAwIDAgMCA0LjM3IDQuMzdDNy42IDQ4IDEwLjQgNDggMTYgNDhoMTZjNS42IDAgOC40IDAgMTAuNTQtMS4wOWExMC4wMDEgMTAuMDAxIDAgMCAwIDQuMzctNC4zN0M0OCA0MC40IDQ4IDM3LjYgNDggMzJWMTZjMC01LjYgMC04LjQtMS4wOS0xMC41NGExMCAxMCAwIDAgMC00LjM3LTQuMzdDNDAuNCAwIDM3LjYgMCAzMiAwSDE2QzEwLjQgMCA3LjYgMCA1LjQ2IDEuMDlhMTAgMTAgMCAwIDAtNC4zNyA0LjM3WiIgY2xpcC1ydWxlPSJldmVub2RkIi8+PHBhdGggZmlsbD0idXJsKCNjKSIgZD0iTTMgMTQuMmMwLTMuOTIgMC01Ljg4Ljc2My03LjM3OGE3IDcgMCAwIDEgMy4wNi0zLjA1OUM4LjMxOCAzIDEwLjI4IDMgMTQuMiAzaDE5LjZjMy45MiAwIDUuODggMCA3LjM3OC43NjNhNyA3IDAgMCAxIDMuMDU5IDMuMDZDNDUgOC4zMTggNDUgMTAuMjggNDUgMTQuMnYxOS42YzAgMy45MiAwIDUuODgtLjc2MyA3LjM3OGE3IDcgMCAwIDEtMy4wNiAzLjA1OUMzOS42ODIgNDUgMzcuNzIgNDUgMzMuOCA0NUgxNC4yYy0zLjkyIDAtNS44OCAwLTcuMzc4LS43NjNhNyA3IDAgMCAxLTMuMDU5LTMuMDZDMyAzOS42ODIgMyAzNy43MiAzIDMzLjhWMTQuMloiLz48cGF0aCBmaWxsPSJ1cmwoI2QpIiBmaWxsLW9wYWNpdHk9Ii43IiBkPSJNMyAxNC4yYzAtMy45MiAwLTUuODguNzYzLTcuMzc4YTcgNyAwIDAgMSAzLjA2LTMuMDU5QzguMzE4IDMgMTAuMjggMyAxNC4yIDNoMTkuNmMzLjkyIDAgNS44OCAwIDcuMzc4Ljc2M2E3IDcgMCAwIDEgMy4wNTkgMy4wNkM0NSA4LjMxOCA0NSAxMC4yOCA0NSAxNC4ydjE5LjZjMCAzLjkyIDAgNS44OC0uNzYzIDcuMzc4YTcgNyAwIDAgMS0zLjA2IDMuMDU5QzM5LjY4MiA0NSAzNy43MiA0NSAzMy44IDQ1SDE0LjJjLTMuOTIgMC01Ljg4IDAtNy4zNzgtLjc2M2E3IDcgMCAwIDEtMy4wNTktMy4wNkMzIDM5LjY4MiAzIDM3LjcyIDMgMzMuOFYxNC4yWiIgc3R5bGU9Im1peC1ibGVuZC1tb2RlOnNjcmVlbiIvPjxwYXRoIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iLjIiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTMuNTk0IDkuNjQzQzMuNSAxMC43ODUgMy41IDEyLjIzMiAzLjUgMTQuMnYxOS42YzAgMS45NjggMCAzLjQxNS4wOTQgNC41NTcuMDkzIDEuMTM2LjI3NSAxLjkyOC42MTQgMi41OTRhNi41IDYuNSAwIDAgMCAyLjg0MSAyLjg0Yy42NjcuMzQgMS40NTguNTIyIDIuNTk0LjYxNSAxLjE0Mi4wOTQgMi41ODkuMDk0IDQuNTU3LjA5NGgxOS42YzEuOTY4IDAgMy40MTUgMCA0LjU1Ny0uMDk0IDEuMTM2LS4wOTMgMS45MjgtLjI3NSAyLjU5NC0uNjE0YTYuNDk5IDYuNDk5IDAgMCAwIDIuODQtMi44NDFjLjM0LS42NjYuNTIyLTEuNDU4LjYxNS0yLjU5NC4wOTQtMS4xNDIuMDk0LTIuNTg5LjA5NC00LjU1N1YxNC4yYzAtMS45NjggMC0zLjQxNS0uMDk0LTQuNTU3LS4wOTMtMS4xMzYtLjI3NS0xLjkyNy0uNjE0LTIuNTk0YTYuNSA2LjUgMCAwIDAtMi44NDEtMi44NGMtLjY2Ni0uMzQtMS40NTgtLjUyMi0yLjU5NC0uNjE1QzM3LjIxNSAzLjUgMzUuNzY4IDMuNSAzMy44IDMuNUgxNC4yYy0xLjk2OCAwLTMuNDE1IDAtNC41NTcuMDk0LTEuMTM2LjA5My0xLjkyNy4yNzUtMi41OTQuNjE0QTYuNSA2LjUgMCAwIDAgNC4yMSA3LjA1Yy0uMzQuNjY3LS41MjIgMS40NTgtLjYxNSAyLjU5NFptLjE2OS0yLjgyQzMgOC4zMTggMyAxMC4yOCAzIDE0LjJ2MTkuNmMwIDMuOTIgMCA1Ljg4Ljc2MyA3LjM3OGE3IDcgMCAwIDAgMy4wNiAzLjA1OUM4LjMxOCA0NSAxMC4yOCA0NSAxNC4yIDQ1aDE5LjZjMy45MiAwIDUuODggMCA3LjM3OC0uNzYzYTcgNyAwIDAgMCAzLjA1OS0zLjA2QzQ1IDM5LjY4MiA0NSAzNy43MiA0NSAzMy44VjE0LjJjMC0zLjkyIDAtNS44OC0uNzYzLTcuMzc4YTcgNyAwIDAgMC0zLjA2LTMuMDU5QzM5LjY4MiAzIDM3LjcyIDMgMzMuOCAzSDE0LjJjLTMuOTIgMC01Ljg4IDAtNy4zNzguNzYzYTcgNyAwIDAgMC0zLjA1OSAzLjA2WiIgY2xpcC1ydWxlPSJldmVub2RkIi8+PHBhdGggZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIuMiIgZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNNC41ODUgOS43MTJDNC41MDEgMTAuNzQ2IDQuNSAxMi4wNjMgNC41IDEzLjl2MjAuMmMwIDEuODM3IDAgMy4xNTQuMDg1IDQuMTg4LjA4NCAxLjAyMi4yNDQgMS42NzguNTE0IDIuMjA5QTUuNSA1LjUgMCAwIDAgNy41MDMgNDIuOWMuNTMuMjcgMS4xODcuNDMgMi4yMS41MTQgMS4wMzMuMDg0IDIuMzUuMDg1IDQuMTg3LjA4NWgyMC4yYzEuODM3IDAgMy4xNTQgMCA0LjE4OC0uMDg1IDEuMDIyLS4wODQgMS42NzgtLjI0NCAyLjIwOS0uNTE0YTUuNSA1LjUgMCAwIDAgMi40MDQtMi40MDRjLjI3LS41My40My0xLjE4Ny41MTQtMi4yMS4wODQtMS4wMzMuMDg1LTIuMzUuMDg1LTQuMTg3VjEzLjljMC0xLjgzNyAwLTMuMTU0LS4wODUtNC4xODgtLjA4NC0xLjAyMi0uMjQ0LTEuNjc4LS41MTQtMi4yMDlBNS41IDUuNSAwIDAgMCA0MC40OTYgNS4xYy0uNTMtLjI3LTEuMTg3LS40My0yLjIxLS41MTQtMS4wMzMtLjA4NC0yLjM1LS4wODUtNC4xODctLjA4NUgxMy45Yy0xLjgzNyAwLTMuMTU0IDAtNC4xODguMDg1LTEuMDIyLjA4NC0xLjY3OC4yNDQtMi4yMDkuNTE0QTUuNSA1LjUgMCAwIDAgNS4xIDcuNTAzYy0uMjcuNTMtLjQzIDEuMTg3LS41MTQgMi4yMVpNNC4yMDggNy4wNUMzLjUgOC40NCAzLjUgMTAuMjYgMy41IDEzLjl2MjAuMmMwIDMuNjQgMCA1LjQ2LjcwOCA2Ljg1YTYuNSA2LjUgMCAwIDAgMi44NDEgMi44NDFjMS4zOS43MDkgMy4yMS43MDkgNi44NTEuNzA5aDIwLjJjMy42NCAwIDUuNDYgMCA2Ljg1LS43MDlhNi40OTkgNi40OTkgMCAwIDAgMi44NDEtMi44NGMuNzA5LTEuMzkuNzA5LTMuMjEuNzA5LTYuODUxVjEzLjljMC0zLjY0IDAtNS40Ni0uNzA5LTYuODVhNi41IDYuNSAwIDAgMC0yLjg0LTIuODQyQzM5LjU2IDMuNSAzNy43NCAzLjUgMzQuMSAzLjVIMTMuOWMtMy42NCAwLTUuNDYgMC02Ljg1LjcwOEE2LjUgNi41IDAgMCAwIDQuMjA3IDcuMDVaIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIHN0eWxlPSJtaXgtYmxlbmQtbW9kZTpvdmVybGF5Ii8+PHBhdGggZmlsbD0idXJsKCNlKSIgZD0iTTE4IDExLjM0N2MtNC43MyAyLjI0Ny04IDcuMDY4LTggMTIuNjUzIDAgNS41ODUgMy4yNyAxMC40MDYgOCAxMi42NTNWMjMuOTA4YzAtLjMgMC0uNTY1LjA0Ny0uODI5LjA0LS4yMzIuMTEtLjQ1OC4yMDQtLjY3NC4xMDctLjI0NS4yNTQtLjQ2NS40Mi0uNzE1bC45MDUtMS4zNTdhNi44NiA2Ljg2IDAgMCAwIC4yMTItLjMyN0wxOS43OSAyMGwtLjAwMy0uMDA2YTYuODYgNi44NiAwIDAgMC0uMjEyLS4zMjdsLS45MDQtMS4zNTdjLS4xNjctLjI1LS4zMTQtLjQ3LS40MjEtLjcxNWEyLjk5NCAyLjk5NCAwIDAgMS0uMjA0LS42NzRDMTggMTYuNjU3IDE4IDE2LjM5MiAxOCAxNi4wOTJ2LTQuNzQ1WiIvPjxwYXRoIGZpbGw9InVybCgjZikiIGQ9Ik0zMCAzNi42NTNjNC43My0yLjI0NyA4LTcuMDY4IDgtMTIuNjUzIDAtNS41ODUtMy4yNy0xMC40MDYtOC0xMi42NTN2MTIuNzQ1YzAgLjMgMCAuNTY1LS4wNDcuODI5LS4wNC4yMzItLjExLjQ1OC0uMjA0LjY3NC0uMTA3LjI0NS0uMjU0LjQ2NS0uNDIuNzE1bC0uOTA1IDEuMzU3YTYuODYgNi44NiAwIDAgMC0uMjEyLjMyN0wyOC4yMSAyOGwuMDAzLjAwNmMuMDM5LjA2Ny4wOTguMTU2LjIxMi4zMjdsLjkwNCAxLjM1N2MuMTY3LjI1LjMxNC40Ny40MjEuNzE1LjA5NS4yMTYuMTYzLjQ0Mi4yMDQuNjc0LjA0Ny4yNjQuMDQ3LjUyOS4wNDcuODI5djQuNzQ1WiIvPjxwYXRoIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjIiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTIwLjA5MiAzOS43ODJhMiAyIDAgMCAxLS44NzQtLjg3NEMxOSAzOC40OCAxOSAzNy45MiAxOSAzNi44VjIzLjk2OWMwLS4zNiAwLS41NC4wMzEtLjcxNC4wMjgtLjE1NS4wNzMtLjMwNi4xMzYtLjQ1LjA3LS4xNjIuMTctLjMxMS4zNy0uNjExbC44NzEtMS4zMDZjLjIxNC0uMzIxLjMyMS0uNDgyLjM2My0uNjU1YTEgMSAwIDAgMCAwLS40NjZjLS4wNDItLjE3My0uMTQ5LS4zMzQtLjM2My0uNjU0bC0uODctMS4zMDdjLS4yLS4zLS4zLS40NS0uMzctLjYxMWExLjk5OCAxLjk5OCAwIDAgMS0uMTM3LS40NWMtLjAzLS4xNzQtLjAzLS4zNTQtLjAzLS43MTRWMTEuMmMwLTEuMTIgMC0xLjY4LjIxNy0yLjEwOGEyIDIgMCAwIDEgLjg3NC0uODc0QzIwLjUyIDggMjEuMDggOCAyMi4yIDhoMy42YzEuMTIgMCAxLjY4IDAgMi4xMDguMjE4YTIgMiAwIDAgMSAuODc0Ljg3NEMyOSA5LjUyIDI5IDEwLjA4IDI5IDExLjJ2MTIuODMxYzAgLjM2IDAgLjU0LS4wMzEuNzE0YTEuOTk4IDEuOTk4IDAgMCAxLS4xMzYuNDVjLS4wNy4xNjItLjE3LjMxMS0uMzcuNjExbC0uODcxIDEuMzA2Yy0uMjE0LjMyMS0uMzIxLjQ4Mi0uMzYzLjY1NWExIDEgMCAwIDAgMCAuNDY2Yy4wNDIuMTczLjE0OS4zMzQuMzYzLjY1NGwuODcgMS4zMDdjLjIuMy4zLjQ1LjM3MS42MTEuMDYzLjE0NC4xMDkuMjk1LjEzNi40NS4wMzEuMTc0LjAzMS4zNTQuMDMxLjcxNFYzNi44YzAgMS4xMiAwIDEuNjgtLjIxOCAyLjEwOGEyIDIgMCAwIDEtLjg3NC44NzRDMjcuNDggNDAgMjYuOTIgNDAgMjUuOCA0MGgtMy42Yy0xLjEyIDAtMS42OCAwLTIuMTA4LS4yMThaTTE5Ljc5MSAyMGwtLjAwMy0uMDA2YTYuODYgNi44NiAwIDAgMC0uMjEyLS4zMjdsLS44Ny0xLjMwNi0uMDM0LS4wNWMtLjE2Ny0uMjUtLjMxNC0uNDcxLS40MjEtLjcxNmEzIDMgMCAwIDEtLjIwNC0uNjc0QzE4IDE2LjY1NyAxOCAxNi4zOTIgMTggMTYuMDkydi00LjkzYzAtLjUyOCAwLS45ODIuMDMtMS4zNTcuMDMzLS4zOTUuMTA0LS43ODkuMjk3LTEuMTY3YTMgMyAwIDAgMSAxLjMxMS0xLjMxMWMuMzc4LS4xOTMuNzcyLS4yNjQgMS4xNjctLjI5NkMyMS4xOCA3IDIxLjYzNSA3IDIyLjE2MiA3aDMuNjc3Yy41MjcgMCAuOTgyIDAgMS4zNTYuMDMuMzk1LjAzMy43ODkuMTA0IDEuMTY3LjI5N2EzIDMgMCAwIDEgMS4zMTEgMS4zMTFjLjE5My4zNzguMjY0Ljc3Mi4yOTcgMS4xNjcuMDMuMzc1LjAzLjgzLjAzIDEuMzU3djEyLjkzYzAgLjMgMCAuNTY1LS4wNDcuODI5YTMgMyAwIDAgMS0uMjAzLjY3NGMtLjEwOC4yNDUtLjI1NS40NjUtLjQyMi43MTUtLjAxLjAxNy0uMDIyLjAzNC0uMDMzLjA1bC0uODcxIDEuMzA3YTYuODYgNi44NiAwIDAgMC0uMjExLjMyN2wtLjAwNC4wMDYuMDA0LjAwNmMuMDM4LjA2Ny4wOTcuMTU2LjIxLjMyN2wuODcyIDEuMzA2LjAzMy4wNWMuMTY3LjI1LjMxNC40NzEuNDIyLjcxNmEzIDMgMCAwIDEgLjIwMy42NzRjLjA0Ny4yNjQuMDQ3LjUyOS4wNDcuODI5djQuOTNjMCAuNTI4IDAgLjk4My0uMDMgMS4zNTctLjAzMy4zOTUtLjEwNC43ODktLjI5NyAxLjE2N2EzIDMgMCAwIDEtMS4zMTEgMS4zMTFjLS4zNzguMTkzLS43NzIuMjY0LTEuMTY3LjI5Ni0uMzc1LjAzMS0uODMuMDMxLTEuMzU2LjAzMWgtMy42NzdjLS41MjggMC0uOTgyIDAtMS4zNTctLjAzLS4zOTUtLjAzMy0uNzg4LS4xMDQtMS4xNjctLjI5N2EzIDMgMCAwIDEtMS4zMTEtMS4zMTFjLS4xOTMtLjM3OC0uMjY0LS43NzItLjI5Ni0xLjE2N2ExNy4yMyAxNy4yMyAwIDAgMS0uMDMtMS4zNTZ2LTEyLjg3TDE4IDIzLjkwOGMwLS4zIDAtLjU2NS4wNDctLjgyOWEzIDMgMCAwIDEgLjIwNC0uNjc0Yy4xMDctLjI0NS4yNTQtLjQ2NS40Mi0uNzE1bC4wMzQtLjA1Ljg3MS0xLjMwN2E2Ljg2IDYuODYgMCAwIDAgLjIxMi0uMzI3TDE5Ljc5IDIwWiIgY2xpcC1ydWxlPSJldmVub2RkIiBzdHlsZT0ibWl4LWJsZW5kLW1vZGU6b3ZlcmxheSIvPjxwYXRoIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iLjciIGQ9Ik0xOSAxMS4yYzAtMS4xMiAwLTEuNjguMjE4LTIuMTA4YTIgMiAwIDAgMSAuODc0LS44NzRDMjAuNTIgOCAyMS4wOCA4IDIyLjIgOGgzLjZjMS4xMiAwIDEuNjggMCAyLjEwOC4yMThhMiAyIDAgMCAxIC44NzQuODc0QzI5IDkuNTIgMjkgMTAuMDggMjkgMTEuMnYxMi44MzFjMCAuMzYgMCAuNTQtLjAzMS43MTRhMi4wMDMgMi4wMDMgMCAwIDEtLjEzNi40NWMtLjA3LjE2Mi0uMTcuMzExLS4zNy42MTFsLS44NzEgMS4zMDZjLS4yMTQuMzIxLS4zMjEuNDgyLS4zNjMuNjU1YTEgMSAwIDAgMCAwIC40NjZjLjA0Mi4xNzMuMTQ5LjMzNC4zNjMuNjU0bC44NyAxLjMwN2MuMi4zLjMuNDUuMzcxLjYxMS4wNjMuMTQ0LjEwOC4yOTUuMTM2LjQ1LjAzMS4xNzQuMDMxLjM1NC4wMzEuNzE0VjM2LjhjMCAxLjEyIDAgMS42OC0uMjE4IDIuMTA4YTIgMiAwIDAgMS0uODc0Ljg3NEMyNy40OCA0MCAyNi45MiA0MCAyNS44IDQwaC0zLjZjLTEuMTIgMC0xLjY4IDAtMi4xMDgtLjIxOGEyIDIgMCAwIDEtLjg3NC0uODc0QzE5IDM4LjQ4IDE5IDM3LjkyIDE5IDM2LjhWMjMuOTY5YzAtLjM2IDAtLjU0LjAzMS0uNzE0LjAyOC0uMTU1LjA3My0uMzA2LjEzNi0uNDUuMDctLjE2Mi4xNy0uMzExLjM3LS42MTFsLjg3MS0xLjMwNmMuMjE0LS4zMjEuMzIxLS40ODIuMzYzLS42NTVhMSAxIDAgMCAwIDAtLjQ2NmMtLjA0Mi0uMTczLS4xNDktLjMzNC0uMzYzLS42NTRsLS44Ny0xLjMwN2MtLjItLjMtLjMtLjQ1LS4zNzEtLjYxMWEyLjAwMyAyLjAwMyAwIDAgMS0uMTM2LS40NUMxOSAxNi41NzEgMTkgMTYuMzkxIDE5IDE2LjAzMVYxMS4yWiIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iYSIgeDE9IjI0IiB4Mj0iMjQiIHkxPSIwIiB5Mj0iNDgiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBzdG9wLWNvbG9yPSIjMTc0Mjk5Ii8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMDAxRTU5Ii8+PC9saW5lYXJHcmFkaWVudD48bGluZWFyR3JhZGllbnQgaWQ9ImIiIHgxPSIyNCIgeDI9IjI0IiB5MT0iMCIgeTI9IjQ4IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agc3RvcC1jb2xvcj0iI0QyRDhFNCIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0MyQzlENiIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJlIiB4MT0iMjQiIHgyPSIyNCIgeTE9IjEwIiB5Mj0iMzgiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBzdG9wLW9wYWNpdHk9Ii4xMiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1vcGFjaXR5PSIuMDQiLz48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCBpZD0iZiIgeDE9IjI0IiB4Mj0iMjQiIHkxPSIxMCIgeTI9IjM4IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agc3RvcC1vcGFjaXR5PSIuMTIiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3Atb3BhY2l0eT0iLjA0Ii8+PC9saW5lYXJHcmFkaWVudD48cmFkaWFsR3JhZGllbnQgaWQ9ImMiIGN4PSIwIiBjeT0iMCIgcj0iMSIgZ3JhZGllbnRUcmFuc2Zvcm09InJvdGF0ZSgtNDAuMDc3IDY5LjgxNSA0OC42NjUpIHNjYWxlKDgyLjkwNDgpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agb2Zmc2V0PSIuMjc2IiBzdG9wLWNvbG9yPSIjMjBGRjREIi8+PHN0b3Agb2Zmc2V0PSIuNDY0IiBzdG9wLWNvbG9yPSIjMTQ5OUZGIi8+PHN0b3Agb2Zmc2V0PSIuNzU1IiBzdG9wLWNvbG9yPSIjRkY2RkM2Ii8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjQkM2N0ZGIi8+PC9yYWRpYWxHcmFkaWVudD48cmFkaWFsR3JhZGllbnQgaWQ9ImQiIGN4PSIwIiBjeT0iMCIgcj0iMSIgZ3JhZGllbnRUcmFuc2Zvcm09InJvdGF0ZSg0NSAyLjUyIC02LjA4Mikgc2NhbGUoNjguNjc3NykiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBzdG9wLWNvbG9yPSJyZWQiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMwMEEzRkYiLz48L3JhZGlhbEdyYWRpZW50PjwvZGVmcz48L3N2Zz4=";const Gn=Object.freeze(Object.defineProperty({__proto__:null,default:Rn},Symbol.toStringTag,{value:"Module"}));var fn="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAAC/VBMVEUAAADS0dDp6enV1NTi4uLOzc3l5eXh4eHl5eXW1dXa2trQz87e3t2ll5fne3vFdXV+PT14d3fS0dHj4+OBaGh5Pz9yOjqqX19iYmJqQUGlkJBoQUGrqqqKiomEY2PIiYn39vbx8fHz8/P6+fnu7e34+Pjv7+/19fXp6Oje3d3m5uXs7Ozd3Nzr6+ra2dnc29vf397b2trn5+fq6unk5OTV1NTj4+LZ2NfX19fX1tXg4N/i4uHh4eDQz87T0tLU09PR0M/Dw8P7+/rKyslnZ2fKlx/MzMvHx8f/00POzc2rq6uLi4z/zTilpabFxcW/v8CpqKmioqPOmyb/zDTS0dC0tLSfoKGdnZ6YmJn/103/1UjIlRn1tw+6uruxsbGEhIX/zzz/yB7boQ69vb3v0JGPkJCIiYrEqnfMmSObm5uVlZaHh4d9fX7mpwHqqwD8/PyAgIDQnSn/wxatra2RkpP/0T7/yS63trbTnyy3uLivrq+NjY9tbGxqamqUlJX9p6d4eHn+0EGCgoNtaWD2uyBwcHDWozHy05PrzI7dwIZlZWa+jRLBwcDIrnvZ29//oaH7lJRyb2hya1z/xyj1uR+5ihOPobf9ra2ZlZDph4bTgYHOtH/Gbm5WWFk/QELc3uHfenp9fHl3dnOyhRfGkQ6Snq60nKXlx43yhoXehITLd3fdvXG4YmLerzO1yNyZqb7+srK6sKL9m5v11pWuXV2UVFRXVlE2OT3DkiD/wAzoqQHd4eWpvdXR09S2w9Gbo67oo6PRoKPwnJzkxYbWuoLcvnXIq2uQg2lcX2FLTU/yyECitMqUmKDOvJPyjo55foaVinWynHDauGllY1+GdE6dhUv60kr/y0mXfD36xzPoshr3tQTi7fPisrKLk6Guk5unlZW+q4GTjID1zXetmGT6zGHSrFzGo1Xitk6mi0bywjb+vyLUmwjhowDm29qjr7zPt7f/5af83Z773Jz32Ji0lpWffoCklXTUuHK5n2rmvmWzmFWCQUFwNjYdICKb6dEPAAAAIHRSTlMAtqO8vLaztKOzs7yzJAqt+ryEd1P37uHaw769vLxsZrn7H40AAAyrSURBVFjDndYHfBpVHAdw9957C9wBNxjHcaw7IIwKArI0DAegIlGGBg2KSUyM0TpqtO5R26p177333nvvvffefvy/d9AQQl2/lOul9+7b/xv3juXkbLgazgr/Pau1syGG1mmBq9JOgWEYnuep/xSeZyCC1SrSK8lSG5QYyqzXsyzZjkaDDu3TZYbV6/VmM0UxYhdopcDSQJT/KXADZs2UtQsUzKSsqVrRzvrpjlI1bbLd4CoMgNOetjuYhCM+7eRlEkChG9ST4LUwhVbRI9qOUzmYlcVeYNtT/OtgEoukmekGWVxgW1PL0conBPzA2TJE8HqAvAwqQkqnbBHwRxsm0BkVYkxw0hVCjUVcYm8QFeh0x1horNISELI87IO/+DKXUBAQtdLnGyQGCQLpPhNPKrSkitWQfwOq4/Ygp1CYnayVIHz+IKnUEIPD7tF+h4ogmGTGW0wYRtSk0UdQqVy4mmlkM7EG8zegPpkcSo9nk4NR0edjsonxKOkLRrOZoXGDb3BETCcHBjKlcCrpjQ0ronl6JJzNJrJ/02WFl3aXEvH8CJ+y+Oi8yR8cJBi/idQwGiXho+NamCZVvjgYBV9N6eE3QqWFxxVNitALtFqUalbtGxwkzITPTBBwQvh8PkKObxAdHKOD1gqLRlHRnhS8DnuBWpsWrxji7yLxqtSwD3kYbC1DtieIHhIA/0EkbBlqmpMXDamnrN2gHkClVk1yM0v0ST5Co5F7DCEIfBU8ZGpIXF9PkAFQSaWaXp0K3aJue/7yIJHUICMwPJSKqyG4PCIYU+gLIqoPb1+81PNZJppEhsb3oLkYhOImdb6om0AgEyZSCQJzEHpUoxgPovnAmyzFOGeD0Gc6EK9oOSXUGArGqdiUJh2yxKd4xKglv72qZeGZ5hmVk82Ggp5EquXBji2IXaBgBlCR6ovUU1WNmshnGoXs6EAxnMllo3ECjWuemRxNhwkFExkIF8rZWr6QrpC0BnM8L3C9QIPf6/UORSm1YFEJjJWMV8OGftrv1FrVatZUjMdHvAq1V1MM+9Nxf1wXHk0HDUYKdZiR6F4gqYLZI3zQLTnspKq177SXp1refVVamA30gOgp85dv3PO1yIu6VbtAikWvgKUbLB76bJGYtf1Nb9Koszz1xsUXn7Pw+h9o40xwVQBJDMqrG68zqqjGMrFUY5bu0KSGBY7h7774hBNOuPic628o9niNQhuG0ZJaFLVIYUnjUJvjai2OuuluvZRUrCWc1zOMcPfF186fP//aE865/PctukAeFmIwlbO5AloIaRjHdRJh3loVFdhT+FMKzGl0yURUaN5h9d9z5rXzD4XMB3G9bWaBpCpI6aMEujdYMeB+e4POkhkKhHlQiQOsjuEoTsOyrHE4FuW59B333Iu800+f/ySIG3WCEq9nSTKvHS+FvbCzJw12p9soCoVUOe4PVgeyxUKsNF5NVhqJpEZvZqPBicBwPJUCEbyrrz702osvvX6TtWeAZlYzzESbjapby6YziWo9k42UsuahSNYfKJYrjYq3MRS1pzNpjjIPZ5bUCuO5284evuvCexF4+vwTzlx4w5adIGPWkxT6WgEzDQcFbMhWgSe1aJNCiw9fUJJKndnA8yGjJ5Avnn3b63deMHDh3adfffqhAJ5z+R8bTYNOhtKznd9GQGmdtL/CoKUHa48WRMHqjKVSdvb1O6887c2nQATvyTPPWXjD5l1gp6jwmqc57OFthRQKoYbAnf3LNXfcdtuVV15w+wXjT11477XgXbJg4fUbr70UFBkeWpOgyaIi1tR2cuDhfSBab9b7ubOf/fz8J668/bGrbn/zyrvOqF145plnXnLJgkuvv6EDFGBWrKV4f9FCO3W0Mh6GhUIaHSalh7QYwTMavDGeMmfcjbD77Ge/+GK3V9+/6rSrrrr98TvT7y55a8ElCLx803WWghyAunR6PFKulkr1bKTOKlXm0XqkkawPj8LGYYw05lbMYimdrQ489ey+++62xxGvvnDaaY9ddefjw5Vzl7x16YIFCxZevi1Q06A+wFhiQWUgF7Q2vfGcyjxQi6SjyclKKaXRpTMBf04ftyS83vhH+9662x4HvPLpFUi8K9e45owl57596YJLF66LLZy1OCvMCppnsj0tSqZs1mjtAwazGUaPZdG2zEgSffxl2DvoFVn8qtw848LSknN/XLhw3XU6QBpAEDUsgA4lTLZGNeqAoWsMKVkWfy/nGcEqiTrw9kPeTjvs8OijV3xywQUjb19zxhmFE5fcAN5MEIZcn9CwyuE0ApXFEbRL+fXIAw55Tq7D2333ww579NFPLogi79wTF90IM9wJSgzPs9EAq8lV9XiZUMDBysQclMdYZ3rAHfbiiy+++vJdyTMK9RNvfGSzmaBOEhizt8DShnqeCSthLIFD0Zvl8qA+2jjD236XXXY+5fObX05XwVv03PrAdIJOgXFMRiowsbVSvtji9BAoTx4+rtM7ELyddz5lzx1vPu/50RMXPTyvGzQ6rXzYFR0KUl5HrmgKyV6rPOzRpuMfmOXtv8/NII4tmjNvbOsuUIRp5vVgsCxURyINPKrlOZfh7bjddjcfe95J8+bNjWw1A1zDJFoFmBYKk0BhbtrjaGOnt33b22e7XXc9/7zDx+ZWhlbuBiUBHhYh15RLw57MCRJ4Ie+0ByD2DgZvO+TNm1vJx1bsAjlJEGOJpIuRLVTdtKczjf7c9uQCp71TD58zVhgKerpAA4C2oD/uL7Y0Mw+LDzy8/OjHH+z0dpnpHTKZjPf3d4O00ypQSWuZhXUCbyF4ECVGgPr6Qn3G/tHfbp1Z3xF7HiwPIPIiiaLH0hP0ezP5QIbVT0Uq9WR0pGS1Wk2laKky8TL2Tu7yoMDzkDcU67M73F2gjRYlJlmu1SZH9LF6ppksFSqFjMsqBbON4IMtb6du79Qb5xwyOhSzG2yzQZ0oWbx+i4uDl5pR4gQ7L4YkwSly3NnH7Lss73DkBe0mg2EWaNeJ0GcGh8dHeHrR80a3vYN6edDfoM1kMhkcfd2gkXNKVqsAGNXH2AFEnuTivO8g75ZleSO5oNEIoL0HKILI5Bm+WS8O8Lg+JjA5deIV095h2DsSvH1aXj5X7TNCDPauLq/uMAEoMPkmH5xM1oyCAPufWK6lD3nn1/1meTtib+yQUr46YdHpdFBiD5AWxWSuYjROjNSiBqeYD/kNJc9E4piPX7sFJgT3F3sHY+/Ywxc/Uju3viREAwgVOnqAzhFXKdBIliPlicl6YWDu3EJqvPbuMR/v99otGGx5+2PvucWLFy8aSxWmOLo3aDHQUrScTlYmqvVm1BFN5XPxqUzO+8QxR7/3wUsvHbQDeuCmvZMWjw1Uin6dV0fTIJp6gTpOpAU+V61EKUZCU+LkRK551n17Xff9t9+8tBMMYIcH8xEOGmgcqLAXaNPRMC3cxFDdIEGcTifH6WxPH3P0UUddd913H3y2w2GnzPRiBh3cwi0bNAIoin6JszolCbZoEY3OE/ftdRTkuvde+2y3PY88stODCmgZNC4ThE6HoDbJKQxzImo7df/RAEL22nffPa9ABWJvbAB5iONaXbbNAvvsRh1cnxxGnZW8GQmBnqfv2wvn6IuOPH9/AHfcB9eHPegvBntXCKBJpxPHG2g2rJaGE1UoFvY+WuaOuf+sBz/68MODd1zqGQFEGowLrtDS3wW6HSYjl5gM5MuFoXTNJnKBiXIhfx/iwDvrOJSz9t9O7q8XugNYxyT3Ag1G90R2ojoZqdXL0PtsdaR2zdGt8o7bG3Lcg/A+Ai8BHiqw7elMCPR0gf0Og25oIp6wBBz9U+U+zjhaTIz+dN20B3n/+TlzDgHPAR5AsocLnA0u77HYTANhkcMj7YTREd2Rxk0P7QXdlblnHjpx3pw5cyNhr8NkMgIJJgTNCID2XmBxwm2EFq2ecMnx0k2Lb9wbvLY2Nvfc8ZGYw4BBkKY9m73PteZM0GWxpVJwWW6GOyItWnzT4oefxto80Caq2UTO7zAYQAQTR+Zs8I4KzQRXDvXB/2zobGgK3HTTIw8vegRKQ7UNZBPNKb/bbrMZECmj8IFfwLP0zwLdDtzW1AqcJP5cNO/hOWOg1SLlxLDX77FAGxxM4sj1ARjoAgP9FgcmW4ETy1SzgLVMOOcNeCyoQSsyCh8bcHYo0OKZDfahO3Bb/IF4RmqgDeVi8kW4jD9tF9ohzAFcn9vVDfpd/W63uw9unI4rlxgBzePugws4+G/LjEbwj+7+flfI3wUG/YFQKORyeTz9+AfF5Q/6Qy5ICH/g2I4HfXDQlVAgEPDH2uA6+LjByjjL/5+sLGcD2fsLerG519oDlHIAAAAASUVORK5CYII=";const Pn=Object.freeze(Object.defineProperty({__proto__:null,default:fn},Symbol.toStringTag,{value:"Module"}));var Jn="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0OCIgaGVpZ2h0PSI0OCIgZmlsbD0ibm9uZSI+PGcgY2xpcC1wYXRoPSJ1cmwoI2EpIj48cGF0aCBmaWxsPSJ1cmwoI2IpIiBkPSJNMCAxNmMwLTUuNiAwLTguNCAxLjA5LTEwLjU0YTEwIDEwIDAgMCAxIDQuMzctNC4zN0M3LjYgMCAxMC40IDAgMTYgMGgxNmM1LjYgMCA4LjQgMCAxMC41NCAxLjA5YTEwIDEwIDAgMCAxIDQuMzcgNC4zN0M0OCA3LjYgNDggMTAuNCA0OCAxNnYxNmMwIDUuNiAwIDguNC0xLjA5IDEwLjU0YTEwLjAwMSAxMC4wMDEgMCAwIDEtNC4zNyA0LjM3QzQwLjQgNDggMzcuNiA0OCAzMiA0OEgxNmMtNS42IDAtOC40IDAtMTAuNTQtMS4wOWExMCAxMCAwIDAgMS00LjM3LTQuMzdDMCA0MC40IDAgMzcuNiAwIDMyVjE2WiIvPjxwYXRoIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iLjA4IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xLjEzMyA5LjUxM0MxIDExLjEzMSAxIDEzLjE4MyAxIDE2djE2YzAgMi44MTcgMCA0Ljg3LjEzMyA2LjQ4Ni4xMzEgMS42MDYuMzg3IDIuNjk1Ljg0OCAzLjZhOSA5IDAgMCAwIDMuOTMzIDMuOTMzYy45MDUuNDYxIDEuOTk0LjcxNyAzLjYuODQ4QzExLjEzIDQ3IDEzLjE4MyA0NyAxNiA0N2gxNmMyLjgxNyAwIDQuODcgMCA2LjQ4Ni0uMTMzIDEuNjA2LS4xMzEgMi42OTUtLjM4NyAzLjYtLjg0OGE5IDkgMCAwIDAgMy45MzMtMy45MzNjLjQ2MS0uOTA1LjcxNy0xLjk5NC44NDgtMy42QzQ3IDM2Ljg3IDQ3IDM0LjgxNiA0NyAzMlYxNmMwLTIuODE3IDAtNC44Ny0uMTMzLTYuNDg3LS4xMzEtMS42MDUtLjM4Ny0yLjY5NC0uODQ4LTMuNTk5YTkgOSAwIDAgMC0zLjkzMy0zLjkzM2MtLjkwNS0uNDYxLTEuOTk0LS43MTctMy42LS44NDhDMzYuODcgMSAzNC44MTYgMSAzMiAxSDE2Yy0yLjgxNyAwLTQuODcgMC02LjQ4Ny4xMzMtMS42MDUuMTMxLTIuNjk0LjM4Ny0zLjU5OS44NDhhOSA5IDAgMCAwLTMuOTMzIDMuOTMzYy0uNDYxLjkwNS0uNzE3IDEuOTk0LS44NDggMy42Wk0xLjA5IDUuNDZDMCA3LjYgMCAxMC40IDAgMTZ2MTZjMCA1LjYgMCA4LjQgMS4wOSAxMC41NGExMCAxMCAwIDAgMCA0LjM3IDQuMzdDNy42IDQ4IDEwLjQgNDggMTYgNDhoMTZjNS42IDAgOC40IDAgMTAuNTQtMS4wOWExMC4wMDEgMTAuMDAxIDAgMCAwIDQuMzctNC4zN0M0OCA0MC40IDQ4IDM3LjYgNDggMzJWMTZjMC01LjYgMC04LjQtMS4wOS0xMC41NGExMCAxMCAwIDAgMC00LjM3LTQuMzdDNDAuNCAwIDM3LjYgMCAzMiAwSDE2QzEwLjQgMCA3LjYgMCA1LjQ2IDEuMDlhMTAgMTAgMCAwIDAtNC4zNyA0LjM3WiIgY2xpcC1ydWxlPSJldmVub2RkIi8+PGcgY2xpcC1wYXRoPSJ1cmwoI2MpIj48cGF0aCBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9Ii4xMiIgZD0iTTI0LjcxNiAzNS43OTVjLjUzMSAwIC45NjgtLjIzNCAxLjQ1Mi0uNjg3bDkuOTg5LTkuMzhjLjUzNy0uNTEyLjY3OS0uOTM5LjY3OS0xLjMzIDAtLjQtLjEyOS0uODIzLS42OC0xLjM0bC05Ljk4OC05LjMxOGMtLjUyNy0uNDk3LS45MDMtLjc0LTEuNDM1LS43NC0uNzYyIDAtMS4yNzEuNTkyLTEuMjcxIDEuMzJ2NS4wNzVoLS40NEMxNC40MDMgMTkuMzk1IDEwIDI0LjY4OSAxMCAzNC4zNzNjMCAuOTAzLjUyIDEuNDIyIDEuMTE5IDEuNDIyLjQ4MiAwIC45NDQtLjE1IDEuMzEtLjg1NyAyLjAzMS00LjEwOCA1LjI5NS01LjQ4NiAxMC41OTQtNS40ODZoLjQzOXY1LjA2MmMwIC43My41MDkgMS4yODEgMS4yNTQgMS4yODFaIi8+PC9nPjxnIGNsaXAtcGF0aD0idXJsKCNkKSI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTI0LjcxNiAzNC43OTVjLjUzMSAwIC45NjgtLjIzNCAxLjQ1Mi0uNjg3bDkuOTg5LTkuMzhjLjUzNy0uNTEyLjY3OS0uOTM5LjY3OS0xLjMzIDAtLjQtLjEyOS0uODIzLS42OC0xLjM0bC05Ljk4OC05LjMxOGMtLjUyNy0uNDk3LS45MDMtLjc0LTEuNDM1LS43NC0uNzYyIDAtMS4yNzEuNTkyLTEuMjcxIDEuMzJ2NS4wNzVoLS40NEMxNC40MDMgMTguMzk1IDEwIDIzLjY4OSAxMCAzMy4zNzNjMCAuOTAzLjUyIDEuNDIyIDEuMTE5IDEuNDIyLjQ4MiAwIC45NDQtLjE1IDEuMzEtLjg1NyAyLjAzMS00LjEwOCA1LjI5NS01LjQ4NiAxMC41OTQtNS40ODZoLjQzOXY1LjA2MmMwIC43My41MDkgMS4yODEgMS4yNTQgMS4yODFaIi8+PC9nPjwvZz48ZGVmcz48Y2xpcFBhdGggaWQ9ImEiPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0wIDBoNDh2NDhIMHoiLz48L2NsaXBQYXRoPjxjbGlwUGF0aCBpZD0iYyI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTEwIDEzaDI2LjgzNnYyMi44MDhIMTB6Ii8+PC9jbGlwUGF0aD48Y2xpcFBhdGggaWQ9ImQiPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xMCAxMmgyNi44MzZ2MjIuODA4SDEweiIvPjwvY2xpcFBhdGg+PGxpbmVhckdyYWRpZW50IGlkPSJiIiB4MT0iMjQiIHgyPSIyNCIgeTE9IjAiIHkyPSI0OCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM1OTYyN0EiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM0QTUyNjYiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48L3N2Zz4=";const Hn=Object.freeze(Object.defineProperty({__proto__:null,default:Jn},Symbol.toStringTag,{value:"Module"}));var Xn="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCA0OCA0OCI+PHBhdGggZmlsbD0idXJsKCNhKSIgZD0iTTAgMTZjMC01LjYgMC04LjQgMS4wOS0xMC41NGExMCAxMCAwIDAgMSA0LjM3LTQuMzdDNy42IDAgMTAuNCAwIDE2IDBoMTZjNS42IDAgOC40IDAgMTAuNTQgMS4wOWExMCAxMCAwIDAgMSA0LjM3IDQuMzdDNDggNy42IDQ4IDEwLjQgNDggMTZ2MTZjMCA1LjYgMCA4LjQtMS4wOSAxMC41NGExMC4wMDEgMTAuMDAxIDAgMCAxLTQuMzcgNC4zN0M0MC40IDQ4IDM3LjYgNDggMzIgNDhIMTZjLTUuNiAwLTguNCAwLTEwLjU0LTEuMDlhMTAgMTAgMCAwIDEtNC4zNy00LjM3QzAgNDAuNCAwIDM3LjYgMCAzMlYxNloiLz48cGF0aCBmaWxsPSJ1cmwoI2IpIiBmaWxsLW9wYWNpdHk9Ii43IiBkPSJNMCAxNmMwLTUuNiAwLTguNCAxLjA5LTEwLjU0YTEwIDEwIDAgMCAxIDQuMzctNC4zN0M3LjYgMCAxMC40IDAgMTYgMGgxNmM1LjYgMCA4LjQgMCAxMC41NCAxLjA5YTEwIDEwIDAgMCAxIDQuMzcgNC4zN0M0OCA3LjYgNDggMTAuNCA0OCAxNnYxNmMwIDUuNiAwIDguNC0xLjA5IDEwLjU0YTEwLjAwMSAxMC4wMDEgMCAwIDEtNC4zNyA0LjM3QzQwLjQgNDggMzcuNiA0OCAzMiA0OEgxNmMtNS42IDAtOC40IDAtMTAuNTQtMS4wOWExMCAxMCAwIDAgMS00LjM3LTQuMzdDMCA0MC40IDAgMzcuNiAwIDMyVjE2WiIgc3R5bGU9Im1peC1ibGVuZC1tb2RlOnNjcmVlbiIvPjxwYXRoIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iLjA0IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0zMiAxSDE2Yy0yLjgxNyAwLTQuODcgMC02LjQ4Ny4xMzMtMS42MDUuMTMxLTIuNjk0LjM4Ny0zLjU5OS44NDhhOSA5IDAgMCAwLTMuOTMzIDMuOTMzYy0uNDYxLjkwNS0uNzE3IDEuOTk0LS44NDggMy42QzEgMTEuMTMgMSAxMy4xODMgMSAxNnYxNmMwIDIuODE3IDAgNC44Ny4xMzMgNi40ODYuMTMxIDEuNjA2LjM4NyAyLjY5NS44NDggMy42YTkgOSAwIDAgMCAzLjkzMyAzLjkzM2MuOTA1LjQ2MSAxLjk5NC43MTcgMy42Ljg0OEMxMS4xMyA0NyAxMy4xODMgNDcgMTYgNDdoMTZjMi44MTcgMCA0Ljg3IDAgNi40ODYtLjEzMyAxLjYwNi0uMTMxIDIuNjk1LS4zODcgMy42LS44NDhhOSA5IDAgMCAwIDMuOTMzLTMuOTMzYy40NjEtLjkwNS43MTctMS45OTQuODQ4LTMuNkM0NyAzNi44NyA0NyAzNC44MTYgNDcgMzJWMTZjMC0yLjgxNyAwLTQuODctLjEzMy02LjQ4Ny0uMTMxLTEuNjA1LS4zODctMi42OTQtLjg0OC0zLjU5OWE5IDkgMCAwIDAtMy45MzMtMy45MzNjLS45MDUtLjQ2MS0xLjk5NC0uNzE3LTMuNi0uODQ4QzM2Ljg3IDEgMzQuODE2IDEgMzIgMVpNMS4wOSA1LjQ2QzAgNy42IDAgMTAuNCAwIDE2djE2YzAgNS42IDAgOC40IDEuMDkgMTAuNTRhMTAgMTAgMCAwIDAgNC4zNyA0LjM3QzcuNiA0OCAxMC40IDQ4IDE2IDQ4aDE2YzUuNiAwIDguNCAwIDEwLjU0LTEuMDlhMTAuMDAxIDEwLjAwMSAwIDAgMCA0LjM3LTQuMzdDNDggNDAuNCA0OCAzNy42IDQ4IDMyVjE2YzAtNS42IDAtOC40LTEuMDktMTAuNTRhMTAgMTAgMCAwIDAtNC4zNy00LjM3QzQwLjQgMCAzNy42IDAgMzIgMEgxNkMxMC40IDAgNy42IDAgNS40NiAxLjA5YTEwIDEwIDAgMCAwLTQuMzcgNC4zN1oiIGNsaXAtcnVsZT0iZXZlbm9kZCIvPjxwYXRoIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iLjEyIiBkPSJNMjQgMTNhMS41IDEuNSAwIDAgMC0xLjUgMS41djguMmMwIC4yOCAwIC40Mi0uMDU1LjUyN2EuNS41IDAgMCAxLS4yMTguMjE4Yy0uMTA3LjA1NS0uMjQ3LjA1NS0uNTI3LjA1NWgtOC4yYTEuNSAxLjUgMCAwIDAgMCAzaDguMmMuMjggMCAuNDIgMCAuNTI3LjA1NWEuNS41IDAgMCAxIC4yMTguMjE4Yy4wNTUuMTA3LjA1NS4yNDcuMDU1LjUyN3Y4LjJhMS41IDEuNSAwIDAgMCAzIDB2LTguMmMwLS4yOCAwLS40Mi4wNTUtLjUyN2EuNS41IDAgMCAxIC4yMTgtLjIxOGMuMTA3LS4wNTUuMjQ3LS4wNTUuNTI3LS4wNTVoOC4yYTEuNSAxLjUgMCAwIDAgMC0zaC04LjJjLS4yOCAwLS40MiAwLS41MjctLjA1NWEuNS41IDAgMCAxLS4yMTgtLjIxOGMtLjA1NS0uMTA3LS4wNTUtLjI0Ny0uMDU1LS41Mjd2LTguMkExLjUgMS41IDAgMCAwIDI0IDEzWiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0yNCAxMmExLjUgMS41IDAgMCAwLTEuNSAxLjV2OC4yYzAgLjI4IDAgLjQyLS4wNTUuNTI3YS41LjUgMCAwIDEtLjIxOC4yMThjLS4xMDcuMDU1LS4yNDcuMDU1LS41MjcuMDU1aC04LjJhMS41IDEuNSAwIDAgMCAwIDNoOC4yYy4yOCAwIC40MiAwIC41MjcuMDU1YS41LjUgMCAwIDEgLjIxOC4yMThjLjA1NS4xMDcuMDU1LjI0Ny4wNTUuNTI3djguMmExLjUgMS41IDAgMCAwIDMgMHYtOC4yYzAtLjI4IDAtLjQyLjA1NS0uNTI3YS41LjUgMCAwIDEgLjIxOC0uMjE4Yy4xMDctLjA1NS4yNDctLjA1NS41MjctLjA1NWg4LjJhMS41IDEuNSAwIDAgMCAwLTNoLTguMmMtLjI4IDAtLjQyIDAtLjUyNy0uMDU1YS41LjUgMCAwIDEtLjIxOC0uMjE4Yy0uMDU1LS4xMDctLjA1NS0uMjQ3LS4wNTUtLjUyN3YtOC4yQTEuNSAxLjUgMCAwIDAgMjQgMTJaIi8+PGRlZnM+PHJhZGlhbEdyYWRpZW50IGlkPSJhIiBjeD0iMCIgY3k9IjAiIHI9IjEiIGdyYWRpZW50VHJhbnNmb3JtPSJyb3RhdGUoLTQwLjA3NyA3My4zNzQgNTguNjAzKSBzY2FsZSg5NC43NDg0KSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIG9mZnNldD0iLjI3NiIgc3RvcC1jb2xvcj0iIzIwRkY0RCIvPjxzdG9wIG9mZnNldD0iLjQ2NCIgc3RvcC1jb2xvcj0iIzE0OTlGRiIvPjxzdG9wIG9mZnNldD0iLjc1NSIgc3RvcC1jb2xvcj0iI0ZGNkZDNSIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0JDNjdGRiIvPjwvcmFkaWFsR3JhZGllbnQ+PHJhZGlhbEdyYWRpZW50IGlkPSJiIiBjeD0iMCIgY3k9IjAiIHI9IjEiIGdyYWRpZW50VHJhbnNmb3JtPSJyb3RhdGUoNDUgNS4zMDMgLTEyLjgwMykgc2NhbGUoNzguNDg4OSkiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBzdG9wLWNvbG9yPSJyZWQiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMwMEEzRkYiLz48L3JhZGlhbEdyYWRpZW50PjwvZGVmcz48L3N2Zz4=";const _n=Object.freeze(Object.defineProperty({__proto__:null,default:Xn},Symbol.toStringTag,{value:"Module"}));var qn="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCA0OCA0OCI+PGcgY2xpcC1wYXRoPSJ1cmwoI2EpIj48cGF0aCBmaWxsPSJ1cmwoI2IpIiBkPSJNMCAxNmMwLTUuNiAwLTguNCAxLjA5LTEwLjU0YTEwIDEwIDAgMCAxIDQuMzctNC4zN0M3LjYgMCAxMC40IDAgMTYgMGgxNmM1LjYgMCA4LjQgMCAxMC41NCAxLjA5YTEwIDEwIDAgMCAxIDQuMzcgNC4zN0M0OCA3LjYgNDggMTAuNCA0OCAxNnYxNmMwIDUuNiAwIDguNC0xLjA5IDEwLjU0YTEwLjAwMSAxMC4wMDEgMCAwIDEtNC4zNyA0LjM3QzQwLjQgNDggMzcuNiA0OCAzMiA0OEgxNmMtNS42IDAtOC40IDAtMTAuNTQtMS4wOWExMCAxMCAwIDAgMS00LjM3LTQuMzdDMCA0MC40IDAgMzcuNiAwIDMyVjE2WiIvPjxwYXRoIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iLjA4IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xLjEzMyA5LjUxM0MxIDExLjEzMSAxIDEzLjE4MyAxIDE2djE2YzAgMi44MTcgMCA0Ljg3LjEzMyA2LjQ4Ni4xMzEgMS42MDYuMzg3IDIuNjk1Ljg0OCAzLjZhOSA5IDAgMCAwIDMuOTMzIDMuOTMzYy45MDUuNDYxIDEuOTk0LjcxNyAzLjYuODQ4QzExLjEzIDQ3IDEzLjE4MyA0NyAxNiA0N2gxNmMyLjgxNyAwIDQuODcgMCA2LjQ4Ni0uMTMzIDEuNjA2LS4xMzEgMi42OTUtLjM4NyAzLjYtLjg0OGE5IDkgMCAwIDAgMy45MzMtMy45MzNjLjQ2MS0uOTA1LjcxNy0xLjk5NC44NDgtMy42QzQ3IDM2Ljg3IDQ3IDM0LjgxNiA0NyAzMlYxNmMwLTIuODE3IDAtNC44Ny0uMTMzLTYuNDg3LS4xMzEtMS42MDUtLjM4Ny0yLjY5NC0uODQ4LTMuNTk5YTkgOSAwIDAgMC0zLjkzMy0zLjkzM2MtLjkwNS0uNDYxLTEuOTk0LS43MTctMy42LS44NDhDMzYuODcgMSAzNC44MTYgMSAzMiAxSDE2Yy0yLjgxNyAwLTQuODcgMC02LjQ4Ny4xMzMtMS42MDUuMTMxLTIuNjk0LjM4Ny0zLjU5OS44NDhhOSA5IDAgMCAwLTMuOTMzIDMuOTMzYy0uNDYxLjkwNS0uNzE3IDEuOTk0LS44NDggMy42Wk0xLjA5IDUuNDZDMCA3LjYgMCAxMC40IDAgMTZ2MTZjMCA1LjYgMCA4LjQgMS4wOSAxMC41NGExMCAxMCAwIDAgMCA0LjM3IDQuMzdDNy42IDQ4IDEwLjQgNDggMTYgNDhoMTZjNS42IDAgOC40IDAgMTAuNTQtMS4wOWExMC4wMDEgMTAuMDAxIDAgMCAwIDQuMzctNC4zN0M0OCA0MC40IDQ4IDM3LjYgNDggMzJWMTZjMC01LjYgMC04LjQtMS4wOS0xMC41NGExMCAxMCAwIDAgMC00LjM3LTQuMzdDNDAuNCAwIDM3LjYgMCAzMiAwSDE2QzEwLjQgMCA3LjYgMCA1LjQ2IDEuMDlhMTAgMTAgMCAwIDAtNC4zNyA0LjM3WiIgY2xpcC1ydWxlPSJldmVub2RkIi8+PHBhdGggZmlsbD0iIzAwMCIgZmlsbC1vcGFjaXR5PSIuMTIiIGQ9Ik0zNi4zNDUgMTMuMTU1YTEuNSAxLjUgMCAxIDAtMyAwdjIuMjI0YzAgLjYyNy0uNzc1LjkzNy0xLjIxOC40OTRhMTIuNzUgMTIuNzUgMCAxIDAgMCAxOC4wMzEgMS41IDEuNSAwIDEgMC0yLjEyMS0yLjEyIDkuNzUgOS43NSAwIDEgMSAwLTEzLjc5Yy42MS42MS4xNzIgMS42MTYtLjY5MSAxLjYxNkgyNi44OWExLjUgMS41IDAgMCAwIDAgM2g3Ljk1NWExLjUgMS41IDAgMCAwIDEuNS0xLjV2LTcuOTU1WiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0zNi4zNDUgMTIuMTU1YTEuNSAxLjUgMCAxIDAtMyAwdjIuMjI0YzAgLjYyNy0uNzc1LjkzNy0xLjIxOC40OTRhMTIuNzUgMTIuNzUgMCAxIDAgMCAxOC4wMzEgMS41IDEuNSAwIDEgMC0yLjEyMS0yLjEyIDkuNzUgOS43NSAwIDEgMSAwLTEzLjc5Yy42MS42MS4xNzIgMS42MTYtLjY5MSAxLjYxNkgyNi44OWExLjUgMS41IDAgMCAwIDAgM2g3Ljk1NWExLjUgMS41IDAgMCAwIDEuNS0xLjV2LTcuOTU1WiIvPjwvZz48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImIiIHgxPSIyNCIgeDI9IjI0IiB5MT0iMCIgeTI9IjQ4IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agc3RvcC1jb2xvcj0iIzU5NjI3QSIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzRBNTI2NiIvPjwvbGluZWFyR3JhZGllbnQ+PGNsaXBQYXRoIGlkPSJhIj48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMCAwaDQ4djQ4SDB6Ii8+PC9jbGlwUGF0aD48L2RlZnM+PC9zdmc+";const Kn=Object.freeze(Object.defineProperty({__proto__:null,default:qn},Symbol.toStringTag,{value:"Module"}));var $n="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCA0OCA0OCI+PHBhdGggZmlsbD0idXJsKCNhKSIgZD0iTTAgMTZjMC01LjYgMC04LjQgMS4wOS0xMC41NGExMCAxMCAwIDAgMSA0LjM3LTQuMzdDNy42IDAgMTAuNCAwIDE2IDBoMTZjNS42IDAgOC40IDAgMTAuNTQgMS4wOWExMCAxMCAwIDAgMSA0LjM3IDQuMzdDNDggNy42IDQ4IDEwLjQgNDggMTZ2MTZjMCA1LjYgMCA4LjQtMS4wOSAxMC41NGExMC4wMDEgMTAuMDAxIDAgMCAxLTQuMzcgNC4zN0M0MC40IDQ4IDM3LjYgNDggMzIgNDhIMTZjLTUuNiAwLTguNCAwLTEwLjU0LTEuMDlhMTAgMTAgMCAwIDEtNC4zNy00LjM3QzAgNDAuNCAwIDM3LjYgMCAzMlYxNloiLz48cGF0aCBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9Ii4wOCIgZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMS4xMzMgOS41MTNDMSAxMS4xMzEgMSAxMy4xODMgMSAxNnYxNmMwIDIuODE3IDAgNC44Ny4xMzMgNi40ODYuMTMxIDEuNjA2LjM4NyAyLjY5NS44NDggMy42YTkgOSAwIDAgMCAzLjkzMyAzLjkzM2MuOTA1LjQ2MSAxLjk5NC43MTcgMy42Ljg0OEMxMS4xMyA0NyAxMy4xODMgNDcgMTYgNDdoMTZjMi44MTcgMCA0Ljg3IDAgNi40ODYtLjEzMyAxLjYwNi0uMTMxIDIuNjk1LS4zODcgMy42LS44NDhhOSA5IDAgMCAwIDMuOTMzLTMuOTMzYy40NjEtLjkwNS43MTctMS45OTQuODQ4LTMuNkM0NyAzNi44NyA0NyAzNC44MTYgNDcgMzJWMTZjMC0yLjgxNyAwLTQuODctLjEzMy02LjQ4Ny0uMTMxLTEuNjA1LS4zODctMi42OTQtLjg0OC0zLjU5OWE5IDkgMCAwIDAtMy45MzMtMy45MzNjLS45MDUtLjQ2MS0xLjk5NC0uNzE3LTMuNi0uODQ4QzM2Ljg3IDEgMzQuODE2IDEgMzIgMUgxNmMtMi44MTcgMC00Ljg3IDAtNi40ODcuMTMzLTEuNjA1LjEzMS0yLjY5NC4zODctMy41OTkuODQ4YTkgOSAwIDAgMC0zLjkzMyAzLjkzM2MtLjQ2MS45MDUtLjcxNyAxLjk5NC0uODQ4IDMuNlpNMS4wOSA1LjQ2QzAgNy42IDAgMTAuNCAwIDE2djE2YzAgNS42IDAgOC40IDEuMDkgMTAuNTRhMTAgMTAgMCAwIDAgNC4zNyA0LjM3QzcuNiA0OCAxMC40IDQ4IDE2IDQ4aDE2YzUuNiAwIDguNCAwIDEwLjU0LTEuMDlhMTAuMDAxIDEwLjAwMSAwIDAgMCA0LjM3LTQuMzdDNDggNDAuNCA0OCAzNy42IDQ4IDMyVjE2YzAtNS42IDAtOC40LTEuMDktMTAuNTRhMTAgMTAgMCAwIDAtNC4zNy00LjM3QzQwLjQgMCAzNy42IDAgMzIgMEgxNkMxMC40IDAgNy42IDAgNS40NiAxLjA5YTEwIDEwIDAgMCAwLTQuMzcgNC4zN1oiIGNsaXAtcnVsZT0iZXZlbm9kZCIvPjxwYXRoIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iLjEyIiBkPSJNMjggMTAuNUExLjUgMS41IDAgMCAxIDI5LjUgOWgzLjk1NWMuNTA2IDAgLjc2IDAgLjk3My4wMTVhNiA2IDAgMCAxIDUuNTU3IDUuNTU3Yy4wMTUuMjE0LjAxNS40NjcuMDE1Ljk3NFYxOS41YTEuNSAxLjUgMCAwIDEtMyAwdi00LjEyNWMwLS4zNDggMC0uNTIyLS4wMTQtLjY3YTMgMyAwIDAgMC0yLjY5Mi0yLjY5Yy0uMTQ3LS4wMTUtLjMyLS4wMTUtLjY2OS0uMDE1SDI5LjVhMS41IDEuNSAwIDAgMS0xLjUtMS41Wm0wIDI5YTEuNSAxLjUgMCAwIDAgMS41IDEuNWgzLjk1NWMuNTA2IDAgLjc2IDAgLjk3My0uMDE1YTYgNiAwIDAgMCA1LjU1Ny01LjU1N2MuMDE1LS4yMTQuMDE1LS40NjcuMDE1LS45NzNWMzAuNWExLjUgMS41IDAgMCAwLTMgMHY0LjEyNWMwIC4zNDggMCAuNTIyLS4wMTQuNjdhMyAzIDAgMCAxLTIuNjkyIDIuNjljLS4xNDcuMDE1LS4zMi4wMTUtLjY2OS4wMTVIMjkuNWExLjUgMS41IDAgMCAwLTEuNSAxLjVaTTE4LjUgNDFhMS41IDEuNSAwIDAgMCAwLTNoLTQuMTI1Yy0uMzQ4IDAtLjUyMiAwLS42Ny0uMDE0YTMgMyAwIDAgMS0yLjY5LTIuNjkyYy0uMDE1LS4xNDctLjAxNS0uMzItLjAxNS0uNjY5VjMwLjVhMS41IDEuNSAwIDAgMC0zIDB2My45NTVjMCAuNTA2IDAgLjc2LjAxNS45NzNhNiA2IDAgMCAwIDUuNTU3IDUuNTU3Yy4yMTQuMDE1LjQ2Ny4wMTUuOTc0LjAxNUgxOC41Wk0yMCAxMC41QTEuNSAxLjUgMCAwIDAgMTguNSA5aC0zLjk1NGMtLjUwNyAwLS43NiAwLS45NzQuMDE1YTYgNiAwIDAgMC01LjU1NyA1LjU1N0M4IDE0Ljc4NiA4IDE1LjAzOSA4IDE1LjU0NlYxOS41YTEuNSAxLjUgMCAwIDAgMyAwdi00LjEyNWMwLS4zNDggMC0uNTIyLjAxNC0uNjdhMyAzIDAgMCAxIDIuNjkyLTIuNjljLjE0Ny0uMDE1LjMyLS4wMTUuNjY5LS4wMTVIMTguNWExLjUgMS41IDAgMCAwIDEuNS0xLjVaIi8+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTI4IDkuNUExLjUgMS41IDAgMCAxIDI5LjUgOGgzLjk1NWMuNTA2IDAgLjc2IDAgLjk3My4wMTVhNiA2IDAgMCAxIDUuNTU3IDUuNTU3Yy4wMTUuMjE0LjAxNS40NjcuMDE1Ljk3NFYxOC41YTEuNSAxLjUgMCAwIDEtMyAwdi00LjEyNWMwLS4zNDggMC0uNTIyLS4wMTQtLjY3YTMgMyAwIDAgMC0yLjY5Mi0yLjY5Yy0uMTQ3LS4wMTUtLjMyLS4wMTUtLjY2OS0uMDE1SDI5LjVBMS41IDEuNSAwIDAgMSAyOCA5LjVabTAgMjlhMS41IDEuNSAwIDAgMCAxLjUgMS41aDMuOTU1Yy41MDYgMCAuNzYgMCAuOTczLS4wMTVhNiA2IDAgMCAwIDUuNTU3LTUuNTU3Yy4wMTUtLjIxNC4wMTUtLjQ2Ny4wMTUtLjk3M1YyOS41YTEuNSAxLjUgMCAwIDAtMyAwdjQuMTI1YzAgLjM0OCAwIC41MjItLjAxNC42N2EzIDMgMCAwIDEtMi42OTIgMi42OWMtLjE0Ny4wMTUtLjMyLjAxNS0uNjY5LjAxNUgyOS41YTEuNSAxLjUgMCAwIDAtMS41IDEuNVpNMTguNSA0MGExLjUgMS41IDAgMCAwIDAtM2gtNC4xMjVjLS4zNDggMC0uNTIyIDAtLjY3LS4wMTRhMyAzIDAgMCAxLTIuNjktMi42OTJjLS4wMTUtLjE0Ny0uMDE1LS4zMi0uMDE1LS42NjlWMjkuNWExLjUgMS41IDAgMCAwLTMgMHYzLjk1NWMwIC41MDYgMCAuNzYuMDE1Ljk3M2E2IDYgMCAwIDAgNS41NTcgNS41NTdjLjIxNC4wMTUuNDY3LjAxNS45NzQuMDE1SDE4LjVaTTIwIDkuNUExLjUgMS41IDAgMCAwIDE4LjUgOGgtMy45NTRjLS41MDcgMC0uNzYgMC0uOTc0LjAxNWE2IDYgMCAwIDAtNS41NTcgNS41NTdDOCAxMy43ODYgOCAxNC4wMzkgOCAxNC41NDZWMTguNWExLjUgMS41IDAgMCAwIDMgMHYtNC4xMjVjMC0uMzQ4IDAtLjUyMi4wMTQtLjY3YTMgMyAwIDAgMSAyLjY5Mi0yLjY5Yy4xNDctLjAxNS4zMi0uMDE1LjY2OS0uMDE1SDE4LjVBMS41IDEuNSAwIDAgMCAyMCA5LjVaIi8+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJhIiB4MT0iMjQiIHgyPSIyNCIgeTE9IjAiIHkyPSI0OCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM1OTYyN0EiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM0QTUyNjYiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48L3N2Zz4=";const ut=Object.freeze(Object.defineProperty({__proto__:null,default:$n},Symbol.toStringTag,{value:"Module"}));var et="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBmaWxsPSJub25lIiB2aWV3Qm94PSIwIDAgNzggNzgiPjxkZWZzPjxwYXRoIGlkPSJhIiBmaWxsPSIjMUEwMDdGIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Im0yNi43MjIgNTYuNDUyIDYuNjA4LTEzLjkwNGMtNS4wNDctMS4wNzMtMTAuMTI2LTQuMTk1LTEyLjk5OS03Ljk5M2wtNi45MSAxNC41MjlhMzkuMjU3IDM5LjI1NyAwIDAgMCAxMy4zIDcuMzY4WiIgY2xpcC1ydWxlPSJldmVub2RkIi8+PHBhdGggaWQ9ImIiIGZpbGw9IiM0RTAwMEEiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTU0LjMwNCAzNC4xMzhjLTMuMzIgNC4wNy03LjkzMSA3LjA4Ny0xMi44NjQgOC4yNjNsNi41ODggMTMuODYzYzQuODA5LTEuNjIzIDkuMzA0LTQuMjQ1IDEzLjE4NS03LjYwOGwtNi45MS0xNC41MThaIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiLz48cGF0aCBpZD0iYyIgZmlsbD0iIzFBMDA3RiIgZmlsbC1ydWxlPSJldmVub2RkIiBkPSJtMTMuNDIyIDQ5LjA4NC0zLjQ1NSA3LjI2NWMtMS43NiAzLjY5NC0uNDM3IDguMjQyIDMuMTg0IDEwLjE2NyAzLjg0IDIuMDQgOC41NjYuNDQ4IDEwLjQxOS0zLjQzNGwzLjE1Mi02LjYzYTM5LjQyNyAzOS40MjcgMCAwIDEtMTMuMy03LjM2OCIgY2xpcC1ydWxlPSJldmVub2RkIi8+PHBhdGggaWQ9ImQiIGZpbGw9IiNGRjkzOTYiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTY4LjAyIDE4LjI3N2E3LjU4NiA3LjU4NiAwIDAgMC04LjkzIDUuOTUyYy0uNzI5IDMuNjQyLTIuNDM2IDcuMDM1LTQuNzg3IDkuOTJsNi45IDE0LjUyOGM2LjM2OS01LjUyNyAxMS4wNzQtMTMuMDUyIDEyLjc1OS0yMS40NzEuODIzLTQuMTIyLTEuODQyLTguMTE3LTUuOTQzLTguOTMiIGNsaXAtcnVsZT0iZXZlbm9kZCIvPjxwYXRoIGlkPSJlIiBmaWxsPSIjMDAyREM4IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik00MS40MzggNDIuNDAzYTE5LjMxMiAxOS4zMTIgMCAwIDEtNC40OTYuNTQgMTcuMzMgMTcuMzMgMCAwIDEtMy42MS0uMzk1Yy01LjA0OC0xLjA3Mi0xMC4xMjgtNC4xOTQtMTMtNy45OTMtLjcxOC0uOTQ3LTEuMzAxLTEuOTM2LTEuNzA2LTIuOTQ1LTEuNTcyLTMuODgyLTUuOTk2LTUuNzU2LTkuODc4LTQuMTk1LTMuODgxIDEuNTcyLTUuNzU1IDUuOTk1LTQuMTk0IDkuODc3IDEuNzggNC40MTQgNC45MjMgOC40NjIgOC44NjcgMTEuNzkxYTM5LjM3NyAzOS4zNzcgMCAwIDAgMTMuMjkxIDcuMzdjMy4zNDEgMS4wNzEgNi44MDcgMS42NjUgMTAuMjIgMS42NjUgMy43ODggMCA3LjUyNS0uNjU2IDExLjA4NC0xLjg1M2wtNi41NzgtMTMuODYyWiIgY2xpcC1ydWxlPSJldmVub2RkIi8+PHBhdGggaWQ9ImYiIGZpbGw9IiNGRjUzNkEiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0ibTY0Ljg0NiA1Ni4zMTYtMy42NDMtNy42Ni02LjktMTQuNTE4LS4wMTEuMDFzMC0uMDEuMDExLS4wMUw0NC4yNyAxMy4wMzJhNy41ODkgNy41ODkgMCAwIDAtNi44NDgtNC4zMyA3LjU4OSA3LjU4OSAwIDAgMC02Ljg0OCA0LjMzTDIwLjM0MyAzNC41NTRjMi44NzIgMy43OTkgNy45NSA2LjkyMSAxMi45OTkgNy45OTNsMy4zMDktNi45NTJhLjg2Ni44NjYgMCAwIDEgMS41NjEgMGwzLjIzOCA2LjgwNmguMDItLjAybDYuNTg4IDEzLjg2MyAzLjIzNiA2LjgwN2E3LjU3NiA3LjU3NiAwIDAgMCA2Ljg1OCA0LjMzIDcuNDQgNy40NCAwIDAgMCAyLjAyLS4yODFjNC41NjktMS4yNiA2LjczNC02LjUxNSA0LjY5NC0xMC44MDQiIGNsaXAtcnVsZT0iZXZlbm9kZCIvPjwvZGVmcz48cGF0aCBmaWxsPSIjMDAwIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0zNy40MjIgOC43MDJhNy41OSA3LjU5IDAgMCAxIDYuODQ4IDQuMzNsMTAuMDMzIDIxLjEwN3MwIC4wMS0uMDExLjAxYzAgMCAwLS4wMTEuMDEtLjAxMSAyLjM1My0yLjg4MyA0LjA2LTYuMjc2IDQuNzg4LTkuOTE5LjgyMi00LjExIDQuODE4LTYuNzY0IDguOTMtNS45NTJhNy41ODUgNy41ODUgMCAwIDEgNS45NTMgOC45M2MtMS42ODYgOC40MTktNi4zOSAxNS45NDQtMTIuNzYgMjEuNDdsMy42NDMgNy42NmMyLjAxOSA0LjI0Ni0uMDk0IDkuNDQtNC41NyAxMC43NzFsLS4xMzUuMDQzYTcuNTA2IDcuNTA2IDAgMCAxLTIuMDE5LjI4IDcuNTk1IDcuNTk1IDAgMCAxLTYuODU4LTQuMzNsLTMuMjM4LTYuODA1LTYuNTg3LTEzLjg2M2guMDIyLS4wMjJsLTMuMjM3LTYuODA3YS44NjUuODY1IDAgMCAwLTEuNTYgMGwtMy4zMSA2Ljk1MmMtNS4wNDgtMS4wNy0xMC4xMjctNC4xOTQtMTMtNy45OTNsMTAuMjMxLTIxLjUyM2E3LjU1IDcuNTUgMCAwIDEgNi44NDgtNC4zNVpNOC43NDkgMjcuNDE0YTcuNTgyIDcuNTgyIDAgMCAxIDkuODc2IDQuMTk1Yy40MDcgMS4wMS45OSAxLjk5OCAxLjcwNyAyLjk0NWwuMDEuMDExLjM0NC40MzZjLjAzMi4wNDIuMDYzLjA3NC4wOTQuMTE2bC4wOTMuMTE0Yy4wNTMuMDUyLjA5NC4xMTUuMTQ2LjE2Ni4wMS4wMS4wMjEuMDIyLjAyMS4wMzJsLS4wMi0uMDMyYy4xOTcuMjQuNDE1LjQ2OC42MzQuNjk5LjAxLjAwOS4wMS4wMi4wMi4wMmEyMC4zMzIgMjAuMzMyIDAgMCAwIDIuMzg1IDIuMTEyYy40MDUuMzEzLjgyMi42MDMgMS4yNDguODk1LjA0Mi4wMjEuMDczLjA1Mi4xMTUuMDc0IDIuNDA0IDEuNTggNS4xNjIgMi43NjcgNy45MSAzLjM1IDEuMTY1LjI1IDIuMzMuMzg2IDMuNDY1LjM5NmguMTQ2YzEuNTA5IDAgMy4wMTgtLjE4OCA0LjQ5NS0uNTQybDYuNTg5IDEzLjg2M2MtMy41NiAxLjE5OC03LjI5NiAxLjg1My0xMS4wODQgMS44NTMtMy40MTQgMC02Ljg2OS0uNTkzLTEwLjIyLTEuNjY1bC0zLjE1NCA2LjYzYTcuNTgzIDcuNTgzIDAgMCAxLTEwLjQxOCAzLjQzNEM5LjUzIDY0LjU5IDguMjA3IDYwLjA1MyA5Ljk2NyA1Ni4zNDhsMy40NTUtNy4yNjRjLTMuOTAzLTMuMy03LjAxNS03LjMwNy04LjgxNS0xMS42NTdsLS4wNTItLjEzNWMtMS41Ni0zLjg4My4zMTItOC4zMDUgNC4xOTQtOS44NzhaIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiLz48cGF0aCBmaWxsPSIjZmZmIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2Utd2lkdGg9IjYuMDIxIiBkPSJNMzcuNDIyIDguNzAyYTcuNTkgNy41OSAwIDAgMSA2Ljg0OCA0LjMzbDEwLjAzMyAyMS4xMDdzMCAuMDEtLjAxMS4wMWMwIDAgMC0uMDExLjAxLS4wMTEgMi4zNTMtMi44ODMgNC4wNi02LjI3NiA0Ljc4OC05LjkxOS44MjItNC4xMSA0LjgxOC02Ljc2NCA4LjkzLTUuOTUyYTcuNTg1IDcuNTg1IDAgMCAxIDUuOTUzIDguOTNjLTEuNjg2IDguNDE5LTYuMzkgMTUuOTQ0LTEyLjc2IDIxLjQ3bDMuNjQzIDcuNjZjMi4wMTkgNC4yNDYtLjA5NCA5LjQ0LTQuNTcgMTAuNzcxbC0uMTM1LjA0M2E3LjUwNiA3LjUwNiAwIDAgMS0yLjAxOS4yOCA3LjU5NSA3LjU5NSAwIDAgMS02Ljg1OC00LjMzbC0zLjIzOC02LjgwNS02LjU4Ny0xMy44NjNoLjAyMi0uMDIybC0zLjIzNy02LjgwN2EuODY1Ljg2NSAwIDAgMC0xLjU2IDBsLTMuMzEgNi45NTJjLTUuMDQ4LTEuMDctMTAuMTI3LTQuMTk0LTEzLTcuOTkzbDEwLjIzMS0yMS41MjNhNy41NSA3LjU1IDAgMCAxIDYuODQ4LTQuMzVoMFpNOC43NDkgMjcuNDE0YTcuNTgyIDcuNTgyIDAgMCAxIDkuODc2IDQuMTk1Yy40MDcgMS4wMS45OSAxLjk5OCAxLjcwNyAyLjk0NWwuMDEuMDExLjM0NC40MzZjLjAzMi4wNDIuMDYzLjA3NC4wOTQuMTE2bC4wOTMuMTE0Yy4wNTMuMDUyLjA5NC4xMTUuMTQ2LjE2Ni4wMS4wMS4wMjEuMDIyLjAyMS4wMzJsLS4wMi0uMDMyYy4xOTcuMjQuNDE1LjQ2OC42MzQuNjk5LjAxLjAwOS4wMS4wMi4wMi4wMmEyMC4zMzIgMjAuMzMyIDAgMCAwIDIuMzg1IDIuMTEyYy40MDUuMzEzLjgyMi42MDMgMS4yNDguODk1LjA0Mi4wMjEuMDczLjA1Mi4xMTUuMDc0IDIuNDA0IDEuNTggNS4xNjIgMi43NjcgNy45MSAzLjM1IDEuMTY1LjI1IDIuMzMuMzg2IDMuNDY1LjM5NmguMTQ2YzEuNTA5IDAgMy4wMTgtLjE4OCA0LjQ5NS0uNTQybDYuNTg5IDEzLjg2M2MtMy41NiAxLjE5OC03LjI5NiAxLjg1My0xMS4wODQgMS44NTMtMy40MTQgMC02Ljg2OS0uNTkzLTEwLjIyLTEuNjY1bC0zLjE1NCA2LjYzYTcuNTgzIDcuNTgzIDAgMCAxLTEwLjQxOCAzLjQzNEM5LjUzIDY0LjU5IDguMjA3IDYwLjA1MyA5Ljk2NyA1Ni4zNDhsMy40NTUtNy4yNjRjLTMuOTAzLTMuMy03LjAxNS03LjMwNy04LjgxNS0xMS42NTdsLS4wNTItLjEzNWMtMS41Ni0zLjg4My4zMTItOC4zMDUgNC4xOTQtOS44NzhoMFoiIGNsaXAtcnVsZT0iZXZlbm9kZCIvPjx1c2UgeGxpbms6aHJlZj0iI2EiIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIi8+PHVzZSB4bGluazpocmVmPSIjYiIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiLz48dXNlIHhsaW5rOmhyZWY9IiNjIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIvPjx1c2UgeGxpbms6aHJlZj0iI2QiIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIi8+PHVzZSB4bGluazpocmVmPSIjZSIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiLz48dXNlIHhsaW5rOmhyZWY9IiNmIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIvPjx1c2UgeGxpbms6aHJlZj0iI2EiIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIi8+PHVzZSB4bGluazpocmVmPSIjYiIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiLz48dXNlIHhsaW5rOmhyZWY9IiNjIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIvPjx1c2UgeGxpbms6aHJlZj0iI2QiIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIi8+PHVzZSB4bGluazpocmVmPSIjZSIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiLz48dXNlIHhsaW5rOmhyZWY9IiNmIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIvPjwvc3ZnPg==";const Et=Object.freeze(Object.defineProperty({__proto__:null,default:et},Symbol.toStringTag,{value:"Module"}));var nt="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCA3OCA3OCI+PHBhdGggZmlsbD0idXJsKCNhKSIgZmlsbC1ydWxlPSJldmVub2RkIiBkPSJtNjcuODEgMTkuNTQgMS42OS00LjJzLTIuMTQtMi4zNS00Ljc1LTVjLTIuNi0yLjY1LTguMS0xLjA5LTguMS0xLjA5TDUwLjM3IDJIMjguMzRsLTYuMjggNy4yNXMtNS41LTEuNTYtOC4xIDEuMWMtMi42IDIuNjQtNC43NSA0Ljk4LTQuNzUgNC45OGwxLjY5IDQuMjEtMi4xNSA2LjI0czYuMyAyNC4zIDcuMDQgMjcuMjhjMS40NiA1Ljg0IDIuNDUgOC4xIDYuNTggMTEuMDZhNTEzLjY2IDUxMy42NiAwIDAgMCAxMi44NSA4Ljg5YzEuMjMuNzggMi43NiAyLjEgNC4xMyAyLjEgMS4zOCAwIDIuOTEtMS4zMiA0LjE0LTIuMSAxLjIyLS43OCA4LjcyLTUuOTIgMTIuODUtOC44OSA0LjEzLTIuOTYgNS4xMi01LjIyIDYuNTgtMTEuMDYuNzQtMi45NyA3LjA0LTI3LjI4IDcuMDQtMjcuMjhsLTIuMTUtNi4yNFoiIGNsaXAtcnVsZT0iZXZlbm9kZCIvPjxwYXRoIGZpbGw9IiNmZmYiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTM5LjM1IDQ3LjVjLjQyIDAgMy4xMS45NyA1LjI3IDIuMSAyLjE1IDEuMTQgMy43MiAxLjk1IDQuMjIgMi4yNi41LjMyLjIuOTItLjI2IDEuMjUtLjQ2LjMzLTYuNTcgNS4xNS03LjE3IDUuNjktLjYuNTMtMS40NiAxLjQxLTIuMDYgMS40MS0uNTkgMC0xLjQ2LS44OC0yLjA1LTEuNDEtLjYtLjU0LTYuNzEtNS4zNi03LjE3LTUuNjktLjQ1LS4zMy0uNzYtLjkzLS4yNi0xLjI1LjUtLjMxIDIuMDctMS4xMiA0LjIyLTIuMjUgMi4xNi0xLjE0IDQuODUtMi4xIDUuMjYtMi4xWm0uMDQtMzQuMzZjLjIuMDEgMS4zNi4wNyAzLjAyLjYzIDEuODQuNjMgMy44MyAxLjQgNC43NSAxLjQuOTIgMCA3LjczLTEuMzIgNy43My0xLjMyczguMDYgOS45NCA4LjA2IDEyLjA2YzAgMi4xMy0xLjAxIDIuNjktMi4wMyAzLjhsLTYuMDUgNi41NGMtLjU3LjYyLTEuNzcgMS41NS0xLjA2IDMuMjQuNyAxLjcgMS43MyAzLjg0LjU4IDYuMDMtMS4xNSAyLjE4LTMuMTIgMy42My00LjM4IDMuNC0xLjI2LS4yNS00LjIzLTEuODMtNS4zMi0yLjU1LTEuMDktLjcyLTQuNTQtMy42Mi00LjU0LTQuNzMgMC0xLjExIDMuNTctMy4xIDQuMjMtMy41Ni42Ni0uNDUgMy42Ny0yLjIgMy43My0yLjkuMDYtLjY5LjA0LS44OS0uODUtMi41OS0uODktMS43LTIuNDktMy45Ny0yLjIyLTUuNDguMjYtMS41MSAyLjg0LTIuMyA0LjY4LTMgMS44NC0uNzEgNS4zOS0yLjA1IDUuODMtMi4yNi40NC0uMi4zMy0uNC0xLjAxLS41M3MtNS4xNS0uNjUtNi44Ni0uMTZjLTEuNzIuNDktNC42NSAxLjIzLTQuODkgMS42Mi0uMjQuNC0uNDUuNC0uMiAxLjc2LjI0IDEuMzYgMS41IDcuODcgMS42MiA5LjAyLjEyIDEuMTYuMzYgMS45Mi0uODcgMi4yLTEuMjIuMy0zLjI4Ljc5LTMuOTkuNzktLjcgMC0yLjc2LS41LTMuOTktLjc4LTEuMjItLjI5LS45OC0xLjA1LS44Ni0yLjIuMTItMS4xNiAxLjM4LTcuNjcgMS42Mi05LjAzLjI1LTEuMzUuMDQtMS4zNy0uMi0xLjc2LS4yNC0uNC0zLjE3LTEuMTMtNC44OS0xLjYyLTEuNzEtLjQ5LTUuNTIuMDMtNi44Ni4xNi0xLjM0LjEzLTEuNDYuMzItMS4wMS41My40NC4yMSAzLjk4IDEuNTUgNS44MyAyLjI2IDEuODQuNyA0LjQyIDEuNDkgNC42OCAzIC4yNyAxLjUxLTEuMzMgMy43OC0yLjIyIDUuNDgtLjg5IDEuNy0uOTEgMS45LS44NSAyLjYuMDYuNjggMy4wNyAyLjQ0IDMuNzMgMi44OS42Ni40NSA0LjIzIDIuNDUgNC4yMyAzLjU2IDAgMS4xLTMuNDUgNC4wMS00LjU0IDQuNzMtMS4xLjcyLTQuMDYgMi4zLTUuMzIgMi41NC0xLjI2LjI0LTMuMjMtMS4yMS00LjM4LTMuNC0xLjE1LTIuMTgtLjEyLTQuMzMuNTgtNi4wMi43LTEuNjktLjQ5LTIuNjItMS4wNi0zLjI0TDE3LjggMjkuN2MtMS4wMi0xLjEtMi4wNC0xLjY2LTIuMDQtMy43OSAwLTIuMTIgOC4wNy0xMi4wNiA4LjA3LTEyLjA2czYuODEgMS4zMyA3LjczIDEuMzNjLjkyIDAgMi45LS43OCA0Ljc0LTEuNGExMS4zIDExLjMgMCAwIDEgMy4wMy0uNjRoLjA3WiIgY2xpcC1ydWxlPSJldmVub2RkIi8+PG1hc2sgaWQ9ImIiIHdpZHRoPSI1MiIgaGVpZ2h0PSIxNCIgeD0iMTMiIHk9IjIiIG1hc2tVbml0cz0idXNlclNwYWNlT25Vc2UiIHN0eWxlPSJtYXNrLXR5cGU6YWxwaGEiPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik01Ni42NCA5LjI1IDUwLjM3IDJIMjguMzRsLTYuMjggNy4yNXMtNS41LTEuNTYtOC4xIDEuMWMwIDAgNy4zNC0uNjggOS44NiAzLjUgMCAwIDYuODEgMS4zMyA3LjczIDEuMzMuOTIgMCAyLjktLjc4IDQuNzQtMS40IDEuODQtLjYzIDMuMDYtLjY0IDMuMDYtLjY0czEuMjMgMCAzLjA2LjYzYzEuODQuNjMgMy44MyAxLjQgNC43NSAxLjQuOTIgMCA3LjczLTEuMzIgNy43My0xLjMyIDIuNTItNC4xOCA5Ljg2LTMuNSA5Ljg2LTMuNS0yLjYtMi42Ni04LjEtMS4xLTguMS0xLjFaIi8+PC9tYXNrPjxnIG1hc2s9InVybCgjYikiPjxwYXRoIGZpbGw9InVybCgjYykiIGQ9Ik01Ni42NCA5LjI1IDUwLjM3IDJIMjguMzRsLTYuMjggNy4yNXMtNS41LTEuNTYtOC4xIDEuMWMwIDAgNy4zNC0uNjggOS44NiAzLjUgMCAwIDYuODEgMS4zMyA3LjczIDEuMzMuOTIgMCAyLjktLjc4IDQuNzQtMS40IDEuODQtLjYzIDMuMDYtLjY0IDMuMDYtLjY0czEuMjMgMCAzLjA2LjYzYzEuODQuNjMgMy44MyAxLjQgNC43NSAxLjQuOTIgMCA3LjczLTEuMzIgNy43My0xLjMyIDIuNTItNC4xOCA5Ljg2LTMuNSA5Ljg2LTMuNS0yLjYtMi42Ni04LjEtMS4xLTguMS0xLjFaIi8+PC9nPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iYSIgeDE9IjguNzUiIHgyPSI2OS45NiIgeTE9IjM5LjA3IiB5Mj0iMzkuMDciIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBzdG9wLWNvbG9yPSIjRjUwIi8+PHN0b3Agb2Zmc2V0PSIuNDEiIHN0b3AtY29sb3I9IiNGNTAiLz48c3RvcCBvZmZzZXQ9Ii41OCIgc3RvcC1jb2xvcj0iI0ZGMjAwMCIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0ZGMjAwMCIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJjIiB4MT0iMTUuMDUiIHgyPSI2NC43NSIgeTE9IjguNjgiIHkyPSI4LjY4IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agc3RvcC1jb2xvcj0iI0ZGNDUyQSIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0ZGMjAwMCIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==";const tt=Object.freeze(Object.defineProperty({__proto__:null,default:nt},Symbol.toStringTag,{value:"Module"}));var it="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCA3OCA3OCI+PHBhdGggZmlsbD0idXJsKCNhKSIgZD0iTTcxLjAzNCAyMC41YTM3LjAwMSAzNy4wMDEgMCAwIDAtNjQuMDg0IDBsMi4yMiAzOS45Nkw3MS4wMzQgMjAuNVoiLz48cGF0aCBmaWxsPSJ1cmwoI2IpIiBkPSJNMjIuOTc5IDQ4LjI1IDYuOTU4IDIwLjVBMzcgMzcgMCAwIDAgMzkgNzZsMzYuMjYtMzctNTIuMjgxIDkuMjVaIi8+PHBhdGggZmlsbD0idXJsKCNjKSIgZD0iTTU1LjAyMSA0OC4yNSAzOSA3NmEzNy4wMDEgMzcuMDAxIDAgMCAwIDMyLjAzNS01NS41SDM5bDE2LjAyMSAyNy43NVoiLz48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMzkgNTcuNWExOC41IDE4LjUgMCAxIDAgMC0zNyAxOC41IDE4LjUgMCAwIDAgMCAzN1oiLz48cGF0aCBmaWxsPSIjMUE3M0U4IiBkPSJNMzkgNTMuNjUyYTE0LjY1IDE0LjY1IDAgMCAwIDEzLjUzNi0yMC4yNkExNC42NTMgMTQuNjUzIDAgMSAwIDM5IDUzLjY1M1oiLz48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImEiIHgxPSI2Ljk1OCIgeDI9IjcxLjAzNCIgeTE9IjI1LjEyNSIgeTI9IjI1LjEyNSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiNEOTMwMjUiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNFQTQzMzUiLz48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCBpZD0iYiIgeDE9IjQzLjAwMyIgeDI9IjEwLjk2MSIgeTE9IjczLjY4NCIgeTI9IjE4LjE4NCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiMxRThFM0UiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMzNEE4NTMiLz48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCBpZD0iYyIgeDE9IjMzLjU5OCIgeDI9IjY1LjY0IiB5MT0iNzYiIHkyPSIyMC41OTYiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBzdG9wLWNvbG9yPSIjRkNDOTM0Ii8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjRkJCQzA0Ii8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PC9zdmc+";const at=Object.freeze(Object.defineProperty({__proto__:null,default:it},Symbol.toStringTag,{value:"Module"}));var lt="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCA3OCA3OCI+PGcgY2xpcC1wYXRoPSJ1cmwoI2EpIj48cGF0aCBmaWxsPSJ1cmwoI2IpIiBkPSJNNjguODAyIDU3LjA2NmMtLjk5Mi41MTYtMi4wMTYuOTctMy4wNjQgMS4zNTlhMjkuNDU2IDI5LjQ1NiAwIDAgMS0xMC4zNzcgMS44NWMtMTMuNjczIDAtMjUuNTgyLTkuMzk1LTI1LjU4Mi0yMS40NzdhOS4xMDYgOS4xMDYgMCAwIDEgNC43NC03Ljg5MmMtMTIuMzcxLjUyLTE1LjU1MSAxMy40MTMtMTUuNTUxIDIwLjk1NyAwIDIxLjM5IDE5LjY4NSAyMy41MyAyMy45MzQgMjMuNTMgMi4yODQgMCA1LjcyNC0uNjY1IDcuODA1LTEuMzNsLjM3Ni0uMTE1YTM3LjA4OCAzNy4wODggMCAwIDAgMTkuMjUxLTE1LjI2MyAxLjE1NiAxLjE1NiAwIDAgMC0xLjUzMi0xLjYxOVoiLz48cGF0aCBmaWxsPSJ1cmwoI2MpIiBkPSJNNjguODAyIDU3LjA2NmMtLjk5Mi41MTYtMi4wMTYuOTctMy4wNjQgMS4zNTlhMjkuNDU2IDI5LjQ1NiAwIDAgMS0xMC4zNzcgMS44NWMtMTMuNjczIDAtMjUuNTgyLTkuMzk1LTI1LjU4Mi0yMS40NzdhOS4xMDYgOS4xMDYgMCAwIDEgNC43NC03Ljg5MmMtMTIuMzcxLjUyLTE1LjU1MSAxMy40MTMtMTUuNTUxIDIwLjk1NyAwIDIxLjM5IDE5LjY4NSAyMy41MyAyMy45MzQgMjMuNTMgMi4yODQgMCA1LjcyNC0uNjY1IDcuODA1LTEuMzNsLjM3Ni0uMTE1YTM3LjA4OCAzNy4wODggMCAwIDAgMTkuMjUxLTE1LjI2MyAxLjE1NiAxLjE1NiAwIDAgMC0xLjUzMi0xLjYxOVoiIG9wYWNpdHk9Ii4zNSIvPjxwYXRoIGZpbGw9InVybCgjZCkiIGQ9Ik0zMi41NTQgNzEuNzUxYTIyLjg5NCAyMi44OTQgMCAwIDEtNi41NjItNi4xNTcgMjMuMzI5IDIzLjMyOSAwIDAgMSA4LjUyNy0zNC42ODdjLjkyNS0uNDM0IDIuNDU4LTEuMTg2IDQuNTEtMS4xNTdhOS4zNjUgOS4zNjUgMCAwIDEgNy40MjkgMy43NTggOS4yMjIgOS4yMjIgMCAwIDEgMS44MiA1LjQwNmMwLS4wNTggNy4wODMtMjMuMDEtMjMuMTI0LTIzLjAxLTEyLjY5IDAtMjMuMTI1IDEyLjAyNS0yMy4xMjUgMjIuNjA1YTM3LjYzNiAzNy42MzYgMCAwIDAgMy40OTggMTYuMTg4IDM3IDM3IDAgMCAwIDQ1LjIwOSAxOS4zNjcgMjEuODI1IDIxLjgyNSAwIDAgMS0xOC4xNTMtMi4zMTNoLS4wM1oiLz48cGF0aCBmaWxsPSJ1cmwoI2UpIiBkPSJNMzIuNTU0IDcxLjc1MWEyMi44OTQgMjIuODk0IDAgMCAxLTYuNTYyLTYuMTU3IDIzLjMyOSAyMy4zMjkgMCAwIDEgOC41MjctMzQuNjg3Yy45MjUtLjQzNCAyLjQ1OC0xLjE4NiA0LjUxLTEuMTU3YTkuMzY1IDkuMzY1IDAgMCAxIDcuNDI5IDMuNzU4IDkuMjIyIDkuMjIyIDAgMCAxIDEuODIgNS40MDZjMC0uMDU4IDcuMDgzLTIzLjAxLTIzLjEyNC0yMy4wMS0xMi42OSAwLTIzLjEyNSAxMi4wMjUtMjMuMTI1IDIyLjYwNWEzNy42MzYgMzcuNjM2IDAgMCAwIDMuNDk4IDE2LjE4OCAzNyAzNyAwIDAgMCA0NS4yMDkgMTkuMzY3IDIxLjgyNSAyMS44MjUgMCAwIDEtMTguMTUzLTIuMzEzaC0uMDNaIiBvcGFjaXR5PSIuNDEiLz48cGF0aCBmaWxsPSJ1cmwoI2YpIiBkPSJNNDYuMDUzIDQ1LjAxM2MtLjI2LjI4OS0uOTgzLjcyMi0uOTgzIDEuNjE4IDAgLjc1Mi40OTIgMS41MDMgMS4zODggMi4xMSA0LjEzMyAyLjg5MSAxMS45NjcgMi40ODYgMTEuOTk2IDIuNDg2YTE3LjIyNyAxNy4yMjcgMCAwIDAgOC43NTktMi4zOTlBMTcuNzQ4IDE3Ljc0OCAwIDAgMCA3NiAzMy41MzdjLjA4Ny02LjQ3NS0yLjMxMy0xMC43ODItMy4yNjYtMTIuNjlDNjYuNTc3IDguODggNTMuMzY2IDIgMzkgMkEzNyAzNyAwIDAgMCAyIDM4LjQ4Yy4xNDUtMTAuNTUxIDEwLjYzNy0xOS4wNzggMjMuMTI1LTE5LjA3OCAxLjAxMiAwIDYuNzkzLjA4NiAxMi4xNCAyLjg5YTIwLjk4NiAyMC45ODYgMCAwIDEgOC45MzMgOC40N2MxLjc2MyAzLjA2NCAyLjA4IDYuOTY2IDIuMDggOC41MjcgMCAxLjU2MS0uNzggMy44NDUtMi4yNTQgNS43NTJsLjAzLS4wMjhaIi8+PHBhdGggZmlsbD0idXJsKCNnKSIgZD0iTTQ2LjA1MyA0NS4wMTNjLS4yNi4yODktLjk4My43MjItLjk4MyAxLjYxOCAwIC43NTIuNDkyIDEuNTAzIDEuMzg4IDIuMTEgNC4xMzMgMi44OTEgMTEuOTY3IDIuNDg2IDExLjk5NiAyLjQ4NmExNy4yMjcgMTcuMjI3IDAgMCAwIDguNzU5LTIuMzk5QTE3Ljc0OCAxNy43NDggMCAwIDAgNzYgMzMuNTM3Yy4wODctNi40NzUtMi4zMTMtMTAuNzgyLTMuMjY2LTEyLjY5QzY2LjU3NyA4Ljg4IDUzLjM2NiAyIDM5IDJBMzcgMzcgMCAwIDAgMiAzOC40OGMuMTQ1LTEwLjU1MSAxMC42MzctMTkuMDc4IDIzLjEyNS0xOS4wNzggMS4wMTIgMCA2Ljc5My4wODYgMTIuMTQgMi44OWEyMC45ODYgMjAuOTg2IDAgMCAxIDguOTMzIDguNDdjMS43NjMgMy4wNjQgMi4wOCA2Ljk2NiAyLjA4IDguNTI3IDAgMS41NjEtLjc4IDMuODQ1LTIuMjU0IDUuNzUybC4wMy0uMDI4WiIvPjwvZz48ZGVmcz48cmFkaWFsR3JhZGllbnQgaWQ9ImMiIGN4PSIwIiBjeT0iMCIgcj0iMSIgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgyNy41NzY2IDAgMCAyNi4xOTc3IDQ3LjQ0IDUzLjU1MykiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBvZmZzZXQ9Ii43IiBzdG9wLW9wYWNpdHk9IjAiLz48c3RvcCBvZmZzZXQ9Ii45IiBzdG9wLW9wYWNpdHk9Ii41Ii8+PHN0b3Agb2Zmc2V0PSIxIi8+PC9yYWRpYWxHcmFkaWVudD48cmFkaWFsR3JhZGllbnQgaWQ9ImUiIGN4PSIwIiBjeT0iMCIgcj0iMSIgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCg2LjIwOTAyIC00MC45Nzk4IDMzLjEwNzU0IDUuMDE2MjcgMjIuMzk1IDU5LjUwNikiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBvZmZzZXQ9Ii44IiBzdG9wLW9wYWNpdHk9IjAiLz48c3RvcCBvZmZzZXQ9Ii45IiBzdG9wLW9wYWNpdHk9Ii41Ii8+PHN0b3Agb2Zmc2V0PSIxIi8+PC9yYWRpYWxHcmFkaWVudD48cmFkaWFsR3JhZGllbnQgaWQ9ImYiIGN4PSIwIiBjeT0iMCIgcj0iMSIgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgtMi4zNDAyNCA1OC41MDYyMSAtMTI0LjYwNjM2IC00Ljk4NDIzIDkuNDg0IDE1LjY3NykiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBzdG9wLWNvbG9yPSIjMzVDMUYxIi8+PHN0b3Agb2Zmc2V0PSIuMSIgc3RvcC1jb2xvcj0iIzM0QzFFRCIvPjxzdG9wIG9mZnNldD0iLjIiIHN0b3AtY29sb3I9IiMyRkMyREYiLz48c3RvcCBvZmZzZXQ9Ii4zIiBzdG9wLWNvbG9yPSIjMkJDM0QyIi8+PHN0b3Agb2Zmc2V0PSIuNyIgc3RvcC1jb2xvcj0iIzM2Qzc1MiIvPjwvcmFkaWFsR3JhZGllbnQ+PHJhZGlhbEdyYWRpZW50IGlkPSJnIiBjeD0iMCIgY3k9IjAiIHI9IjEiIGdyYWRpZW50VHJhbnNmb3JtPSJyb3RhdGUoNzMuNzQgMTkuNDY3IDU5Ljc2Nykgc2NhbGUoMjguMTI1OCAyMi44NzE5KSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM2NkVCNkUiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM2NkVCNkUiIHN0b3Atb3BhY2l0eT0iMCIvPjwvcmFkaWFsR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJiIiB4MT0iMTguOTY4IiB4Mj0iNzAuNTM3IiB5MT0iNTMuMTY0IiB5Mj0iNTMuMTY0IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agc3RvcC1jb2xvcj0iIzBDNTlBNCIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzExNEE4QiIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJkIiB4MT0iNDYuMTQiIHgyPSIxMy45NjciIHkxPSIzMC43OTEiIHkyPSI2NS44NTQiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBzdG9wLWNvbG9yPSIjMUI5REUyIi8+PHN0b3Agb2Zmc2V0PSIuMiIgc3RvcC1jb2xvcj0iIzE1OTVERiIvPjxzdG9wIG9mZnNldD0iLjciIHN0b3AtY29sb3I9IiMwNjgwRDciLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMwMDc4RDQiLz48L2xpbmVhckdyYWRpZW50PjxjbGlwUGF0aCBpZD0iYSI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTAgMGg3NHY3NEgweiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMiAyKSIvPjwvY2xpcFBhdGg+PC9kZWZzPjwvc3ZnPg==";const ot=Object.freeze(Object.defineProperty({__proto__:null,default:lt},Symbol.toStringTag,{value:"Module"}));var Ct="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCA3OCA3OCI+PGcgY2xpcC1wYXRoPSJ1cmwoI2EpIj48cGF0aCBmaWxsPSJ1cmwoI2IpIiBkPSJNNzIuMDQ5IDI2LjgyN2MtMS41NTktMy43NS00LjcyLTcuNzk4LTcuMTk1LTkuMDc4YTM3LjI2NCAzNy4yNjQgMCAwIDEgMy42MzIgMTAuODgzbC4wMDcuMDZjLTQuMDU1LTEwLjEwNS0xMC45MjktMTQuMTg2LTE2LjU0Ni0yMy4wNmE0My4zOSA0My4zOSAwIDAgMS0uODQ1LTEuMzczIDExLjMzNyAxMS4zMzcgMCAwIDEtLjM5NS0uNzQgNi41MjUgNi41MjUgMCAwIDEtLjUzNS0xLjQyLjA5Mi4wOTIgMCAwIDAtLjA4LS4wOTMuMTI4LjEyOCAwIDAgMC0uMDY5IDBjLS4wMDQgMC0uMDEyLjAwOC0uMDE3LjAxLS4wMDYuMDAyLS4wMTguMDEtLjAyNi4wMTRsLjAxNC0uMDI0QzQwLjk4NiA3LjI4IDM3LjkyNyAxNy4wNDIgMzcuNjUgMjEuOTI4YTE3Ljk0NCAxNy45NDQgMCAwIDAtOS44NzQgMy44MDRjLS4yOTUtLjI1LS42MDQtLjQ4NC0uOTI1LS43MDFhMTYuNjI5IDE2LjYyOSAwIDAgMS0uMS04Ljc2NiAyNi41NTggMjYuNTU4IDAgMCAwLTguNjM0IDYuNjcyaC0uMDE2Yy0xLjQyMS0xLjgwMi0xLjMyMi03Ljc0My0xLjI0LTguOTgzYTYuNDQgNi40NCAwIDAgMC0xLjE5Ny42MzUgMjYuMTE5IDI2LjExOSAwIDAgMC0zLjUwNiAzLjAwMyAzMS4zMTIgMzEuMzEyIDAgMCAwLTMuMzUyIDQuMDIzdi4wMDUtLjAwNmEzMC4yODcgMzAuMjg3IDAgMCAwLTQuODEyIDEwLjg2M2wtLjA0OC4yMzdhNTcuMDU4IDU3LjA1OCAwIDAgMC0uMzUzIDIuMjRjMCAuMDI2LS4wMDUuMDUxLS4wMDguMDc4YTM0LjE4MyAzNC4xODMgMCAwIDAtLjU4MiA0Ljk0NHYuMTg1YTM1Ljg2NyAzNS44NjcgMCAwIDAgNzEuMjA1IDYuMDY1Yy4wNi0uNDYzLjExLS45Mi4xNjMtMS4zODhhMzYuODgzIDM2Ljg4MyAwIDAgMC0yLjMyNi0xOC4wMTdsLjAwNC4wMDZaTTMwLjcxMyA1NC45MDJjLjE2OC4wOC4zMjUuMTY3LjQ5Ny4yNDRsLjAyNS4wMTZjLS4xNzQtLjA4My0uMzQ4LS4xNy0uNTIyLS4yNlptMzcuNzgtMjYuMnYtLjAzNGwuMDA3LjAzOC0uMDA3LS4wMDRaIi8+PHBhdGggZmlsbD0idXJsKCNjKSIgZD0iTTcyLjA1IDI2LjgyOGMtMS41NTgtMy43NS00LjcyLTcuNzk4LTcuMTk1LTkuMDc4YTM3LjI2MSAzNy4yNjEgMCAwIDEgMy42MzIgMTAuODgydi4wMzRsLjAwNy4wMzhhMzIuNDggMzIuNDggMCAwIDEtMS4xMTYgMjQuMjA3Yy00LjExIDguODItMTQuMDU2IDE3Ljg2LTI5LjYzIDE3LjQxNUMyMC45MjYgNjkuODUgNi4xMDEgNTcuMzYyIDMuMzM1IDQxLjAxMWMtLjUwNS0yLjU3OSAwLTMuODg2LjI1My01Ljk4MmEyNi43MjMgMjYuNzIzIDAgMCAwLS41NzYgNC45NDl2LjE4NWEzNS44NjcgMzUuODY3IDAgMCAwIDcxLjIwNSA2LjA2NWMuMDYtLjQ2My4xMS0uOTIxLjE2My0xLjM4OWEzNi44ODQgMzYuODg0IDAgMCAwLTIuMzI2LTE4LjAxNmwtLjAwNC4wMDVaIi8+PHBhdGggZmlsbD0idXJsKCNkKSIgZD0iTTcyLjA1IDI2LjgyOGMtMS41NTgtMy43NS00LjcyLTcuNzk4LTcuMTk1LTkuMDc4YTM3LjI2MSAzNy4yNjEgMCAwIDEgMy42MzIgMTAuODgydi4wMzRsLjAwNy4wMzhhMzIuNDggMzIuNDggMCAwIDEtMS4xMTYgMjQuMjA3Yy00LjExIDguODItMTQuMDU2IDE3Ljg2LTI5LjYzIDE3LjQxNUMyMC45MjYgNjkuODUgNi4xMDEgNTcuMzYyIDMuMzM1IDQxLjAxMWMtLjUwNS0yLjU3OSAwLTMuODg2LjI1My01Ljk4MmEyNi43MjMgMjYuNzIzIDAgMCAwLS41NzYgNC45NDl2LjE4NWEzNS44NjcgMzUuODY3IDAgMCAwIDcxLjIwNSA2LjA2NWMuMDYtLjQ2My4xMS0uOTIxLjE2My0xLjM4OWEzNi44ODQgMzYuODg0IDAgMCAwLTIuMzI2LTE4LjAxNmwtLjAwNC4wMDVaIi8+PHBhdGggZmlsbD0idXJsKCNlKSIgZD0iTTU0LjYxNSAzMS4wMzdjLjA3OC4wNTUuMTUuMTEuMjIzLjE2NGExOS41MjUgMTkuNTI1IDAgMCAwLTMuMzMtNC4zNDRjLTExLjE1MS0xMS4xNS0yLjkyMi0yNC4xNy0xLjUzNS0yNC44MzdsLjAxNC0uMDJDNDAuOTc4IDcuMjc0IDM3LjkyIDE3LjAzNyAzNy42NDMgMjEuOTIzYy40MTgtLjAyOS44MzItLjA2NCAxLjI2LS4wNjRhMTguMSAxOC4xIDAgMCAxIDE1LjcxMiA5LjE3NnYuMDAyWiIvPjxwYXRoIGZpbGw9InVybCgjZikiIGQ9Ik0zOC45MjMgMzMuMjY4Yy0uMDYuODkyLTMuMjExIDMuOTY5LTQuMzEzIDMuOTY5LTEwLjE5OCAwLTExLjg1NCA2LjE2OS0xMS44NTQgNi4xNjkuNDUxIDUuMTk1IDQuMDcxIDkuNDc2IDguNDQ3IDExLjczMy4yLjEwNC40MDMuMTk3LjYwNS4yOS4zNTIuMTU0LjcwMy4yOTggMS4wNTQuNDNhMTUuOTEgMTUuOTEgMCAwIDAgNC42NjYuOWMxNy44NzguODM5IDIxLjMzOS0yMS4zNzUgOC40MzgtMjcuODI1YTEyLjM4MSAxMi4zODEgMCAwIDEgOC42NDggMi4xQTE4LjEgMTguMSAwIDAgMCAzOC45IDIxLjg1N2MtLjQyNSAwLS44NDIuMDM2LTEuMjYuMDY0YTE3Ljk0MyAxNy45NDMgMCAwIDAtOS44NzMgMy44MDRjLjU0Ni40NjMgMS4xNjQgMS4wODEgMi40NjQgMi4zNjMgMi40MzMgMi4zOTcgOC42NzUgNC44ODEgOC42ODkgNS4xNzJsLjAwMi4wMDhaIi8+PHBhdGggZmlsbD0idXJsKCNnKSIgZD0iTTM4LjkyMyAzMy4yNjhjLS4wNi44OTItMy4yMTEgMy45NjktNC4zMTMgMy45NjktMTAuMTk4IDAtMTEuODU0IDYuMTY5LTExLjg1NCA2LjE2OS40NTEgNS4xOTUgNC4wNzEgOS40NzYgOC40NDcgMTEuNzMzLjIuMTA0LjQwMy4xOTcuNjA1LjI5LjM1Mi4xNTQuNzAzLjI5OCAxLjA1NC40M2ExNS45MSAxNS45MSAwIDAgMCA0LjY2Ni45YzE3Ljg3OC44MzkgMjEuMzM5LTIxLjM3NSA4LjQzOC0yNy44MjVhMTIuMzgxIDEyLjM4MSAwIDAgMSA4LjY0OCAyLjFBMTguMSAxOC4xIDAgMCAwIDM4LjkgMjEuODU3Yy0uNDI1IDAtLjg0Mi4wMzYtMS4yNi4wNjRhMTcuOTQzIDE3Ljk0MyAwIDAgMC05Ljg3MyAzLjgwNGMuNTQ2LjQ2MyAxLjE2NCAxLjA4MSAyLjQ2NCAyLjM2MyAyLjQzMyAyLjM5NyA4LjY3NSA0Ljg4MSA4LjY4OSA1LjE3MmwuMDAyLjAwOFoiLz48cGF0aCBmaWxsPSJ1cmwoI2gpIiBkPSJNMjYuMDk3IDI0LjU0MmMuMjkuMTg1LjUzLjM0Ni43NC40OTFhMTYuNjI4IDE2LjYyOCAwIDAgMS0uMS04Ljc2NSAyNi41NTcgMjYuNTU3IDAgMCAwLTguNjMzIDYuNjcxYy4xNzQtLjAwNCA1LjM3Ny0uMDk4IDcuOTkzIDEuNjAzWiIvPjxwYXRoIGZpbGw9InVybCgjaSkiIGQ9Ik0zLjMyNyA0MS4wMTNjMi43NjggMTYuMzUgMTcuNTkgMjguODQzIDM0LjQxNCAyOS4zMTUgMTUuNTczLjQ0IDI1LjUyLTguNiAyOS42My0xNy40MTVhMzIuNDggMzIuNDggMCAwIDAgMS4xMTUtMjQuMjA3di0uMDM0YzAtLjAyNy0uMDA1LS4wNDMgMC0uMDM1bC4wMDcuMDZjMS4yNzIgOC4zMDctMi45NTMgMTYuMzUxLTkuNTYgMjEuODAybC0uMDIuMDQ2Yy0xMi44NzEgMTAuNDg0LTI1LjE4OCA2LjMyNC0yNy42NzcgNC42MjctLjE3NC0uMDg0LS4zNDgtLjE3LS41MjItLjI2LTcuNTAzLTMuNTg3LTEwLjYwNC0xMC40Mi05LjkzOC0xNi4yODZhOS4yMSA5LjIxIDAgMCAxLTguNDk1LTUuMzQ0IDEzLjUyOCAxMy41MjggMCAwIDEgMTMuMTg2LS41MyAxNy44NiAxNy44NiAwIDAgMCAxMy40NjQuNTNjLS4wMTQtLjI5Mi02LjI1Ni0yLjc3Ni04LjY5LTUuMTczLTEuMy0xLjI4Mi0xLjkxNy0xLjg5OS0yLjQ2NC0yLjM2My0uMjk1LS4yNS0uNjA0LS40ODQtLjkyNS0uNy0uMjEzLS4xNDYtLjQ1My0uMzAzLS43NC0uNDkyLTIuNjE2LTEuNzAxLTcuODE4LTEuNjA4LTcuOTktMS42MDNoLS4wMTdjLTEuNDIyLTEuODAyLTEuMzIyLTcuNzQyLTEuMjQtOC45ODMtLjQyLjE2OS0uODIyLjM4Mi0xLjE5OC42MzZhMjYuMTA1IDI2LjEwNSAwIDAgMC0zLjUwNSAzLjAwMiAzMS4zMTUgMzEuMzE1IDAgMCAwLTMuMzY2IDQuMDEzdi4wMDYtLjAwNmEzMC4yODcgMzAuMjg3IDAgMCAwLTQuODEyIDEwLjg2M2MtLjAxOC4wNzMtMS4yOTIgNS42NDQtLjY2NCA4LjUzM2wuMDA3LS4wMDJaIi8+PHBhdGggZmlsbD0idXJsKCNqKSIgZD0iTTUxLjUwNyAyNi44NTVhMTkuNTI3IDE5LjUyNyAwIDAgMSAzLjMzIDQuMzQ5Yy4xOTguMTQ5LjM4Mi4yOTcuNTM4LjQ0IDguMTMyIDcuNDk2IDMuODcxIDE4LjA5IDMuNTU0IDE4Ljg0IDYuNjA1LTUuNDQyIDEwLjgyNi0xMy40OTEgOS41NTktMjEuOEM2NC40MyAxOC41NjggNTcuNTUgMTQuNDg3IDUxLjk0MiA1LjYxM2E0My40MDEgNDMuNDAxIDAgMCAxLS44NDQtMS4zNzMgMTEuMjkgMTEuMjkgMCAwIDEtLjM5Ni0uNzQgNi41MjUgNi41MjUgMCAwIDEtLjUzNC0xLjQyLjA5My4wOTMgMCAwIDAtLjA4Mi0uMDkzLjEyNy4xMjcgMCAwIDAtLjA2NyAwYy0uMDA1IDAtLjAxMi4wMDgtLjAxOC4wMWwtLjAyNi4wMTRjLTEuMzg3LjY1OC05LjYxNCAxMy42ODYgMS41MzYgMjQuODI3bC0uMDA0LjAxNloiLz48cGF0aCBmaWxsPSJ1cmwoI2spIiBkPSJNNTUuMzc1IDMxLjY1YTcuNDk1IDcuNDk1IDAgMCAwLS41MzgtLjQ0MWMtLjA3My0uMDU1LS4xNDUtLjExLS4yMjMtLjE2NGExMi4zODIgMTIuMzgyIDAgMCAwLTguNjQ3LTIuMWMxMi45IDYuNDUgOS40MzkgMjguNjU4LTguNDM4IDI3LjgyNWExNS45NSAxNS45NSAwIDAgMS00LjY2Ny0uOSAxOC44ODUgMTguODg1IDAgMCAxLTEuMDUzLS40MzEgMTMuMjQ4IDEzLjI0OCAwIDAgMS0uNjA1LS4yODlsLjAyNS4wMTZjMi40OTMgMS43MDIgMTQuODA2IDUuODYgMjcuNjc3LTQuNjI3bC4wMi0uMDQ2Yy4zMjItLjc1IDQuNTgyLTExLjM0NS0zLjU1My0xOC44NGwuMDAyLS4wMDRaIi8+PHBhdGggZmlsbD0idXJsKCNsKSIgZD0iTTIyLjc1NiA0My40czEuNjU1LTYuMTcgMTEuODUzLTYuMTdjMS4xMDIgMCA0LjI1Ny0zLjA3NiA0LjMxMy0zLjk2OGExNy44NiAxNy44NiAwIDAgMS0xMy40NjMtLjUzIDEzLjUyOSAxMy41MjkgMCAwIDAtMTMuMTg2LjUzIDkuMjEgOS4yMSAwIDAgMCA4LjQ5NSA1LjM0NGMtLjY2NCA1Ljg2NCAyLjQzNiAxMi42OTYgOS45MzggMTYuMjg2LjE2OC4wOC4zMjUuMTY3LjQ5Ny4yNDQtNC4zOC0yLjI2Mi03Ljk5Ni02LjU0MS04LjQ0Ny0xMS43MzNWNDMuNFoiLz48cGF0aCBmaWxsPSJ1cmwoI20pIiBkPSJNNzIuMDQ5IDI2LjgyN2MtMS41NTktMy43NS00LjcyLTcuNzk4LTcuMTk1LTkuMDc4YTM3LjI2MSAzNy4yNjEgMCAwIDEgMy42MzIgMTAuODgzbC4wMDcuMDZjLTQuMDU1LTEwLjEwNS0xMC45MjktMTQuMTg2LTE2LjU0Ni0yMy4wNmE0My4zOSA0My4zOSAwIDAgMS0uODQ0LTEuMzczIDExLjMzNyAxMS4zMzcgMCAwIDEtLjM5Ni0uNzQgNi41MjUgNi41MjUgMCAwIDEtLjUzNC0xLjQyLjA5Mi4wOTIgMCAwIDAtLjA4Mi0uMDkzLjEyOC4xMjggMCAwIDAtLjA2NyAwYy0uMDA1IDAtLjAxMi4wMDgtLjAxOC4wMWwtLjAyNi4wMTQuMDE0LS4wMjRDNDAuOTg2IDcuMjggMzcuOTI4IDE3LjA0MiAzNy42NSAyMS45MjhjLjQxOC0uMDI4LjgzMy0uMDY0IDEuMjYtLjA2NGExOC4xIDE4LjEgMCAwIDEgMTUuNzEzIDkuMTc3IDEyLjM4IDEyLjM4IDAgMCAwLTguNjQ4LTIuMWMxMi45IDYuNDUgOS40MzkgMjguNjU4LTguNDM4IDI3LjgyNmExNS45NTIgMTUuOTUyIDAgMCAxLTQuNjY2LS45IDE4LjkzMyAxOC45MzMgMCAwIDEtMS4wNTQtLjQzMmMtLjIwMi0uMDkzLS40MDUtLjE4NS0uNjA1LS4yODlsLjAyNS4wMTZhMTkuMDQgMTkuMDQgMCAwIDEtLjUyMi0uMjZjLjE2OC4wOC4zMjUuMTY3LjQ5Ny4yNDQtNC4zOC0yLjI2My03Ljk5Ni02LjU0Mi04LjQ0Ny0xMS43MzMgMCAwIDEuNjU1LTYuMTcgMTEuODUzLTYuMTcgMS4xMDIgMCA0LjI1Ny0zLjA3NiA0LjMxMy0zLjk2OC0uMDEzLS4yOTItNi4yNTUtMi43NzYtOC42ODgtNS4xNzMtMS4zLTEuMjgxLTEuOTE4LTEuODk5LTIuNDY1LTIuMzYyLS4yOTUtLjI1LS42MDQtLjQ4NS0uOTI1LS43MDJhMTYuNjI4IDE2LjYyOCAwIDAgMS0uMS04Ljc2NSAyNi41NTcgMjYuNTU3IDAgMCAwLTguNjM0IDYuNjcxaC0uMDE2Yy0xLjQyMi0xLjgwMS0xLjMyMi03Ljc0Mi0xLjI0LTguOTgzLS40Mi4xNjktLjgyMi4zODItMS4xOTcuNjM2YTI2LjExMiAyNi4xMTIgMCAwIDAtMy41MDYgMy4wMDIgMzEuMzA0IDMxLjMwNCAwIDAgMC0zLjM1MiA0LjAyM3YuMDA2LS4wMDdhMzAuMjg3IDMwLjI4NyAwIDAgMC00LjgxMiAxMC44NjRsLS4wNDguMjM2Yy0uMDY4LjMxNi0uMzcgMS45MTktLjQxNCAyLjI2M2E0MS43MjQgNDEuNzI0IDAgMCAwLS41MyA1di4xODVhMzUuODY2IDM1Ljg2NiAwIDAgMCA3MS4yMDYgNi4wNjRjLjA2LS40NjIuMTEtLjkyLjE2My0xLjM4OGEzNi44ODUgMzYuODg1IDAgMCAwLTIuMzI2LTE4LjAxNmwuMDAyLS4wMDJabS0zLjU1OCAxLjg0Mi4wMDYuMDM4LS4wMDYtLjAzOFoiLz48L2c+PGRlZnM+PHJhZGlhbEdyYWRpZW50IGlkPSJjIiBjeD0iMCIgY3k9IjAiIHI9IjEiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoNjQuOTk5IDEwLjMyOSkgc2NhbGUoNzQuNzY4KSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIG9mZnNldD0iLjEyOSIgc3RvcC1jb2xvcj0iI0ZGQkQ0RiIvPjxzdG9wIG9mZnNldD0iLjE4NiIgc3RvcC1jb2xvcj0iI0ZGQUMzMSIvPjxzdG9wIG9mZnNldD0iLjI0NyIgc3RvcC1jb2xvcj0iI0ZGOUQxNyIvPjxzdG9wIG9mZnNldD0iLjI4MyIgc3RvcC1jb2xvcj0iI0ZGOTgwRSIvPjxzdG9wIG9mZnNldD0iLjQwMyIgc3RvcC1jb2xvcj0iI0ZGNTYzQiIvPjxzdG9wIG9mZnNldD0iLjQ2NyIgc3RvcC1jb2xvcj0iI0ZGMzc1MCIvPjxzdG9wIG9mZnNldD0iLjcxIiBzdG9wLWNvbG9yPSIjRjUxNTZDIi8+PHN0b3Agb2Zmc2V0PSIuNzgyIiBzdG9wLWNvbG9yPSIjRUIwODc4Ii8+PHN0b3Agb2Zmc2V0PSIuODYiIHN0b3AtY29sb3I9IiNFNTAwODAiLz48L3JhZGlhbEdyYWRpZW50PjxyYWRpYWxHcmFkaWVudCBpZD0iZCIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKDM3LjIzOSA0MC44NjUpIHNjYWxlKDc0Ljc2OCkiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBvZmZzZXQ9Ii4zIiBzdG9wLWNvbG9yPSIjOTYwRTE4Ii8+PHN0b3Agb2Zmc2V0PSIuMzUxIiBzdG9wLWNvbG9yPSIjQjExOTI3IiBzdG9wLW9wYWNpdHk9Ii43NCIvPjxzdG9wIG9mZnNldD0iLjQzNSIgc3RvcC1jb2xvcj0iI0RCMjkzRCIgc3RvcC1vcGFjaXR5PSIuMzQzIi8+PHN0b3Agb2Zmc2V0PSIuNDk3IiBzdG9wLWNvbG9yPSIjRjUzMzRCIiBzdG9wLW9wYWNpdHk9Ii4wOTQiLz48c3RvcCBvZmZzZXQ9Ii41MyIgc3RvcC1jb2xvcj0iI0ZGMzc1MCIgc3RvcC1vcGFjaXR5PSIwIi8+PC9yYWRpYWxHcmFkaWVudD48cmFkaWFsR3JhZGllbnQgaWQ9ImUiIGN4PSIwIiBjeT0iMCIgcj0iMSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSg0Ni40OSAtNi4zMjgpIHNjYWxlKDU0LjE2MDYpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agb2Zmc2V0PSIuMTMyIiBzdG9wLWNvbG9yPSIjRkZGNDRGIi8+PHN0b3Agb2Zmc2V0PSIuMjUyIiBzdG9wLWNvbG9yPSIjRkZEQzNFIi8+PHN0b3Agb2Zmc2V0PSIuNTA2IiBzdG9wLWNvbG9yPSIjRkY5RDEyIi8+PHN0b3Agb2Zmc2V0PSIuNTI2IiBzdG9wLWNvbG9yPSIjRkY5ODBFIi8+PC9yYWRpYWxHcmFkaWVudD48cmFkaWFsR3JhZGllbnQgaWQ9ImYiIGN4PSIwIiBjeT0iMCIgcj0iMSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgyOC45MSA2MC4yOTcpIHNjYWxlKDM1LjU5ODEpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agb2Zmc2V0PSIuMzUzIiBzdG9wLWNvbG9yPSIjM0E4RUU2Ii8+PHN0b3Agb2Zmc2V0PSIuNDcyIiBzdG9wLWNvbG9yPSIjNUM3OUYwIi8+PHN0b3Agb2Zmc2V0PSIuNjY5IiBzdG9wLWNvbG9yPSIjOTA1OUZGIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjQzEzOUU2Ii8+PC9yYWRpYWxHcmFkaWVudD48cmFkaWFsR3JhZGllbnQgaWQ9ImciIGN4PSIwIiBjeT0iMCIgcj0iMSIgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgxOC4zNDg1MiAtNC40MzYyNiA1LjE5Mzc0IDIxLjQ4MTQ1IDQwLjg1NiAzNC40NDgpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agb2Zmc2V0PSIuMjA2IiBzdG9wLWNvbG9yPSIjOTA1OUZGIiBzdG9wLW9wYWNpdHk9IjAiLz48c3RvcCBvZmZzZXQ9Ii4yNzgiIHN0b3AtY29sb3I9IiM4QzRGRjMiIHN0b3Atb3BhY2l0eT0iLjA2NCIvPjxzdG9wIG9mZnNldD0iLjc0NyIgc3RvcC1jb2xvcj0iIzc3MTZBOCIgc3RvcC1vcGFjaXR5PSIuNDUiLz48c3RvcCBvZmZzZXQ9Ii45NzUiIHN0b3AtY29sb3I9IiM2RTAwOEIiIHN0b3Atb3BhY2l0eT0iLjYiLz48L3JhZGlhbEdyYWRpZW50PjxyYWRpYWxHcmFkaWVudCBpZD0iaCIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKDM2LjMxMyA3LjU1Mykgc2NhbGUoMjUuNjEzNikiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBzdG9wLWNvbG9yPSIjRkZFMjI2Ii8+PHN0b3Agb2Zmc2V0PSIuMTIxIiBzdG9wLWNvbG9yPSIjRkZEQjI3Ii8+PHN0b3Agb2Zmc2V0PSIuMjk1IiBzdG9wLWNvbG9yPSIjRkZDODJBIi8+PHN0b3Agb2Zmc2V0PSIuNTAyIiBzdG9wLWNvbG9yPSIjRkZBOTMwIi8+PHN0b3Agb2Zmc2V0PSIuNzMyIiBzdG9wLWNvbG9yPSIjRkY3RTM3Ii8+PHN0b3Agb2Zmc2V0PSIuNzkyIiBzdG9wLWNvbG9yPSIjRkY3MTM5Ii8+PC9yYWRpYWxHcmFkaWVudD48cmFkaWFsR3JhZGllbnQgaWQ9ImkiIGN4PSIwIiBjeT0iMCIgcj0iMSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSg1Ni42NyAtOS4xMDQpIHNjYWxlKDEwOS4yODMpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agb2Zmc2V0PSIuMTEzIiBzdG9wLWNvbG9yPSIjRkZGNDRGIi8+PHN0b3Agb2Zmc2V0PSIuNDU2IiBzdG9wLWNvbG9yPSIjRkY5ODBFIi8+PHN0b3Agb2Zmc2V0PSIuNjIyIiBzdG9wLWNvbG9yPSIjRkY1NjM0Ii8+PHN0b3Agb2Zmc2V0PSIuNzE2IiBzdG9wLWNvbG9yPSIjRkYzNjQ3Ii8+PHN0b3Agb2Zmc2V0PSIuOTA0IiBzdG9wLWNvbG9yPSIjRTMxNTg3Ii8+PC9yYWRpYWxHcmFkaWVudD48cmFkaWFsR3JhZGllbnQgaWQ9ImoiIGN4PSIwIiBjeT0iMCIgcj0iMSIgZ3JhZGllbnRUcmFuc2Zvcm09InJvdGF0ZSg4My45NzYgMjUuNDg1IDI0LjkxNCkgc2NhbGUoODAuMDg0NSA1Mi41NTg4KSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiNGRkY0NEYiLz48c3RvcCBvZmZzZXQ9Ii4wNiIgc3RvcC1jb2xvcj0iI0ZGRTg0NyIvPjxzdG9wIG9mZnNldD0iLjE2OCIgc3RvcC1jb2xvcj0iI0ZGQzgzMCIvPjxzdG9wIG9mZnNldD0iLjMwNCIgc3RvcC1jb2xvcj0iI0ZGOTgwRSIvPjxzdG9wIG9mZnNldD0iLjM1NiIgc3RvcC1jb2xvcj0iI0ZGOEIxNiIvPjxzdG9wIG9mZnNldD0iLjQ1NSIgc3RvcC1jb2xvcj0iI0ZGNjcyQSIvPjxzdG9wIG9mZnNldD0iLjU3IiBzdG9wLWNvbG9yPSIjRkYzNjQ3Ii8+PHN0b3Agb2Zmc2V0PSIuNzM3IiBzdG9wLWNvbG9yPSIjRTMxNTg3Ii8+PC9yYWRpYWxHcmFkaWVudD48cmFkaWFsR3JhZGllbnQgaWQ9ImsiIGN4PSIwIiBjeT0iMCIgcj0iMSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgzNi4zMTMgMTYuODA3KSBzY2FsZSg2OC4yMTY2KSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIG9mZnNldD0iLjEzNyIgc3RvcC1jb2xvcj0iI0ZGRjQ0RiIvPjxzdG9wIG9mZnNldD0iLjQ4IiBzdG9wLWNvbG9yPSIjRkY5ODBFIi8+PHN0b3Agb2Zmc2V0PSIuNTkyIiBzdG9wLWNvbG9yPSIjRkY1NjM0Ii8+PHN0b3Agb2Zmc2V0PSIuNjU1IiBzdG9wLWNvbG9yPSIjRkYzNjQ3Ii8+PHN0b3Agb2Zmc2V0PSIuOTA0IiBzdG9wLWNvbG9yPSIjRTMxNTg3Ii8+PC9yYWRpYWxHcmFkaWVudD48cmFkaWFsR3JhZGllbnQgaWQ9ImwiIGN4PSIwIiBjeT0iMCIgcj0iMSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSg1My44OTQgMjAuNTA3KSBzY2FsZSg3NC42NjYyKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIG9mZnNldD0iLjA5NCIgc3RvcC1jb2xvcj0iI0ZGRjQ0RiIvPjxzdG9wIG9mZnNldD0iLjIzMSIgc3RvcC1jb2xvcj0iI0ZGRTE0MSIvPjxzdG9wIG9mZnNldD0iLjUwOSIgc3RvcC1jb2xvcj0iI0ZGQUYxRSIvPjxzdG9wIG9mZnNldD0iLjYyNiIgc3RvcC1jb2xvcj0iI0ZGOTgwRSIvPjwvcmFkaWFsR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJiIiB4MT0iNjcuMzAyIiB4Mj0iNy43NjIiIHkxPSIxMy40NjEiIHkyPSI3MC45MDciIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBvZmZzZXQ9Ii4wNDgiIHN0b3AtY29sb3I9IiNGRkY0NEYiLz48c3RvcCBvZmZzZXQ9Ii4xMTEiIHN0b3AtY29sb3I9IiNGRkU4NDciLz48c3RvcCBvZmZzZXQ9Ii4yMjUiIHN0b3AtY29sb3I9IiNGRkM4MzAiLz48c3RvcCBvZmZzZXQ9Ii4zNjgiIHN0b3AtY29sb3I9IiNGRjk4MEUiLz48c3RvcCBvZmZzZXQ9Ii40MDEiIHN0b3AtY29sb3I9IiNGRjhCMTYiLz48c3RvcCBvZmZzZXQ9Ii40NjIiIHN0b3AtY29sb3I9IiNGRjY3MkEiLz48c3RvcCBvZmZzZXQ9Ii41MzQiIHN0b3AtY29sb3I9IiNGRjM2NDciLz48c3RvcCBvZmZzZXQ9Ii43MDUiIHN0b3AtY29sb3I9IiNFMzE1ODciLz48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCBpZD0ibSIgeDE9IjY2LjU4IiB4Mj0iMTUuOTI2IiB5MT0iMTMuMTU2IiB5Mj0iNjMuODE5IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agb2Zmc2V0PSIuMTY3IiBzdG9wLWNvbG9yPSIjRkZGNDRGIiBzdG9wLW9wYWNpdHk9Ii44Ii8+PHN0b3Agb2Zmc2V0PSIuMjY2IiBzdG9wLWNvbG9yPSIjRkZGNDRGIiBzdG9wLW9wYWNpdHk9Ii42MzQiLz48c3RvcCBvZmZzZXQ9Ii40ODkiIHN0b3AtY29sb3I9IiNGRkY0NEYiIHN0b3Atb3BhY2l0eT0iLjIxNyIvPjxzdG9wIG9mZnNldD0iLjYiIHN0b3AtY29sb3I9IiNGRkY0NEYiIHN0b3Atb3BhY2l0eT0iMCIvPjwvbGluZWFyR3JhZGllbnQ+PGNsaXBQYXRoIGlkPSJhIj48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMCAwaDcxLjY0djc0SDB6IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgzIDIpIi8+PC9jbGlwUGF0aD48L2RlZnM+PC9zdmc+";const Mt=Object.freeze(Object.defineProperty({__proto__:null,default:Ct},Symbol.toStringTag,{value:"Module"}));var rt="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA3OCA3OCI+PGxpbmVhckdyYWRpZW50IGlkPSJhIiB4Mj0iMSIgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgwIC01NC45NDQgLTU0Ljk0NCAwIDIzLjYyIDc5LjQ3NCkiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNmZjFiMmQiLz48c3RvcCBvZmZzZXQ9Ii4zIiBzdG9wLWNvbG9yPSIjZmYxYjJkIi8+PHN0b3Agb2Zmc2V0PSIuNjE0IiBzdG9wLWNvbG9yPSIjZmYxYjJkIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjYTcwMDE0Ii8+PC9saW5lYXJHcmFkaWVudD48bGluZWFyR3JhZGllbnQgaWQ9ImIiIHgyPSIxIiBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDAgLTQ4LjU5NSAtNDguNTk1IDAgMzcuODU0IDc2LjIzNSkiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM5YzAwMDAiLz48c3RvcCBvZmZzZXQ9Ii43IiBzdG9wLWNvbG9yPSIjZmY0YjRiIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjZmY0YjRiIi8+PC9saW5lYXJHcmFkaWVudD48cGF0aCBmaWxsPSJ1cmwoI2EpIiBkPSJNMjguMzQ2IDgwLjM5OEMxMi42OTEgODAuMzk4IDAgNjcuNzA3IDAgNTIuMDUyIDAgMzYuODUgMTEuOTY4IDI0LjQ0MyAyNi45OTYgMjMuNzM5YTI4LjI0NCAyOC4yNDQgMCAwIDEgMjAuMjQxIDcuMThjLTMuMzIyLTIuMjAzLTcuMjA3LTMuNDctMTEuMzU5LTMuNDctNi43NSAwLTEyLjc5NiAzLjM0OC0xNi44NjIgOC42MjktMy4xMzQgMy43LTUuMTY0IDkuMTY5LTUuMzAyIDE1LjMwN3YxLjMzNWMuMTM4IDYuMTM3IDIuMTY4IDExLjYwOCA1LjMwMiAxNS4zMDcgNC4wNjYgNS4yOCAxMC4xMTIgOC42MyAxNi44NjIgOC42MyA0LjE1MiAwIDguMDM4LTEuMjY5IDExLjM2LTMuNDc0YTI4LjIzOSAyOC4yMzkgMCAwIDEtMTguNzg1IDcuMjE1bC0uMTA4LjAwMXoiIHRyYW5zZm9ybT0ibWF0cml4KDEuMzMzMyAwIDAgLTEuMzMzMyAwIDEwNy4yKSIvPjxwYXRoIGZpbGw9InVybCgjYikiIGQ9Ik0xOS4wMTYgNjguMDI1YzIuNjAxIDMuMDcgNS45NiA0LjkyMyA5LjYzMSA0LjkyMyA4LjI1MiAwIDE0Ljk0MS05LjM1NiAxNC45NDEtMjAuODk3cy02LjY5LTIwLjg5Ny0xNC45NDEtMjAuODk3Yy0zLjY3IDAtNy4wMyAxLjg1LTkuNjMgNC45MjIgNC4wNjYtNS4yODEgMTAuMTEtOC42MyAxNi44NjItOC42MyA0LjE1MiAwIDguMDM2IDEuMjY4IDExLjM1OSAzLjQ3MiA1LjgwMiA1LjE5IDkuNDU1IDEyLjczNSA5LjQ1NSAyMS4xMzMgMCA4LjM5Ny0zLjY1MyAxNS45NC05LjQ1MyAyMS4xMy0zLjMyNCAyLjIwNi03LjIwOSAzLjQ3My0xMS4zNjEgMy40NzMtNi43NSAwLTEyLjc5Ni0zLjM0OC0xNi44NjItOC42MyIgdHJhbnNmb3JtPSJtYXRyaXgoMS4zMzMzIDAgMCAtMS4zMzMzIDAgMTA3LjIpIi8+PC9zdmc+";const Dt=Object.freeze(Object.defineProperty({__proto__:null,default:rt},Symbol.toStringTag,{value:"Module"}));var ct="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2aWV3Qm94PSIwIDAgNzggNzciPjxkZWZzPjxtYXNrIGlkPSJkIj48ZyBmaWx0ZXI9InVybCgjYSkiPjxwYXRoIGQ9Ik0wIDBoNzh2NzdIMHoiIHN0eWxlPSJmaWxsOiMwMDA7ZmlsbC1vcGFjaXR5Oi41Mjk0MTI7c3Ryb2tlOm5vbmUiLz48L2c+PC9tYXNrPjxtYXNrIGlkPSJoIj48ZyBmaWx0ZXI9InVybCgjYSkiPjxwYXRoIGQ9Ik0wIDBoNzh2NzdIMHoiIHN0eWxlPSJmaWxsOiMwMDA7ZmlsbC1vcGFjaXR5Oi40MDc4NDM7c3Ryb2tlOm5vbmUiLz48L2c+PC9tYXNrPjxtYXNrIGlkPSJqIj48ZyBmaWx0ZXI9InVybCgjYSkiPjxwYXRoIGQ9Ik0wIDBoNzh2NzdIMHoiIHN0eWxlPSJmaWxsOiMwMDA7ZmlsbC1vcGFjaXR5Oi4yNDMxMzc7c3Ryb2tlOm5vbmUiLz48L2c+PC9tYXNrPjxyYWRpYWxHcmFkaWVudCBpZD0iZiIgY3g9IjQxMy4wNjEiIGN5PSIxMzYuODE4IiByPSI4Mi4xMjUiIGZ4PSI0MTMuMDYxIiBmeT0iMTM2LjgxOCIgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCguNDUwNSAwIDAgLjQ0NjY0IC0xNDYuODYgLTI5LjI5MSkiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBvZmZzZXQ9IjAiIHN0eWxlPSJzdG9wLWNvbG9yOiMwNmMyZTc7c3RvcC1vcGFjaXR5OjEiLz48c3RvcCBvZmZzZXQ9Ii4yNSIgc3R5bGU9InN0b3AtY29sb3I6IzBkYjhlYztzdG9wLW9wYWNpdHk6MSIvPjxzdG9wIG9mZnNldD0iLjUiIHN0eWxlPSJzdG9wLWNvbG9yOiMxMmFlZjE7c3RvcC1vcGFjaXR5OjEiLz48c3RvcCBvZmZzZXQ9Ii43NSIgc3R5bGU9InN0b3AtY29sb3I6IzFmODZmOTtzdG9wLW9wYWNpdHk6MSIvPjxzdG9wIG9mZnNldD0iMSIgc3R5bGU9InN0b3AtY29sb3I6IzEwN2RkZDtzdG9wLW9wYWNpdHk6MSIvPjwvcmFkaWFsR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJlIiB4MT0iNDEyLjk3NSIgeDI9IjQxMi45NzUiIHkxPSIyMzcuNjA4IiB5Mj0iNTkuMzkyIiBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKDIwNi43OSAxNTkuNzczKSBzY2FsZSguMzUxNTQpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agb2Zmc2V0PSIwIiBzdHlsZT0ic3RvcC1jb2xvcjojYmRiZGJkO3N0b3Atb3BhY2l0eToxIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdHlsZT0ic3RvcC1jb2xvcjojZmZmO3N0b3Atb3BhY2l0eToxIi8+PC9saW5lYXJHcmFkaWVudD48Y2xpcFBhdGggaWQ9ImIiPjxwYXRoIGQ9Ik0wIDBoNzh2NzdIMHoiLz48L2NsaXBQYXRoPjxmaWx0ZXIgaWQ9ImEiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHg9IjAlIiB5PSIwJSIgZmlsdGVyVW5pdHM9Im9iamVjdEJvdW5kaW5nQm94Ij48ZmVDb2xvck1hdHJpeCBpbj0iU291cmNlR3JhcGhpYyIgdmFsdWVzPSIwIDAgMCAwIDEgMCAwIDAgMCAxIDAgMCAwIDAgMSAwIDAgMCAxIDAiLz48L2ZpbHRlcj48ZyBpZD0iaSIgY2xpcC1wYXRoPSJ1cmwoI2IpIj48cGF0aCBkPSJtMTUuMzE2IDU5LjIzOCAyNy42NTctMTguNDQ1IDE5Ljg1OS0yNi41NFptMCAwIiBzdHlsZT0ic3Ryb2tlOm5vbmU7ZmlsbC1ydWxlOm5vbnplcm87ZmlsbDojMDAwO2ZpbGwtb3BhY2l0eToxIi8+PC9nPjwvZGVmcz48dXNlIHhsaW5rOmhyZWY9IiNjIiBtYXNrPSJ1cmwoI2QpIi8+PHBhdGggZD0iTTM4My4yOTUgMjExLjk3NmMwIDE3LjMtMTQuMDI2IDMxLjMyNC0zMS4zMjcgMzEuMzI0LTE3LjMgMC0zMS4zMjYtMTQuMDI0LTMxLjMyNi0zMS4zMjQgMC0xNy4zIDE0LjAyNi0zMS4zMjQgMzEuMzI2LTMxLjMyNHMzMS4zMjcgMTQuMDI0IDMxLjMyNyAzMS4zMjRabTAgMCIgc3R5bGU9ImZpbGwtcnVsZTpub256ZXJvO2ZpbGw6dXJsKCNlKTtzdHJva2Utd2lkdGg6LjA5MzAxMjM7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZTojY2RjZGNkO3N0cm9rZS1vcGFjaXR5OjE7c3Ryb2tlLW1pdGVybGltaXQ6NCIgdHJhbnNmb3JtPSJtYXRyaXgoMS4xODExIDAgMCAxLjE3MDk2IC0zNzYuNjM3IC0yMTEuNDcpIi8+PHBhdGggZD0iTTczLjE3MiAzNi43NDZjMCAxOC42NzItMTUuMjY2IDMzLjgwOS0zNC4wOTggMzMuODA5UzQuOTc3IDU1LjQxOCA0Ljk3NyAzNi43NDZjMC0xOC42NzIgMTUuMjY1LTMzLjgwNSAzNC4wOTctMzMuODA1czM0LjA5OCAxNS4xMzMgMzQuMDk4IDMzLjgwNVptMCAwIiBzdHlsZT0ic3Ryb2tlOm5vbmU7ZmlsbC1ydWxlOm5vbnplcm87ZmlsbDp1cmwoI2YpIi8+PHBhdGggZD0iTTM5LjA3NCA0LjcwM2EuNDkzLjQ5MyAwIDAgMC0uNDk2LjQ5MnY1LjY4OGMwIC4yNzMuMjIzLjQ5Mi40OTYuNDkyYS40OTEuNDkxIDAgMCAwIC40OTYtLjQ5MlY1LjE5NWEuNDkxLjQ5MSAwIDAgMC0uNDk2LS40OTJabS0zLjI1NC4yMDNhLjQ5NS40OTUgMCAwIDAtLjU0My41NDNsLjI1IDIuMzhhLjUuNSAwIDAgMCAuNTQ3LjQzNy40ODkuNDg5IDAgMCAwIC40NDItLjU0bC0uMjUtMi4zNzhhLjQ5NS40OTUgMCAwIDAtLjQ0Ni0uNDQyWm02LjUyOC4wMDRjLS4yMy4wMi0uNDE4LjItLjQ0Ni40MzhsLS4yNSAyLjM3OWEuNDkuNDkgMCAwIDAgLjQ0Mi41NDMuNDk2LjQ5NiAwIDAgMCAuNTQ3LS40MzhsLjI1NC0yLjM3OWEuNDk2LjQ5NiAwIDAgMC0uNTQ3LS41NDNabS05Ljg2OC40NzdhLjQ5My40OTMgMCAwIDAtLjQ4NC41OThsMS4xODggNS41NThjLjA1OC4yNy4zMi40MzcuNTkuMzgzYS40OTIuNDkyIDAgMCAwIC4zODItLjU4NkwzMi45NyA1Ljc3N2EuNDk0LjQ5NCAwIDAgMC0uNDg5LS4zOVptMTMuMjExLjAwNGEuNTAyLjUwMiAwIDAgMC0uNDkyLjM5bC0xLjE5MSA1LjU2M2EuNDk3LjQ5NyAwIDAgMCAuOTcyLjIwN2wxLjE5Mi01LjU2M2EuNDkyLjQ5MiAwIDAgMC0uNDgtLjU5N1ptLTE2LjM5OC44ODZhLjU0OC41NDggMCAwIDAtLjE5NS4wMjQuNDkyLjQ5MiAwIDAgMC0uMzIuNjJsLjc0NSAyLjI3NGEuNDkzLjQ5MyAwIDAgMCAuNjI1LjMxNy40OS40OSAwIDAgMCAuMzItLjYyMWwtLjc0NS0yLjI3NGEuNS41IDAgMCAwLS40My0uMzRabTE5LjU2Ni4wMDRhLjUuNSAwIDAgMC0uNDMuMzM2bC0uNzQ1IDIuMjc4YS40OTYuNDk2IDAgMCAwIC45NDUuMzA0bC43NDYtMi4yNzdhLjQ5LjQ5IDAgMCAwLS41MTYtLjY0Wm0tMjIuNzE4IDEuMTRhLjQ5Mi40OTIgMCAwIDAtLjQ0NS42OTVsMi4zMjcgNS4xOTdhLjQ5Ny40OTcgMCAwIDAgLjkxLS40MDJsLTIuMzMxLTUuMTk2YS40OTMuNDkzIDAgMCAwLS40NjEtLjI5M1ptMjUuOTEuMDJhLjQ5NC40OTQgMCAwIDAtLjQ2NS4yOTNsLTIuMzM2IDUuMTkyYy0uMTEzLjI1IDAgLjUzOS4yNS42NDguMjU0LjExNC41NDcgMCAuNjU2LS4yNDZsMi4zMzYtNS4xOTVhLjQ4OC40ODggMCAwIDAtLjI1LS42NDkuNDg2LjQ4NiAwIDAgMC0uMTkxLS4wNDNaTTIzLjIxIDguOTU3YS40OTEuNDkxIDAgMCAwLS4yODEuMDY2LjQ5LjQ5IDAgMCAwLS4xODQuNjcybDEuMjA3IDIuMDc1YS41LjUgMCAwIDAgLjY4LjE4LjQ5NC40OTQgMCAwIDAgLjE4My0uNjc3bC0xLjIwNy0yLjA3YS41LjUgMCAwIDAtLjM5OC0uMjQ2Wm0zMS43MjcgMGEuNS41IDAgMCAwLS4zOTkuMjQ2bC0xLjIwNyAyLjA3YS40OTQuNDk0IDAgMCAwIC4xODQuNjc2LjUuNSAwIDAgMCAuNjgtLjE4bDEuMjA2LTIuMDc0YS40OS40OSAwIDAgMC0uMTgzLS42NzIuNTI0LjUyNCAwIDAgMC0uMjgyLS4wNjZaTTIwLjM3IDEwLjcxNWEuNTAxLjUwMSAwIDAgMC0uMjczLjA5NC40ODcuNDg3IDAgMCAwLS4xMTQuNjg3bDMuMzY4IDQuNjAyYS41LjUgMCAwIDAgLjY5NS4xMTMuNDkuNDkgMCAwIDAgLjExLS42OTFsLTMuMzY4LTQuNjAyYS41MDIuNTAyIDAgMCAwLS40MTgtLjIwM1ptMzcuNDQyLjAyN2EuNDg4LjQ4OCAwIDAgMC0uNDE4LjJsLTMuMzc1IDQuNTk3YS40OTQuNDk0IDAgMCAwIC4xMDkuNjkxYy4yMjMuMTYuNTM1LjExLjY5NS0uMTA5bDMuMzc1LTQuNTk4YS40OS40OSAwIDAgMC0uMTEtLjY4Ny40NjUuNDY1IDAgMCAwLS4yNzYtLjA5NFptLTM5Ljk4MSAyLjA4NmEuNDk2LjQ5NiAwIDAgMC0uMzYuMTI1LjQ4Ny40ODcgMCAwIDAtLjAzOC42OTVsMS42MTcgMS43NzhhLjQ5NS40OTUgMCAxIDAgLjczOC0uNjZsLTEuNjEzLTEuNzc0YS40OTUuNDk1IDAgMCAwLS4zNDQtLjE2NFptNDIuNDg4LjAwNGEuNTA2LjUwNiAwIDAgMC0uMzQzLjE2bC0xLjYxNCAxLjc3OGEuNDkxLjQ5MSAwIDAgMCAuMDQuNjk5Yy4yMDIuMTguNTE1LjE2NC42OTktLjA0bDEuNjE3LTEuNzc3YS40ODcuNDg3IDAgMCAwLS4wNC0uNjk1LjQ5Ni40OTYgMCAwIDAtLjM1OS0uMTI1Wm0tNDQuOTI1IDIuMzEzYS41MTEuNTExIDAgMCAwLS4zNDQuMTY0LjQ5LjQ5IDAgMCAwIC4wMzkuNjk1bDQuMjYyIDMuODA1YS41LjUgMCAwIDAgLjcwMy0uMDM2LjQ5MS40OTEgMCAwIDAtLjA0LS42OTlsLTQuMjYxLTMuOGEuNS41IDAgMCAwLS4zNi0uMTNabTQ3LjM3NS4wMmEuNDk2LjQ5NiAwIDAgMC0uMzYuMTI0bC00LjI2NSAzLjhhLjQ5LjQ5IDAgMCAwLS4wNC42OTZjLjE4OC4yMDMuNS4yMTkuNzA0LjA0bDQuMjY1LTMuODAyYS40OS40OSAwIDAgMC0uMzA1LS44NlpNMTMuMzcgMTcuNzI2YS41MDIuNTAyIDAgMCAwLS40MTguMjAzLjQ4Ni40ODYgMCAwIDAgLjExLjY4N2wxLjk0OSAxLjQwNmMuMjIyLjE2LjUzNS4xMTQuNjk1LS4xMDlhLjQ4Ni40ODYgMCAwIDAtLjExLS42ODdsLTEuOTQ5LTEuNDA3YS41MjUuNTI1IDAgMCAwLS4yNzctLjA5M1ptNTEuNDE4LjAyYS40ODEuNDgxIDAgMCAwLS4yNzMuMDkzbC0xLjk1NCAxLjQwMmEuNDk0LjQ5NCAwIDAgMC0uMTA5LjY5MmMuMTYuMjE4LjQ3My4yNy42OTUuMTA5bDEuOTU0LTEuNDA2YS40OS40OSAwIDAgMCAuMTA5LS42ODguNDg5LjQ4OSAwIDAgMC0uNDIyLS4yMDNaTTExLjQ4IDIwLjQ4YS40OS40OSAwIDAgMC0uMjE1LjkxOGw0Ljk2NSAyLjg0NGEuNS41IDAgMCAwIC42OC0uMTguNDkyLjQ5MiAwIDAgMC0uMTgtLjY3NWwtNC45NjgtMi44NGEuNDkxLjQ5MSAwIDAgMC0uMjgyLS4wNjdabTU1LjE4OCAwYS40NjIuNDYyIDAgMCAwLS4yODEuMDY3bC00Ljk2OSAyLjg0YS40OTIuNDkyIDAgMCAwLS4xOC42NzUuNS41IDAgMCAwIC42OC4xOGw0Ljk2NS0yLjg0NGEuNDkuNDkgMCAwIDAtLjIxNS0uOTE4Wm0tNTYuNjE3IDIuOTM0YS40OTQuNDk0IDAgMCAwLS4yMTUuOTQ1bDIuMjAzLjk3M2MuMjU0LjExLjU0NyAwIC42NTYtLjI1YS40ODUuNDg1IDAgMCAwLS4yNS0uNjQ4bC0yLjIwMy0uOTc3YS40ODYuNDg2IDAgMCAwLS4xOTEtLjA0M1ptNTguMDU4LjAyYS41NDUuNTQ1IDAgMCAwLS4xOTEuMDQzbC0yLjIwNy45NzJhLjQ5Mi40OTIgMCAwIDAtLjI1LjY1My41LjUgMCAwIDAgLjY1Ni4yNWwyLjIwMy0uOTczYS40OTMuNDkzIDAgMCAwIC4yNTQtLjY1Mi40OTguNDk4IDAgMCAwLS40NjUtLjI5M1pNOC43NzMgMjYuNDhhLjQ5Mi40OTIgMCAwIDAtLjExLjk2bDUuNDUgMS43NjNhLjQ5Mi40OTIgMCAxIDAgLjMwOS0uOTM4bC01LjQ1My0xLjc2MWEuNTQ4LjU0OCAwIDAgMC0uMTk2LS4wMjRabTYwLjYxLjAyNGEuNDE1LjQxNSAwIDAgMC0uMTk1LjAyM2wtNS40NTggMS43NTRhLjQ5My40OTMgMCAxIDAgLjMwOS45MzhsNS40NTMtMS43NTRhLjQ5NS40OTUgMCAwIDAgLjMyLS42MjUuNDk2LjQ5NiAwIDAgMC0uNDMtLjMzNlptLTYxLjQwMyAzLjJhLjQ5NC40OTQgMCAwIDAtLjQ5Mi4zOS40OTMuNDkzIDAgMCAwIC4zODcuNTgybDIuMzYuNDk2Yy4yNjkuMDU4LjUzLS4xMS41OS0uMzc5YS40OTMuNDkzIDAgMCAwLS4zODctLjU4MmwtMi4zNi0uNWEuODIyLjgyMiAwIDAgMC0uMDk4LS4wMDhabTYyLjE5Mi4wMDNjLS4wMzUgMC0uMDY3LjAwNC0uMTAyLjAwOGwtMi4zNi41YS40OTEuNDkxIDAgMSAwIC4yMDcuOTZsMi4zNi0uNDk1YS40OS40OSAwIDAgMC0uMTA1LS45NzNaTTcuMzc5IDMyLjk0MWMtLjIzLjAyLS40MjIuMi0uNDQ1LjQzOGEuNDk1LjQ5NSAwIDAgMCAuNDQxLjU0M2w1LjcwMy41OThhLjQ5OS40OTkgMCAwIDAgLjU0Ny0uNDQyLjQ5MS40OTEgMCAwIDAtLjQ0MS0uNTM5bC01LjcwNC0uNTk4YS40NDEuNDQxIDAgMCAwLS4xMDEgMFptNjMuMzk4LjA0Yy0uMDM1IDAtLjA3IDAtLjEwMS4wMDNsLTUuNzAzLjU5YS40OTIuNDkyIDAgMSAwIC4xMDEuOThsNS43MDMtLjU5YS40OTUuNDk1IDAgMCAwIDAtLjk4NFpNNy4yODEgMzYuMjUzYS40OTMuNDkzIDAgMSAwIDAgLjk4OGgyLjQxNGEuNDkzLjQ5MyAwIDEgMCAwLS45ODhabTYxLjE3MiAwYS40OTMuNDkzIDAgMSAwIDAgLjk4OGgyLjQxNGEuNDkzLjQ5MyAwIDEgMCAwLS45ODhaTTEzLjE3NiAzOC45NGEuNDQyLjQ0MiAwIDAgMC0uMTAyIDBsLTUuNzAzLjU5YS40OTMuNDkzIDAgMSAwIC4xMDIuOThsNS43MDMtLjU5YS40OTIuNDkyIDAgMCAwIDAtLjk4Wm01MS43OTMuMDM2YS40OTMuNDkzIDAgMCAwLS4wMDQuOThsNS43MDMuNTk4YS40OTYuNDk2IDAgMCAwIC41NDctLjQzOC40OS40OSAwIDAgMC0uNDQyLS41NDNsLTUuNzAzLS41OTdhLjQ0MS40NDEgMCAwIDAtLjEwMSAwWm0tNTQuNjM3IDMuMzI4YS40NzcuNDc3IDAgMCAwLS4xMDIuMDExbC0yLjM1OS40OTZhLjQ5Ny40OTcgMCAwIDAtLjM4My41ODZjLjA1OS4yNjYuMzIuNDM4LjU5LjM4bDIuMzYtLjQ5N2EuNDkyLjQ5MiAwIDAgMCAuMzgyLS41ODYuNS41IDAgMCAwLS40ODgtLjM5Wm01Ny40ODQuMDA4YS40OS40OSAwIDAgMC0uNDg4LjM5LjQ4OC40ODggMCAwIDAgLjM4My41ODJsMi4zNi41YS40OTkuNDk5IDAgMCAwIC41OS0uMzgzLjQ5NC40OTQgMCAwIDAtLjM4NC0uNTgybC0yLjM1OS0uNWEuOTMuOTMgMCAwIDAtLjEwMi0uMDA4Wm0tNTMuNTExIDEuOTRhLjQ4NC40ODQgMCAwIDAtLjE5Ni4wMkw4LjY1NiA0Ni4wM2EuNDkyLjQ5MiAwIDEgMCAuMzA5LjkzOGw1LjQ1My0xLjc1OGEuNDkxLjQ5MSAwIDAgMC0uMTEzLS45NTdabTQ5LjUzLjAxN2EuNDkyLjQ5MiAwIDAgMC0uMTEuOTZsNS40NTUgMS43NjJhLjUuNSAwIDAgMCAuNjI1LS4zMTYuNDg3LjQ4NyAwIDAgMC0uMzE3LS42MjFsLTUuNDUzLTEuNzYyYy0uMDY2LS4wMjMtLjEzMy0uMDI3LS4yLS4wMjNabS01MS42MTIgMy44MzJhLjQ4Ni40ODYgMCAwIDAtLjE5Mi4wNDNsLTIuMjAzLjk3MmEuNDk2LjQ5NiAwIDAgMC0uMjU0LjY1My41MDMuNTAzIDAgMCAwIC42NTYuMjVsMi4yMDctLjk3M2EuNDk0LjQ5NCAwIDAgMC0uMjE1LS45NDVabTUzLjY5NS4wMmEuNDk0LjQ5NCAwIDAgMC0uNDY1LjI5MmMtLjExMy4yNSAwIC41NC4yNS42NDhsMi4yMDMuOTc3Yy4yNTQuMTEuNTQ3IDAgLjY1Ni0uMjVhLjQ5LjQ5IDAgMCAwLS4yNS0uNjUybC0yLjIwMy0uOTczYS40ODYuNDg2IDAgMCAwLS4xOTEtLjA0M1ptLTQ5LjQwMiAxLjA2NmEuNDk3LjQ5NyAwIDAgMC0uMjg2LjA2NmwtNC45NjQgMi44NDRhLjQ5LjQ5IDAgMCAwLS4xODQuNjcyYy4xNC4yMzguNDQxLjMxNi42OC4xOGw0Ljk2OC0yLjg0YS40OTIuNDkyIDAgMCAwIC4xOC0uNjc2LjQ5My40OTMgMCAwIDAtLjM5NC0uMjQ2Wm00NS4xMTcgMGEuNDkzLjQ5MyAwIDAgMC0uMzk1LjI0Ni40OTIuNDkyIDAgMCAwIC4xOC42NzVsNC45NjkgMi44NGEuNDk4LjQ5OCAwIDAgMCAuNjgtLjE4LjQ5LjQ5IDAgMCAwLS4xODQtLjY3MWwtNC45NjUtMi44NDRhLjUzLjUzIDAgMCAwLS4yODUtLjA2NlptLTQ2LjM1NiA0LjE3MWEuNTI0LjUyNCAwIDAgMC0uMjc3LjA5NGwtMS45NSAxLjQwNmEuNDkuNDkgMCAwIDAtLjExMy42ODguNS41IDAgMCAwIC42OTYuMTFsMS45NTMtMS40MDNhLjQ5LjQ5IDAgMCAwIC4xMS0uNjkxLjUwMi41MDIgMCAwIDAtLjQxOS0uMjA0Wm00Ny41ODIuMDE2YS41MDIuNTAyIDAgMCAwLS40MTguMjAzLjQ5LjQ5IDAgMCAwIC4xMS42OTJsMS45NTMgMS40MDZjLjIyMy4xNi41MzEuMTEuNjkxLS4xMWEuNDkuNDkgMCAwIDAtLjExLS42OTFsLTEuOTQ4LTEuNDAyYS40OTguNDk4IDAgMCAwLS4yNzgtLjA5OFptLTQzLjE2LjE3MmEuNDk2LjQ5NiAwIDAgMC0uMzYuMTI1bC00LjI2NSAzLjhhLjQ4Ni40ODYgMCAwIDAtLjAzNS42OTYuNDk1LjQ5NSAwIDAgMCAuNy4wMzlsNC4yNjUtMy44YS40ODcuNDg3IDAgMCAwIC4wMzktLjY5Ni41MTEuNTExIDAgMCAwLS4zNDQtLjE2NFptMzguNzM5LjAxMmEuNTExLjUxMSAwIDAgMC0uMzQ0LjE2NC40ODYuNDg2IDAgMCAwIC4wMzkuNjk1bDQuMjYyIDMuODA1YS41LjUgMCAwIDAgLjcwMy0uMDM1LjQ4Ni40ODYgMCAwIDAtLjA0LS42OTZsLTQuMjYxLTMuODA0YS41LjUgMCAwIDAtLjM2LS4xM1ptLTM0LjY5NiAzLjYxM2EuNDg3LjQ4NyAwIDAgMC0uNDE4LjIwM2wtMy4zNzUgNC41OThhLjQ5LjQ5IDAgMCAwIC4xMS42ODdjLjIyMi4xNi41MzUuMTEzLjY5NS0uMTFsMy4zNzUtNC41OTdhLjQ5LjQ5IDAgMCAwLS4zODctLjc4MVptMzAuNjMzLjAyYS41MTIuNTEyIDAgMCAwLS4yNzMuMDkzLjQ4Ni40ODYgMCAwIDAtLjExLjY4OGwzLjM2NyA0LjYwMWEuNDk1LjQ5NSAwIDEgMCAuODA1LS41NzhsLTMuMzY3LTQuNjAxYS41MDkuNTA5IDAgMCAwLS40MjItLjIwNFptLTM0Ljk4NC43MWEuNDk2LjQ5NiAwIDAgMC0uMzQ0LjE2NGwtMS42MTMgMS43NzhhLjQ4Ny40ODcgMCAwIDAgLjAzNS42OTUuNS41IDAgMCAwIC43MDMtLjAzOWwxLjYxMy0xLjc3N2EuNDg3LjQ4NyAwIDAgMC0uMDM5LS42OTYuNDkyLjQ5MiAwIDAgMC0uMzU1LS4xMjVabTM5LjM2NyAwYS41LjUgMCAwIDAtLjM2LjEzLjQ4Ny40ODcgMCAwIDAtLjAzOS42OTVsMS42MTQgMS43NzdhLjUuNSAwIDAgMCAuNzAzLjAzNS40ODYuNDg2IDAgMCAwIC4wMzktLjY5NWwtMS42MTMtMS43NzhhLjUxMS41MTEgMCAwIDAtLjM0NC0uMTY0Wm0tMzAuMzA1IDEuOTczYS40OTMuNDkzIDAgMCAwLS40Ni4yOTNsLTIuMzM3IDUuMTkxYy0uMTEzLjI1IDAgLjU0LjI1LjY1M2EuNS41IDAgMCAwIC42NTctLjI1bDIuMzM1LTUuMTkyYS40OTIuNDkyIDAgMCAwLS40NDUtLjY5NVptMjEuMjExLjAxNmEuNDkxLjQ5MSAwIDAgMC0uNDUuNjkxbDIuMzMzIDUuMTk1Yy4xMS4yNS40MDIuMzY0LjY1Ni4yNWEuNDg2LjQ4NiAwIDAgMCAuMjUtLjY0OGwtMi4zMjgtNS4xOTVhLjQ5My40OTMgMCAwIDAtLjQ2LS4yOTNabS0yNS4zMTYgMS41OWEuNDk5LjQ5OSAwIDAgMC0uMzk1LjI0NmwtMS4yMDcgMi4wN2EuNDk0LjQ5NCAwIDAgMCAuMTg0LjY3Ni40OTguNDk4IDAgMCAwIC42OC0uMTg0bDEuMjA2LTIuMDdhLjQ5LjQ5IDAgMCAwLS4xODMtLjY3Mi40OTcuNDk3IDAgMCAwLS4yODUtLjA2N1ptMjkuNDUzIDBhLjQ5Ny40OTcgMCAwIDAtLjI4NS4wNjYuNDg1LjQ4NSAwIDAgMC0uMTguNjcybDEuMjAzIDIuMDdhLjUuNSAwIDAgMCAuNjguMTg0LjQ5NC40OTQgMCAwIDAgLjE4My0uNjc2bC0xLjIwNy0yLjA3YS40OTkuNDk5IDAgMCAwLS4zOTQtLjI0N1ptLTIwLjE0NS4wNzRhLjQ5Ny40OTcgMCAwIDAtLjQ4OC4zOWwtMS4xOTEgNS41NjNhLjQ4OC40ODggMCAwIDAgLjM4Mi41ODJjLjI3LjA1OC41MzItLjExLjU5LS4zOGwxLjE5Mi01LjU1OGEuNDkzLjQ5MyAwIDAgMC0uNDg1LS41OTdabTEwLjgyLjAwNGEuNDUuNDUgMCAwIDAtLjEwMS4wMTEuNDg4LjQ4OCAwIDAgMC0uMzgzLjU4MmwxLjE4OCA1LjU2M2MuMDU0LjI3LjMyLjQzNy41OS4zNzlhLjQ5LjQ5IDAgMCAwIC4zODItLjU4MmwtMS4xODctNS41NjNhLjQ5Ny40OTcgMCAwIDAtLjQ4OC0uMzlabS01LjQwMi41NjJhLjQ5My40OTMgMCAwIDAtLjQ5Ni40OTJ2NS42ODRjMCAuMjczLjIyMy40OTIuNDk2LjQ5MmEuNDkxLjQ5MSAwIDAgMCAuNDk2LS40OTJ2LTUuNjg0YS40OTEuNDkxIDAgMCAwLS40OTYtLjQ5MlptLTkuMTI1IDEuODM2YS40OS40OSAwIDAgMC0uNDMuMzRsLS43NDYgMi4yNzNhLjQ5LjQ5IDAgMCAwIC4zMTcuNjIxLjQ5OS40OTkgMCAwIDAgLjYyOS0uMzE2bC43NDYtMi4yNzNhLjQ5LjQ5IDAgMCAwLS4zMi0uNjIyLjQ4OC40ODggMCAwIDAtLjE5Ni0uMDIzWm0xOC4yNDYgMGEuNTcuNTcgMCAwIDAtLjE5NS4wMjMuNDkyLjQ5MiAwIDAgMC0uMzIuNjIybC43NDYgMi4yNzNhLjQ5My40OTMgMCAwIDAgLjYyNS4zMTYuNDg2LjQ4NiAwIDAgMCAuMzItLjYybC0uNzQ2LTIuMjc0YS40OS40OSAwIDAgMC0uNDMtLjM0Wm0tMTIuMjQyIDEuMjdhLjQ5MS40OTEgMCAwIDAtLjQ0NS40MzdsLS4yNSAyLjM3OWEuNDg5LjQ4OSAwIDAgMCAuNDQxLjUzOS40OTMuNDkzIDAgMCAwIC41NDctLjQzN2wuMjUtMi4zOGEuNDg5LjQ4OSAwIDAgMC0uNTQzLS41MzhabTYuMjIzIDBhLjQ5LjQ5IDAgMCAwLS41NDMuNTQzbC4yNSAyLjM3OGMuMDI3LjI3LjI3LjQ2NS41NDMuNDM4YS40OTIuNDkyIDAgMCAwIC40NDUtLjU0bC0uMjUtMi4zNzhhLjQ5OS40OTkgMCAwIDAtLjQ0NS0uNDQxWm0wIDAiIHN0eWxlPSJzdHJva2U6bm9uZTtmaWxsLXJ1bGU6bm9uemVybztmaWxsOiNmNGYyZjM7ZmlsbC1vcGFjaXR5OjEiLz48dXNlIHhsaW5rOmhyZWY9IiNnIiBtYXNrPSJ1cmwoI2gpIi8+PHBhdGggZD0ibTQyLjk3MyA0MC43OTMtNy43OTctOC4wOTQgMjcuNjU2LTE4LjQ0NVptMCAwIiBzdHlsZT0ic3Ryb2tlOm5vbmU7ZmlsbC1ydWxlOm5vbnplcm87ZmlsbDojZmY1MTUwO2ZpbGwtb3BhY2l0eToxIi8+PHBhdGggZD0ibTQyLjk3MyA0MC43OTMtNy43OTctOC4wOTQtMTkuODYgMjYuNTRabTAgMCIgc3R5bGU9InN0cm9rZTpub25lO2ZpbGwtcnVsZTpub256ZXJvO2ZpbGw6I2YxZjFmMTtmaWxsLW9wYWNpdHk6MSIvPjx1c2UgeGxpbms6aHJlZj0iI2kiIG1hc2s9InVybCgjaikiLz48L3N2Zz4=";const st=Object.freeze(Object.defineProperty({__proto__:null,default:ct},Symbol.toStringTag,{value:"Module"}));var At="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCA3OCA3OCI+PGcgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9InVybCgjYSkiIGQ9Ik0zOSA3NmMyMC40MzQgMCAzNy0xNi41NjYgMzctMzdTNTkuNDM0IDIgMzkgMiAyIDE4LjU2NiAyIDM5czE2LjU2NiAzNyAzNyAzN1ptMC01YzE3LjY3MyAwIDMyLTE0LjMyNyAzMi0zMkM3MSAyMS4zMjcgNTYuNjczIDcgMzkgNyAyMS4zMjcgNyA3IDIxLjMyNyA3IDM5YzAgMTcuNjczIDE0LjMyNyAzMiAzMiAzMloiLz48cGF0aCBmaWxsPSJ1cmwoI2IpIiBkPSJNMzkgNzZjMjAuNDM0IDAgMzctMTYuNTY2IDM3LTM3UzU5LjQzNCAyIDM5IDIgMiAxOC41NjYgMiAzOXMxNi41NjYgMzcgMzcgMzdabTAtNWMxNy42NzMgMCAzMi0xNC4zMjcgMzItMzJDNzEgMjEuMzI3IDU2LjY3MyA3IDM5IDcgMjEuMzI3IDcgNyAyMS4zMjcgNyAzOWMwIDE3LjY3MyAxNC4zMjcgMzIgMzIgMzJaIi8+PC9nPjxjaXJjbGUgY3g9IjM5IiBjeT0iMzkiIHI9IjMwIiBmaWxsPSJ1cmwoI2MpIi8+PGNpcmNsZSBjeD0iMzkiIGN5PSIzOSIgcj0iMzAiIGZpbGw9InVybCgjZCkiIGZpbGwtb3BhY2l0eT0iLjciIHN0eWxlPSJtaXgtYmxlbmQtbW9kZTpzY3JlZW4iLz48ZyBmaWx0ZXI9InVybCgjZSkiPjxjaXJjbGUgY3g9IjM5IiBjeT0iMzkiIHI9IjI5LjUiIHN0cm9rZT0iIzAwMCIvPjwvZz48ZyBmaWx0ZXI9InVybCgjZikiPjxwYXRoIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iLjMiIGQ9Im01NS42ODEgNTMuNTk3LTguOTczLTE4Ljg2NWMtLjU0LTEuMTQ3LTEuMzE2LTEuOTI0LTIuNDI5LTIuNDYzbC0xOC44MjQtOC45MWMtMi40MjktMS4xNDctNC4yNS42MDctMy4xMDMgMy4xMDUgMS4xNDcgMi40OTcgOC45NCAxOC44MzEgOC45NCAxOC44MzEuNTA1IDEuMDggMS4yNDggMS44MjIgMi40MjggMi40M2wxOC44NTggOC45NDNjMi4zNjEgMS4xMTQgNC4xODMtLjc0MiAzLjEwMy0zLjA3MVptLTEyLjM4LTEzLjZjMCAyLjMyOC0xLjkyMyA0LjI1Mi00LjI1IDQuMjUyLTIuMzI4IDAtNC4yNTEtMS45MjQtNC4yNTEtNC4yNTJhNC4yNTUgNC4yNTUgMCAwIDEgNC4yNS00LjI1MmMyLjMyOCAwIDQuMjUgMS44OSA0LjI1IDQuMjUyWiIvPjwvZz48cGF0aCBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9Ii44IiBkPSJtNTUuNjgxIDUyLjU5Ny04Ljk3My0xOC44NjVjLS41NC0xLjE0Ny0xLjMxNi0xLjkyNC0yLjQyOS0yLjQ2M2wtMTguODI0LTguOTFjLTIuNDI5LTEuMTQ3LTQuMjUuNjA3LTMuMTAzIDMuMTA1IDEuMTQ3IDIuNDk3IDguOTQgMTguODMxIDguOTQgMTguODMxLjUwNSAxLjA4IDEuMjQ4IDEuODIyIDIuNDI4IDIuNDNsMTguODU4IDguOTQzYzIuMzYxIDEuMTE0IDQuMTgzLS43NDIgMy4xMDMtMy4wNzFabS0xMi4zOC0xMy42YzAgMi4zMjgtMS45MjMgNC4yNTItNC4yNSA0LjI1Mi0yLjMyOCAwLTQuMjUxLTEuOTI0LTQuMjUxLTQuMjUyYTQuMjU1IDQuMjU1IDAgMCAxIDQuMjUtNC4yNTJjMi4zMjggMCA0LjI1IDEuODkgNC4yNSA0LjI1MloiLz48cGF0aCBmaWxsPSJ1cmwoI2cpIiBkPSJtNTUuNjgxIDUyLjU5Ny04Ljk3My0xOC44NjVjLS41NC0xLjE0Ny0xLjMxNi0xLjkyNC0yLjQyOS0yLjQ2M2wtMTguODI0LTguOTFjLTIuNDI5LTEuMTQ3LTQuMjUuNjA3LTMuMTAzIDMuMTA1IDEuMTQ3IDIuNDk3IDguOTQgMTguODMxIDguOTQgMTguODMxLjUwNSAxLjA4IDEuMjQ4IDEuODIyIDIuNDI4IDIuNDNsMTguODU4IDguOTQzYzIuMzYxIDEuMTE0IDQuMTgzLS43NDIgMy4xMDMtMy4wNzFabS0xMi4zOC0xMy42YzAgMi4zMjgtMS45MjMgNC4yNTItNC4yNSA0LjI1Mi0yLjMyOCAwLTQuMjUxLTEuOTI0LTQuMjUxLTQuMjUyYTQuMjU1IDQuMjU1IDAgMCAxIDQuMjUtNC4yNTJjMi4zMjggMCA0LjI1IDEuODkgNC4yNSA0LjI1MloiIG9wYWNpdHk9Ii4xNCIvPjxwYXRoIGZpbGw9InVybCgjaCkiIGZpbGwtb3BhY2l0eT0iLjA4IiBkPSJNNjEuMjQ4IDU2LjAwOGMuMTY2LS4yMTcuMjUtLjMyNS4zNzgtLjY2Ljc1NC0xLjk1LTEuMTgzLTMuOTUtMy4xNTctMy4yNi0uMzM4LjExOC0uOTA0LjUyMi0yLjAzNSAxLjMzMkEyOS44NjMgMjkuODYzIDAgMCAxIDM5IDU5LjAwM2EyOS44NjMgMjkuODYzIDAgMCAxLTE3LjQyNS01LjU3N2MtMS4xMzItLjgwOS0xLjY5Ny0xLjIxMy0yLjAzNS0xLjMzMS0xLjk3NC0uNjktMy45MTEgMS4zMTMtMy4xNTYgMy4yNjMuMTI5LjMzNC4yMTIuNDQyLjM3OC42NTkgNS4xMTggNi42NzkgMTMuMTc2IDEwLjk4NiAyMi4yNCAxMC45ODYgOS4wNjggMCAxNy4xMjktNC4zMSAyMi4yNDYtMTAuOTk1WiIvPjxwYXRoIGZpbGw9InVybCgjaSkiIGZpbGwtb3BhY2l0eT0iLjIiIGQ9Ik02Mi4yNiA0MC4wNTFDNjMuODA1IDQxLjk0NyA2NyA0MS40NDUgNjcgMzljMC0xNS40NjQtMTIuNTM2LTI4LTI4LTI4UzExIDIzLjUzNiAxMSAzOWMwIDIuNDQ1IDMuMTk1IDIuOTQ2IDQuNzQgMS4wNTFDMjEuMjQxIDMzLjMwNyAyOS42MTggMjkgMzkgMjljOS4zODIgMCAxNy43NTggNC4zMDcgMjMuMjYgMTEuMDUxWiIvPjxwYXRoIGZpbGw9InVybCgjaikiIGQ9Ik0zOSA0NWE2IDYgMCAxIDEgMC0xMS45OTkgNiA2IDAgMCAxIDAgMTJaIi8+PHBhdGggc3Ryb2tlPSIjZmZmIiBzdHJva2Utb3BhY2l0eT0iLjI0IiBzdHJva2Utd2lkdGg9Ii4xMjUiIGQ9Ik0zNi43MjggNDQuNDg2YTUuOTM4IDUuOTM4IDAgMSAwIDQuNTQ1LTEwLjk3MSA1LjkzOCA1LjkzOCAwIDAgMC00LjU0NSAxMC45NzFaIi8+PGcgZmlsdGVyPSJ1cmwoI2spIj48cGF0aCBmaWxsPSIjMUExQjFGIiBkPSJNMzkgNDZhNiA2IDAgMSAxIDAtMTEuOTk5IDYgNiAwIDAgMSAwIDEyWiIvPjwvZz48cGF0aCBmaWxsPSJ1cmwoI2wpIiBkPSJNMzkgNDQuNWE1LjUgNS41IDAgMSAxIDAtMTEgNS41IDUuNSAwIDAgMSAwIDExWiIvPjxwYXRoIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4yNCIgc3Ryb2tlLXdpZHRoPSIuMjUiIGQ9Ik0zNi45NDQgNDMuOTY2YTUuMzc2IDUuMzc2IDAgMSAwIDQuMTE0LTkuOTM0IDUuMzc2IDUuMzc2IDAgMCAwLTQuMTE0IDkuOTM0WiIvPjxwYXRoIGZpbGw9InVybCgjbSkiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTM2LjcwNCA0NC41NDRhNi4wMDIgNi4wMDIgMCAwIDAgOC4yOTctNS41NDMgNiA2IDAgMSAwLTguMjk3IDUuNTQzWm0uMTkxLS40NjNhNS41IDUuNSAwIDEgMCA0LjIxLTEwLjE2MyA1LjUgNS41IDAgMCAwLTQuMjEgMTAuMTYzWiIgY2xpcC1ydWxlPSJldmVub2RkIi8+PHBhdGggZmlsbD0idXJsKCNuKSIgZmlsbC1vcGFjaXR5PSIuMDYiIGQ9Ik0zNi44OTcgNDIuMTJBNS45OCA1Ljk4IDAgMCAwIDM5IDQyLjVjMS40NiAwIDIuODU4LS41MjYgMy44OS0xLjQ2NC4yNTYtLjIzMy43MDEtLjAyMi41NC4yODVhNSA1IDAgMCAxLTkuMDQ5LS40MDZjLS4wOTgtLjIzOC4yMzctLjM4My40MTEtLjE5NWE1LjU2NSA1LjU2NSAwIDAgMCAyLjEwMyAxLjRaIi8+PGcgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9InVybCgjbykiIGQ9Ik0zOSA3MWMxNy42NzMgMCAzMi0xNC4zMjcgMzItMzJDNzEgMjEuMzI3IDU2LjY3MyA3IDM5IDcgMjEuMzI3IDcgNyAyMS4zMjcgNyAzOWMwIDE3LjY3MyAxNC4zMjcgMzIgMzIgMzJabTAtMmMxNi41NjkgMCAzMC0xMy40MzEgMzAtMzBDNjkgMjIuNDMxIDU1LjU2OSA5IDM5IDkgMjIuNDMxIDkgOSAyMi40MzEgOSAzOWMwIDE2LjU2OSAxMy40MzEgMzAgMzAgMzBaIi8+PHBhdGggZmlsbD0idXJsKCNwKSIgZD0iTTM5IDcxYzE3LjY3MyAwIDMyLTE0LjMyNyAzMi0zMkM3MSAyMS4zMjcgNTYuNjczIDcgMzkgNyAyMS4zMjcgNyA3IDIxLjMyNyA3IDM5YzAgMTcuNjczIDE0LjMyNyAzMiAzMiAzMlptMC0yYzE2LjU2OSAwIDMwLTEzLjQzMSAzMC0zMEM2OSAyMi40MzEgNTUuNTY5IDkgMzkgOSAyMi40MzEgOSA5IDIyLjQzMSA5IDM5YzAgMTYuNTY5IDEzLjQzMSAzMCAzMCAzMFoiLz48L2c+PHBhdGggZmlsbD0idXJsKCNxKSIgZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMzkgNzZjMjAuNDM0IDAgMzctMTYuNTY2IDM3LTM3UzU5LjQzNCAyIDM5IDIgMiAxOC41NjYgMiAzOXMxNi41NjYgMzcgMzcgMzdabTAtMWMxOS44ODIgMCAzNi0xNi4xMTggMzYtMzZTNTguODgyIDMgMzkgMyAzIDE5LjExOCAzIDM5czE2LjExOCAzNiAzNiAzNloiIGNsaXAtcnVsZT0iZXZlbm9kZCIvPjxjaXJjbGUgY3g9IjM5IiBjeT0iMzkiIHI9IjMyIiBzdHJva2U9IiNmZmYiIHN0cm9rZS1vcGFjaXR5PSIuMyIgc3Ryb2tlLXdpZHRoPSIuMjUiLz48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImEiIHgxPSIzOSIgeDI9IjM5IiB5MT0iMiIgeTI9Ijc2IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agc3RvcC1jb2xvcj0iIzE3NDI5OSIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzAwMUU1OSIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJiIiB4MT0iMzkiIHgyPSIzOSIgeTE9IjIiIHkyPSI3NiIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiNEMkQ4RTQiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNDMkM5RDYiLz48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjM0IiB4Mj0iNDYuNSIgeTE9IjQ1LjUiIHkyPSIzMyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiNmZmYiIHN0b3Atb3BhY2l0eT0iMCIvPjxzdG9wIG9mZnNldD0iLjQ1MyIgc3RvcC1jb2xvcj0iI2ZmZiIgc3RvcC1vcGFjaXR5PSIuNjQiLz48c3RvcCBvZmZzZXQ9Ii40NTMiIHN0b3AtY29sb3I9IiMzQjNCM0IiIHN0b3Atb3BhY2l0eT0iLjIzMyIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1vcGFjaXR5PSIwIi8+PC9saW5lYXJHcmFkaWVudD48bGluZWFyR3JhZGllbnQgaWQ9ImkiIHgxPSIzOSIgeDI9IjM5IiB5MT0iMTEiIHkyPSI0MS4yMDUiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBzdG9wLWNvbG9yPSIjZmZmIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjZmZmIiBzdG9wLW9wYWNpdHk9IjAiLz48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCBpZD0iaiIgeDE9IjM5LjAwMSIgeDI9IjM4Ljc1MSIgeTE9IjMzIiB5Mj0iNDUiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBzdG9wLWNvbG9yPSIjRENFMUVBIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjQkVDNkQ1Ii8+PC9saW5lYXJHcmFkaWVudD48bGluZWFyR3JhZGllbnQgaWQ9ImwiIHgxPSIzOS4wMDEiIHgyPSIzOC43NzIiIHkxPSIzMy41IiB5Mj0iNDQuNSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiNEQ0UxRUEiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNCRUM2RDUiLz48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCBpZD0ibSIgeDE9IjM5IiB4Mj0iMzkiIHkxPSIzMyIgeTI9IjQ1LjAwMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiNGMkY0RjciLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNBM0FEQzIiLz48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCBpZD0ibyIgeDE9IjM5IiB4Mj0iMzkiIHkxPSI3IiB5Mj0iNzEiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBzdG9wLWNvbG9yPSIjRDJEOEU0Ii8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjQzJDOUQ2Ii8+PC9saW5lYXJHcmFkaWVudD48bGluZWFyR3JhZGllbnQgaWQ9InAiIHgxPSIzOSIgeDI9IjM5IiB5MT0iNyIgeTI9IjcxIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agc3RvcC1jb2xvcj0iIzlGQUNDNiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0UwRTNFQiIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJxIiB4MT0iMzkiIHgyPSIzOSIgeTE9IjIiIHkyPSI3NiIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiNGMkY0RjciLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNBM0FEQzIiLz48L2xpbmVhckdyYWRpZW50PjxyYWRpYWxHcmFkaWVudCBpZD0iYyIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFRyYW5zZm9ybT0icm90YXRlKC00MC4wNzcgMTA4LjU1NiA2NS40MTYpIHNjYWxlKDExOC40MzUpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agb2Zmc2V0PSIuMjc2IiBzdG9wLWNvbG9yPSIjMjBGRjREIi8+PHN0b3Agb2Zmc2V0PSIuNDY0IiBzdG9wLWNvbG9yPSIjMTQ5OUZGIi8+PHN0b3Agb2Zmc2V0PSIuNzU1IiBzdG9wLWNvbG9yPSIjRkY2RkM2Ii8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjQkM2N0ZGIi8+PC9yYWRpYWxHcmFkaWVudD48cmFkaWFsR3JhZGllbnQgaWQ9ImQiIGN4PSIwIiBjeT0iMCIgcj0iMSIgZ3JhZGllbnRUcmFuc2Zvcm09InJvdGF0ZSg0NSAuMjY1IC0uNjQpIHNjYWxlKDk4LjExMTEpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agc3RvcC1jb2xvcj0icmVkIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMDBBM0ZGIi8+PC9yYWRpYWxHcmFkaWVudD48cmFkaWFsR3JhZGllbnQgaWQ9ImgiIGN4PSIwIiBjeT0iMCIgcj0iMSIgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgwIC0yOS4zODg3IDU3LjQ4MzggMCAzOC45OTkgNjcpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3AvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1vcGFjaXR5PSIwIi8+PC9yYWRpYWxHcmFkaWVudD48cmFkaWFsR3JhZGllbnQgaWQ9Im4iIGN4PSIwIiBjeT0iMCIgcj0iMSIgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgtLjAwMTM1IC01Ljc1MDM4IDguNDI1NTcgLS4wMDE5OSAzOS4wMDIgNDQpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3AvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1vcGFjaXR5PSIwIi8+PC9yYWRpYWxHcmFkaWVudD48ZmlsdGVyIGlkPSJlIiB3aWR0aD0iNjgiIGhlaWdodD0iNjgiIHg9IjUiIHk9IjUiIGNvbG9yLWludGVycG9sYXRpb24tZmlsdGVycz0ic1JHQiIgZmlsdGVyVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48ZmVGbG9vZCBmbG9vZC1vcGFjaXR5PSIwIiByZXN1bHQ9IkJhY2tncm91bmRJbWFnZUZpeCIvPjxmZUJsZW5kIGluPSJTb3VyY2VHcmFwaGljIiBpbjI9IkJhY2tncm91bmRJbWFnZUZpeCIgcmVzdWx0PSJzaGFwZSIvPjxmZUdhdXNzaWFuQmx1ciByZXN1bHQ9ImVmZmVjdDFfZm9yZWdyb3VuZEJsdXJfMjEzOF80Nzg5NSIgc3RkRGV2aWF0aW9uPSIyIi8+PC9maWx0ZXI+PGZpbHRlciBpZD0iZiIgd2lkdGg9IjM4IiBoZWlnaHQ9IjM4IiB4PSIyMCIgeT0iMjEiIGNvbG9yLWludGVycG9sYXRpb24tZmlsdGVycz0ic1JHQiIgZmlsdGVyVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48ZmVGbG9vZCBmbG9vZC1vcGFjaXR5PSIwIiByZXN1bHQ9IkJhY2tncm91bmRJbWFnZUZpeCIvPjxmZUJsZW5kIGluPSJTb3VyY2VHcmFwaGljIiBpbjI9IkJhY2tncm91bmRJbWFnZUZpeCIgcmVzdWx0PSJzaGFwZSIvPjxmZUdhdXNzaWFuQmx1ciByZXN1bHQ9ImVmZmVjdDFfZm9yZWdyb3VuZEJsdXJfMjEzOF80Nzg5NSIgc3RkRGV2aWF0aW9uPSIxIi8+PC9maWx0ZXI+PGZpbHRlciBpZD0iayIgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiB4PSIzMS4wMDEiIHk9IjMyIiBjb2xvci1pbnRlcnBvbGF0aW9uLWZpbHRlcnM9InNSR0IiIGZpbHRlclVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PGZlRmxvb2QgZmxvb2Qtb3BhY2l0eT0iMCIgcmVzdWx0PSJCYWNrZ3JvdW5kSW1hZ2VGaXgiLz48ZmVCbGVuZCBpbj0iU291cmNlR3JhcGhpYyIgaW4yPSJCYWNrZ3JvdW5kSW1hZ2VGaXgiIHJlc3VsdD0ic2hhcGUiLz48ZmVHYXVzc2lhbkJsdXIgcmVzdWx0PSJlZmZlY3QxX2ZvcmVncm91bmRCbHVyXzIxMzhfNDc4OTUiIHN0ZERldmlhdGlvbj0iMSIvPjwvZmlsdGVyPjwvZGVmcz48L3N2Zz4=";const dt=Object.freeze(Object.defineProperty({__proto__:null,default:At},Symbol.toStringTag,{value:"Module"}));var jt="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0OCIgaGVpZ2h0PSI0OCIgZmlsbD0ibm9uZSI+PGcgY2xpcC1wYXRoPSJ1cmwoI2EpIj48cGF0aCBmaWxsPSIjMDA3OEQ0IiBkPSJNMCAwaDIyLjc1NXYyMi43NDVIMFYwWm0yNS4yNDUgMEg0OHYyMi43NDVIMjUuMjQ1VjBaTTAgMjUuMjQ1aDIyLjc1NVY0OEgwVjI1LjI0NVptMjUuMjQ1IDBINDhWNDhIMjUuMjQ1Ii8+PC9nPjxkZWZzPjxjbGlwUGF0aCBpZD0iYSI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTAgMGg0OHY0OEgweiIvPjwvY2xpcFBhdGg+PC9kZWZzPjwvc3ZnPg==";const Nt=Object.freeze(Object.defineProperty({__proto__:null,default:jt},Symbol.toStringTag,{value:"Module"}));var It="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBmaWxsPSJub25lIiB2aWV3Qm94PSIwIDAgNDggNDgiPjxwYXRoIGZpbGw9InVybCgjYSkiIGQ9Ik0wIDBoNDh2NDhIMHoiLz48ZGVmcz48cGF0dGVybiBpZD0iYSIgd2lkdGg9IjEiIGhlaWdodD0iMSIgcGF0dGVybkNvbnRlbnRVbml0cz0ib2JqZWN0Qm91bmRpbmdCb3giPjx1c2UgeGxpbms6aHJlZj0iI2IiIHRyYW5zZm9ybT0ic2NhbGUoLjAwNjk0KSIvPjwvcGF0dGVybj48aW1hZ2UgeGxpbms6aHJlZj0iZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFKQUFBQUNRQ0FZQUFBRG5SdUs0QUFBQUFYTlNSMElBcnM0YzZRQUFBSVJsV0VsbVRVMEFLZ0FBQUFnQUJRRVNBQU1BQUFBQkFBRUFBQUVhQUFVQUFBQUJBQUFBU2dFYkFBVUFBQUFCQUFBQVVnRW9BQU1BQUFBQkFBSUFBSWRwQUFRQUFBQUJBQUFBV2dBQUFBQUFBQUJJQUFBQUFRQUFBRWdBQUFBQkFBT2dBUUFEQUFBQUFRQUJBQUNnQWdBRUFBQUFBUUFBQUpDZ0F3QUVBQUFBQVFBQUFKQUFBQUFBekFWbml3QUFBQWx3U0ZsekFBQUxFd0FBQ3hNQkFKcWNHQUFBQVZscFZGaDBXRTFNT21OdmJTNWhaRzlpWlM1NGJYQUFBQUFBQUR4NE9uaHRjRzFsZEdFZ2VHMXNibk02ZUQwaVlXUnZZbVU2Ym5NNmJXVjBZUzhpSUhnNmVHMXdkR3M5SWxoTlVDQkRiM0psSURZdU1DNHdJajRLSUNBZ1BISmtaanBTUkVZZ2VHMXNibk02Y21SbVBTSm9kSFJ3T2k4dmQzZDNMbmN6TG05eVp5OHhPVGs1THpBeUx6SXlMWEprWmkxemVXNTBZWGd0Ym5NaklqNEtJQ0FnSUNBZ1BISmtaanBFWlhOamNtbHdkR2x2YmlCeVpHWTZZV0p2ZFhROUlpSUtJQ0FnSUNBZ0lDQWdJQ0FnZUcxc2JuTTZkR2xtWmowaWFIUjBjRG92TDI1ekxtRmtiMkpsTG1OdmJTOTBhV1ptTHpFdU1DOGlQZ29nSUNBZ0lDQWdJQ0E4ZEdsbVpqcFBjbWxsYm5SaGRHbHZiajR4UEM5MGFXWm1Pazl5YVdWdWRHRjBhVzl1UGdvZ0lDQWdJQ0E4TDNKa1pqcEVaWE5qY21sd2RHbHZiajRLSUNBZ1BDOXlaR1k2VWtSR1BnbzhMM2c2ZUcxd2JXVjBZVDRLR1Y3aEJ3QUFRQUJKUkVGVWVBSHN2UWU4WlZkMTM3OXZmZjI5NlgwMG95NGhpU0tLak1BR0dUQUdneWsySktiK1VTQTJ4azdzSk1SMnlOK0JPSi8vM3paMkhJSURtR0FJR09NQXhoQmN3QTVGQkJNaEFRSWttbENiMFhSTmYvUDZiZmwrMXo3bnZqdEZvNExBMk9ITTdMZjMyV2ZYdFg1N3JiWExPVGVsSDF3L29NQVBLUEFEQ3Z5QUFqK2d3QThvOEFNSy9OOUhnY3IvZlYyKzl4NzNlcjM3Ulk5S3BkSzc5MUorOE9RZk5BVUVDYTZLcStNYWhUTmNlLzNyWDErOXI4NmJ4clM0VS9NYmY3OEFlRjkxL0gxNi9nKyt3ekJWVUFRd1B2akJEL1plK01JWGR1NkRRVU9mL3ZTbkd5dFdyS2czbTgzSXQ3UzAxRDEyN0ZqN21tdXVhWkYzOFd6NVAvQ0JEOVJlOElJWGxIVHRJcTI2WjB2LzkvMVoyZEcvNy8zb3Q3K1FBclV2ZmVsTGxVYy8rdEh0VTlYTmw3Lzg1UlhidG0zYk9qUTBkRzZ0VnRPZFE1ck4xV3AxRFhsWEVSNmpzQkZjQTFjckNnWjBQY0JUbVNmTkxHbU9kTHZkUTRUM2REcWR1enVkcGJzV0Y5dDM3ZHk1Yzllakh2V29ZMFdlOEd3UGJhblRGdFZlNTlUMkRLYjkreGorQndFZ21RVHhnOWt3cUQzQWlNYStmZnN1UXBwYzJXZzBIa2Y4SXdIS0JhUlpUL2loN2p2TjZCMEFXTGRUOWxkYXJkYU5TSzJiTm03Y2VDdjMvVGFScHM2OTF6OElNRDNVUk15aytSNzloUm1DcGdvZ1ZDMXgzWExMTGV2UFAvLzhKOVRyOWFjalhaNVlTWlZMS3RYS3liWU5zcUNYZWgyZWhYb2hMQjF3ZW9OMnpDQjVTcnNaQTdwSHVHTENiRXdUVVNWY094V1N2UzcvVXU5YnRQT3o4L1B6ZjdOang0N1BYWEhGRlFkeVM2a0pHNHl3YXU2KzFHcVo1UWYrZDBvQmlLNFJIRVp2V2RZTk45eXdlbTV1N21mYTdmYUhrQUNIZVg3U1JWeXJjRzM4RHM2cnArdDBzbXZqdDl2MzM1WDV5bklza011eXJTUHFPNmtSM0JCL0dNbjBJZHRxbTh2Mjg2ZzB5Z2NSV3o3K3Z2Yi8zalFZSXR2V2VxR2lRaHdjT1hMa0NlUGo0eTlIMGp3SDFiU3VwRFJwdFZrVUV3Z0dET2dlb3FJUUlIb1dSRGsrSGJpS0JQMllVKzlQU213Snl5bEpTcDFsalJGdjJUaWprWEs1TGRSWjJsUUpNTjJEL2ZTUm1abVo5NnhhdGVwelJXRXhPQWlmWnJ2MUsvcytDeXhUNGZ1c1lRUE5DYUlPQUdjWW92ODBSdkNyVVZOWGwrbmdWTHNBU1UzZWxlelByRVBQb1dUeTVST1ozVTJMaTcwMHY5QkxjM080K1JUTys2V2xsSmJhbGRUcGlBd1FXTzJsUnIyU0dvMWVHaDVPYVhTa2tzWkdFNjRTNGVFaHdGaFZTMXBIcm9maVU3ZG9VSUFwYXFYaXNIMEVWNlcwaGFpbjg3bUYyWVczalUrTi95blBGeXlFL3B3MFdJajd2cno2bmZoK2JOMFh2L2pGeHAxMzNxbU4wSHJqRzk4NDlwclh2T1lWamNiUVA2dlhxeGZhWHJVUW52YURJenY2RXBJQUpncVlMR0dDWjJsbXBwZU9IT3VtZXc3MjB2NTdVdHAvc0pJT0hhbWtveWNxNmNSY05TMHVWVklMcXdpakpaeTU1SDk1M3dsQTVQc3E4R3dDcG9uaFhsbzkxVXZyVjNYVDV2V2R0R1ZqTDIxY1YwbHJWMWZTeEVRMTFXckxvQktNbEVkWCt1M3N0eDBKK29TeHliRW5vTjUrSGZlZmYvM1hmLzFkSkp4MVNlQzg4ODZyUHVZeGorbmJlRFRyKytvcWgrWDNWYU5PSVZ4OWRuYjJueUJ4ZmhWQ2I3ZWgyaGw0dGoxVVFqSFFCMENqZE9tazQ5UGR0SE5YTDMzajFtcmFlNkNhRGgydnBJVkZwUVZjSktkU3BWYnJZWVVYcFFHWVFlQllibmxmaGdXVTRVNVh3TEVvMUVLS0liRm1rUnNMdEdxbzNrdGJWbmZUeGR1NjZXSG45OUlGNTZhMGVVTTFqWTdhMUZ4UnV5MlNsRUpFNWN0QjBFTU54eUJBSXJFc3NQaWJZMk5qN3lTK1hRNmsrN0dHVlJUM3ZmT1d1L0M5cS9Pc05YMzk2MTl2WG5iWlpiQWtKV3ljWjA5TVRQd0hWTlhEdmRjNFJjTFVHSjNhTmNGSWVWSlRhV0ZxTEFHYWV3NTEwNjQ5U3BsS21wMnZwZzRxNk5qeGFqcDhwQm9NYThEZ0xtTy9Bd3IwTXlDeTVDbEJFcjdsVTJvL3pFMmt0YWF5YnAvanZHeUJZU1hWSXZMaStCejFvaHFiMUhmcGxrNTY3R1hkOU1qTFVqcnZuQkpNMWRSRktsbFdDU2I2RmpNeWdPVHNMREVwdVBuRWlSUC9GaHZwejcwZnBJMzMzdy9YOXcyQUJNWjExMTFYWWJXM2ZkdHRkNSsvZGV2NjN4MGFhajVISWpIamFjRWRwOGt4SFplcDZvSWFnMXA3K2ZEaGRycHJSeS9kdWJPYWpnSVdHSkNHaGxKcU5udXBEZ1BycUJzbHo5NzlWY0NVODFsdUNZU3pBY2MwWjBvN21EZkNKTEtjbkw2VU1BQVRRTTBzVk5MQkV3bUpCWWkyZGRLVEh0Tk5qM2xFU2xzMzFjTjI2aUxOVkhFRGtyQkxYenVvd0FEUzBsTDdJM2ZmdmVOZlhYamhoWGV3U2w1LzhwT2YzS1AvU3EyLzgrdjdBa0NBcHdsQlF1cGdJUC95OFBEdy80ZTZHa2FVRjBUS3N4ZlM5WUhUYm5mUzNyMmQ5TTF2cGJUajdscGFhbFV4Y0RGMEFZMDJpaUloUmphUUN5TzRpUS9namg3TFFHcWpiaklBQjRBRU93Sk1aRDhOVk1ieGZCQTRaN3Z2cHl0WXJEbGttU2ZtcWY5NFNoTkRuZlRVS3p2cFI2OUdRbDFZQmV6MUxCa0ZVaURKak00bWJXZXRCaWtXdVA0TnM4N2ZpeWNETlBQKzcrcjZPd1dRRzVQc0c5VlZXYmZmZnZzRjUydzU1eDJOb2NhVEJJcnFDbzQxQklMTGNhS2hqb1VnY083ZTJVazMzMUpKdS9ma0Vlek1TSkRJVUYwR1RwWUNUbzVjUnZTNUFHb2ltVnFvbUgxSW82T0QwZ2hKNFNXVERRYUFDSWQvbHZzeTdTQmd5cnhsWEtUaFQ3U05zbXhURzZsekQwQTZ2dEJOMTF6ZVRzKytwcHNlY1ptU3M1NDZnTnU4ZlJ4aGJxbldsTHJZUnAvWnZYdjNLeSs0NElMYlZXbnM3N1dobzFYOG5WeC9ad0JTRktPdXBHbm42UEhqTHhzZkhYdGJ2VjRiQVNET09EUW0rMnMzZFl4ZFZkV3V1OXZweXplbHRIdFhBN1ZVU1VNQXgwdGlDN1RTQ2FBc2dRcFYwZ2RSQmxJZHhTQVlsVVlDU1dOWW83cGtlQWtBaSszSEVlN0g4OEJuL2Z2QmREeUlQQVBQeXpKS3NKWDVBdHkwOVRBendmM1R2ZlNqbDdmU1R6MjlteDcrc0JydHF5TlZhVC9sUkg5eWxXMW8xSUJHOHpNekozNXU1Y3FWNytGeERWcUc2aWY4UGI5czMvZjhHakFHRzdPejgvOWxkSFQ0VlJJVk1TMTRRdTk3cnloM2xuVG80Rkw2OGhkNjZZNXYxMU90anJnSE9ESlF4cFRVTGNFVG5Ta0E1R3BRRUY4QUVYYzJhUlMyRWFBeWE4bndZRFQzSmNOUEJZYlZsODhHMC9iem4xTFd2Y1hiTmxYY2taa01wT2RjMVVvLy9jeHVPbStiYXEyRzFGV3RVVmkrV21nMHBCR3p2b1dGdDQrTWpMeUdhTmJBZWtvbzZmYzl2YVRYOS9TNjdiYmJoakFHRnovLythOXVlY1FqTHZtejRlSG1ZOXN0TFpJd2tGRTBYUHhSd3JERG5iNzUxYVYweXhja1lqME5zWGpuOHk0enEyQ2VWT1IvNU9uN09TNERpaWVraWZOZlJ1dGd4Q0NRbEVZMWdITU1hYlNmcVQ0YU1teWpQck1wWWhBYzFuV3Z6MHhyODhzOCtKRzJpQnZNTnlpTnluamJwZHJhVDF2WUMwblhQbk1wUGVNYTE1U1FSbGlJUElvKzJBUmR2Vkd2YzlUa1JrNFkvTlFQL2RBUDdTNXB5N1B2MldXYnZtZlhiYmYxQUU5bGNkZXVYVmV0WDcvK3o5a2hYOXRxdFRXZU1YRWx2QklEcVFOVEQreGVTRi8rWDh5dzlnS2NjU2hMUzExN1VhZ3pCZWtES0JnbU1zeVBwNHZFK3VGSTRmTlRET3RCSUNubEdvVnRKSWlPVDdzUW1iT1Z6TzJEd25vRVNPa1RLRUZpNUVucEI5TU1oTTFmNXVtSGlTdkRwWEYvQjBzUkR6K25sVjcxZ25hNjRtRjFCbEV0ejlab1czRXROUnIxNXVKaTYrREJnd2VldlhYcjFodEtHcGNKdnR0K2tQdTdYUW5sVnhnZFRTWFBvVU9IbmpNNU1mVm5qV2E5MmxwcXQyQnVROG9KSHRXVEU2L2J2bndpM2ZxL29TaElxck5Ob01IcHVUQ0I0L3cyUUJRK2pCQk1PanRSK010QUtnQVZRQkpFL0pmNEE2cE53N29FUzUwWm5Nd1RRQWNPSUFYWXp2RCsza0FodzYwM2ZNTm51QitVTkQ0LzlkNzhaZm1sWDViVG9PNXBabTBIV0JEOTJXY3ZwV2MvemEyVEJxdm16alJ6ZjZtMEJTMGJTMHV0N29tajA4OWZzMkhOL3lna2tRUFQ0citybDgzNGJsOTk4QncrZlBoYUZzWCswQVcwZHFjTmV5cXMwdkFQcXRhSGFtbm0ySHo2eHFlUHBrTjNWRkp6b2hGZzBRYm81djNRQWI4QTBTQ2dDdkFJS0lHU0pSVytZWHNaamo5bGVBQklmV2tFdzJydWV5R05WS3IzSE13ek5abGxzWDBHVTl6WlFDUFg3dTM1WUJuOU1Ca0dnUlJBSThMbjFpM0Fid2ZRVDd5MGxmN3BQMjZuTFpzQmtTdnE5akw2M1d2WGEyendzS0RLR2FSck1hN2Y5YjBDa2VUOGJsNTk4TENxL0JvNjl2dXRKV2ZuZWY4cVZCWmtxSEZ5OU5EZHg5S3RmM01vTGMzV1UzMlVxV3lIbFZxTys3aCtLSUF5aUVwZlNSU2I3UGluZ0drQVNBRWVuOVBMRWtSS0s2TGdDazdmVzBBVDBYQ3Jpam9UVUxFQWlXMTBZcGJwTnFwa0hvWXBqV3g4eVhqdUFpaUQ5Mlc0bENKOUlCVnArL2VXTXhBWCtVNjk3NmNCMUlERDJWcTkxa212L1grVzBwVlhhQmZaZDlwdlA2QXBrS29oamRMMDlQUnJwcWFtM3ZLOUFGR3VPdXAveVArY0JwNGxObzdvc0x6MEFIcU1uaXBxYTlmWEQ2UzdQM1VvMVp2T3IxVmpBcVVBVDRCSXNKU1NxQVNSdmdUTS9wbUFGQXdTVUZRWWFpNzhIQlk0eGdmeCsyQVNQSUlvZzhxUjcycTJ6RDNDVnNqaG8zbGwyWGc3WXJ6WElDaU02b1BvRE05T1NrdmlrOUtmNGI0RWxpdmFkY0R0S1lIZFIzcnBYL3lqeGZTMEoyRVRLYUZKcEtRaU84bytWWnBEamNyUm8wZGZnN1Qvcm9PSStyNDcxMTEzM1RWODdybm5MdHh6eitGcjE2NWQ5WWVMS3U1TUw4QWo0eHd2S2QxeHc2NjA0OU9IVTNOeUNNYXhnMDFrUGtBb2FKYUJrNlZSanV0TEpPeWlaVW5FTThvc2dSUzJFU2haOXFtOEQ2YmxzRURxUzZNQ1NFcWcwcm1xN1N6Tm94eHVoeHc4ek80OWtpQ2V5elFZRzZDd2N3VUFUZ0lKOFgxQStmeGUwcFI1K21tTDh2cjM1RE5zZXdYTGJmdFR1dllaaSttbm44VTllN0R0Y2l1RVpLWmlHNmlDMUw5MjllclY3eXA1UWZ4RGZrbStoL3dxUk9maWdRTUhucnR1M2JvUEF4NG9GeDBMeWVOZWxiYlBIWDk3ZTlwL3crRlVueHlHQUd6K2RBV0J3NTl0TDRoU1JSUlV2UThPWi9BRTZqU29BMXpaRnpSNWFyOHNqU0l1QUZPQVNuQUZ3R2hLRVIrU1NXa2lGWWc3R1VoWmxRa1VKWTVxcmdHUVZIRXpxTFdEaDZxc3czaWZ5VmNDNEl3QU9RTm9Ram9LaUFJWXArYnJBOGNrNWg5SVoxNE43RHM0SFB2Y0p5eWxsLzFVRjRBM1RnSVJBN1NLSkVMOTN2TThacndmS1htU1cvdlEvWDNJQVZRdUVvTDZIOXF3WWVQbjZ2VkdsVjFsOTNROHRna3paSEl2N2ZqTU45TFJyNkMyQkE5aXVhczB3WFg2RHZHczJtS1NGdW9NSUFrdWdaT0hmN0czQ3VQZFkzV0RYZ1FvMmZSRkJSQ1FQd1c0U2dBVlBzTTRnR1RTQ0VjV3lzN1p3NDl3QmxLQWlIc0JCSzlnYUkvWldqVWRRYTFoMW1XUVJWMCtLeHozL2JCeDkzVmZwT21EcHlpbkJGdFpWdm5jZHV6QVBudnFveGZUUC9sSDNUU0VDZEJhbGtRZFZyTnI3WGFydTMvL3ZpZWNlKzY1bnk5NVF6TWVzcXNZUHc5TmVXNVBQTzV4ajJ0OThwT2YzSGJKeFpkK2VtUjRlSnlGcmpiTXFMdWZwWDJoNU5uOTJhK2xtYS90VDgwcGxuOVE3aTcwVlRuZnJtak9ZZFNHcWdQb1pDVVY4cVRnQnZDRGtodytqaU1aTGNyVnNscWkzSENVc1FRb1drZ0wxaDVUbHdWSnRtb1pzdGxWTUVadEIzY2g3Q3RhRFRxNU8zaEZBaU44bG9Ib25TZHJYWS95R3VNRm9NbEoyZ2tWblJWNWxNTVZaY0htWlNyeDNIZW54cDM2M0xTbnhCa1JjVVY4M0J1SHM3NDFreWw5OVk1Nk9uYVl2YlJMTzBoSktDYXRHVldjMEc0UER3L1ZtczJoNTF4enpaUGZ6MkxqRVhuMDduZS9XMHcrSkpkdGUwZ3VtT3JiRVpLdU5qMHorN2NUWTZPUG1aOWZiRkVCYjM4U2EwMVFkdi8xTjZlWnIreEsxWWxSTmcwMVVBczFCR05LS1ZUNlNxTitPT0RFN0N4OG9WWENLL3M5cXRaMUM5KzZRaDBXSEszZ0N4NDVuQUZrZzNDMHJZdjYxSmJSWndBSGxxaWE5dUljWWtWU21SWnJTTVNYRXFtY3JiV1k5cnNkY293MUpEZERTeENWMHFLVUhwS2lIN2F1c2o0Q2duUDUvdlIwY24wd3IyWHJtSGlsWFljcTZXbVBYVXd2LzJrR0crcGZFRGtnZWR3YUdSbHl5K2pHOGZIUkgzbnlrNS9jQVVSbzgveEdDa1YrUnhkVlB5UlhoZDEwQkdwYVBIWjArcTBCbmprTUg1WnpsQmIyb3NMbTRLR2J2cDRXYjc0akRVMk9NZFBpc1V5R2N3RVNaUTE5S2dHalh4MEFVRFhTQ1I5VkcwQkNuV2xZSTRjeW1FaXJlcXNhSjRpOGwwWmhWeEcyTHVMN0lrTHFGbUJ5OTAzVlYxZnEyVndrakFkSm5QbDA4ZUZyQmxISWE4RW1zODBqQTFub0JEQUNhZTNxWGxyQkVWY1hJZ1dTOGFZUlRBRlF5OVpSWEpSSlFBQkVIQW5ETCsrTE5JTnhOSytmMTN6ZXUvZWpnWERPMmw3Nm14dUgwc1RZUW5yQnM5cWtrejVLb2txRGdidzBOamJ5dUdQSHB0KzhZc1hrUDRWWHJIUWhzSE54ZUEvK2tqVGY4VlVhYUJoc3IxaTdkdTA3NStjV2tDMzU3RytvS0U1M0hiLzFqalR6bVMrbTZ1aElaZ3JvRWlReVhRVWx3ek40aURjdTdnZmpzMzBVOFR3UEVGSEZhWkpJd2drZ3l5ajhVanFGRFdXY0x2VGxzaDljVnJVaHBmSTBQcE5HQmdva21TVFRsRVprRHovQ2NMRUVpYjRuSHAyMUNaNFRiSTRLcE5qSE1oK3VMTStpUk1NZ1FDSk1kQjlVUGpmWnZhUXI0OHYwbmpEWXlZTGpLNTg3enhTZjBZd3V0MDR2dlBiSTZIQjkvLzZEMTI3Y3VLNWNhRHpyYTlvNTU5bi9Gc1dmUGRIWm5xcFRQVVhJNjd1WFhuTHh3MjRxRG9JcGJlRU8wT0FBenNMZE85UHNYMzRpOVNhbVVvZERkdDJRSHFRZ1ZSQ0JFYjg4aXlJYnczTVFSQmxNZ3NwMGppeFZEZmVDUllsVUdOcm15WUFjQUZIRTVmdDRYZ0tvQkZpQWlYeEZmRVlEWkJGTXVBQVRrcWRrdnBKSjIwUEdVa1RFQjVNQVVvSEo4RU8xa2MrME03TnVqMVJaakRSVEZIMW1VQWdVbmt1VEFLdjMzT1FCNW9Pemc4czgybU43RDZmMEwxODJueDUxaFRORitpRGd5UXB2cXV3QUxOeDZ5emV2ZlBUakgvM05rbmZ4OUVIKytVNVZXSVZkUEp0WHUrQ0NpLzVnZEd4NGVIWm0zbmVhZVBHUGJudW01ZWlSVlAydmIwb3JqaDlKM1ltVnFkTVlTKzNScVhDdDRmSFViaUtSNnU2bENod1lnczVRM0lmNmdxa3g5UjZVVGp4VVdqSEJoOGdvTU03WDEzcHQwcW5XNmdCQnFlUS9BVllDYXVBK2dKZWZzYlpNR1pZakV1d0dZVlVkYXMvN1VET2d3MGM2ajd6TERFRVZRQ29ZbWdHRXRLU0VDbHcwZXh5NkI0YzFKTkxrQkNjUXg3dngycEFTYVk3OUxkTmFUaDVBaFUrazhVRUh3K0dvWDUreUJ1TURZRVZhdytVekM5aXdNcVUvL05PaDlDdXJGdExtalp6V1JGblI3cXJIWlZCbHd4Yzg3TUkvSU9zMUJlOFVJdVI2Y0plWkgvUlZxcTREK3c2K2R0MkdOYjhOZUlyelBMWUhLV0duMy9QMjFManh1dFJkeGV2b2l3eEI5VUdBQUNMV2hsSkhFSTJ1U0szeFZhazFoajgwbmpvQVNxYkdTVVNvRXhLcFpIekI4SkJHQVNJQmdHU0NheUdSQkpCR0pKSXVTNk1Na0JKUTJWZHltYjV3U2tURGdpYjhMTEhDWnFJZldkM1JHZjhYQUpMNTNzczhEZSs0Y3BKQ0ttWFZKcmdFbmJhOGk1SGV1MzUwak1WSTE1UE1yK1RLWUFuU0JEZjc5enp2aDZra2gwdURHOS8yRldsS0lGbmZMQ0RkdEthVlh2UHlwY1JFTEFCdjI4blFHaHNmYWR4eno2SFhybCsvOW5kS0h1WU9QUEMva3VGQlhZby92ampSdXY3NkwxMjZlY3ZHOTNmYTNUb1NnU1pDSW51QzNkUDU3S2RTOHkvK1crcXRQeWRWT0xVUkw5OHBZejJ2d1VFY2lWbHBMYVQ2ek5IVVBMbzNEUjNlbllhT0hVak51ZWxVUXhKVlNOdHpzUU0vR0FId0tKeXdqSkRWcWcxWUgrcWpDSE55c1lwRXFpS1pjdHJNd0g2YXlHTmFuYTBORm9nRldWRTR3bktGKzVJNVZFdVlFdkZEK21EakdQWUt2Z2dDd3VINFkwa0N1NXhaNVh6bVoyWkJseVpZQWhnYnN4K01LK2FxMWhQcVVncFNUdENHd0VtKzhmRU1xUlRQOEtPbThqNm50NndSek9SZDkwQTNkT2dsRnltcHplblZxOElybEVQalI1Nzk3T2Q5NkpHUHZPS0F2SHl3VS9zSHE4SXFmQ3hBOExVdnZ2aUMzMko2T0RRek01ZWxqOU1XN0o3MmpqdFQ0OE52UjU1dW94UElVTm9mNDhYZTJYdTh1QnlhQWdVMndNdFVYNXhPOWRtamFlakE3YXpoaktiMitPcTBPTFUrTFUyc1Rxbzg5R0tvaVJvQWtSbm1BektJZUJtbUZDbDhnTlRsZ0dQZVYyTlZHOUNHVkZJNmhjUnhOa2Z1VXJLQmtOS3VjbDZuZXF2d1ROL0dLcUh3b2o3VmlWY2NlU2RjcWpWSE9GbnlzNkovZHRYUzlLc01MS1d5cSs3bTBlQmV0NHFaMjBRdkpOSTBFa255T01aQ21nUm9LVFBxTFh6REo3bWNwNStHOHFXamdOMUEyWDk5L1JEdnBzMmxLeTd0eGxZTTlZS3BUZ3VlRFY5NnlZVy9SV09mVS9BU3h0bkRCM1pSM1FPL3loWE5IVHQyUFArY3JkcytORE03WitXZ2dCRkZDem1wa2Fydi9JK3B2dU5ycVRjeXhaQmx1RXIxYUY3dThLbGhSNnhwQklUaHVKZUtESGUrU29DZHhJcTFZRnF4QVVDdFJkV053UmdwalUxRTdhVTZ5dXF1QkJHQW9relZXMzlOaVR6YVN6Mk5lYVpMZ3FyTDBBOGJLc0JJR0JRSXlyNVBucnorUkp6eDRTaVhUaGRkaWdFU1FHSklncys0TC83ZzJadENXc2hnN3BWK2tiNEFrak1vZDN5T1lpUE44RTRaandOMEF1Rmt3TnlQZTl0VlFNRXpUYU5EN2ZRTEwxL0FEdU5rSjdRU3pGeWQ4YkhSMmwwN2R2N1UrZWR2LzdPU3AvSGtBZng1d0JLSVdVSGxaMy8yWjIzZTJOVFVxamU0WU5WdnJZejJ0WWZycjB1TmIzODI5ZGFjbnlwTDJEMVFLenBrTGtGbUErbUZNNHd5UEpBQWVoY0FJazNYRFNoU09YcWIwL3RUQTFVMzJoaE9yY24xYVhIMXByU0laR3B6U0ZyanRZYkVDU1dIS0FnYlN2QW9ZU2lucGk4d2tKQytadGJwTE5JMlRQRllOOHAyaysvemhhUUNXRzVRYWtzcFVCd2R3cnBEV2w5SXpHMzFpU0N5RHFLNGs5a21WaFU1bFk5RkpieU1zdHhYbVNjODFDZ3VVNmxLTzBvazVMY1NhVDFyU1pPb3RpTUFhWUhqR21GclVmZ2drQ3l2YkVicGwyd283d1d0RW5wa3FNc2J1ZlYwM2ZYMTlKTS81a0FXM2JiV01udHAxY3BWYnlENDhUZTk2VTIrdE1uOGg0d1A0QXIrUFlEMDZhLys2cStHbnZuTVozSXNkYzh2Yk5teTZjM1QwN08waWdVWldsN0JybWtmT3BDRzN2cHJ6RmlZV2RtVUdFSDJPRmRsQjVlSExtRWYrY3g0Q0J2UHk3aTRML0laRGpiQ1NoTzUwQUlCT2lPVGFYSFY1clN3YW1OcWpVNVNOTS9ienRSa2JnWk5TS0VBa013bXJwQklTaVUzY0wzWGZNdlBDbW1EbEhMSm9ZUHE2OUF2RGlCSCtDUnBGZmt0MDdyeWROdGUyQjJCQXY0U1JkaXQvbFVHOVFOTXBnc0gvY0NrR3QzMzduMDJqU1E2emxxUzRCR3VneUNSaHBMaDNweHB2ZlJkZ0Q5Nm9wZGUvYUk1RHVwWDg3cVVCVUxGeWNteCt1N2QrMzl4NjlhTnYxL3lOcDdjenovQzhYNWZyMy85NjZ1dmV0V3JFdTl5cmZpcDUvLzB1L2xheVFyVkZaZmNaY1JXVS8wVGY1b2F1Mi9HaWtOMXFWdG9hRWtvQTh2aDVXckxPUG9aVndod2JnbzVaS0FJUTFnb0Z1bUtZVjdGdm1vY3Z5Y004T2JzaVd4NCs2SVllMEtGSXNKWFpRQ25VQjBCTWRwaFhIWXg2Q1NvZ3cvZjlNNFVRMzM2bnZJQ2ttMFdON2VVdXZQdDFPR3dmOCtwRnczeEZLQWJ4UG5ySEdTekIyYkhDNm1SeFZla05TNmVGMzRKaVBDUkZrb013MjR1dXhvK010UkQvWEI2azZhMHVGZmwyWGZwbFFQTDkzMGE4cXdmTHRMYVA1YytqaDVONmJLTFcvVGJ6aFl0WWJFTEFGOTI1NTEzdk9kMXIzdmRBanhPdkNGY05wTjBaNzlzeXYyK1NvVHUzcjMzbHpkdjN2Z2ZqeCtiaVkzU29CU3FxN3ZqMjJua1BiK2EwdmhHaUsrNHBPZ3p1TDdFNFpraktBOHRtbUxZaXlFYzhmRzhqQy9pb0p6NUkybjRoREU2SWoxZ1ZqcTFKOWFraFhYYjB1TEtkYWxkUXhMQ2JKY0VsRGhLc2F6S1pCWVEwNFgwd1Q3QXovZmFRVGp1MjZvdFg2MHBYSXU0VnFjR1EzRXVZQ0taRXNjbUtzUE5WTlgzSFRhYTdBSmlDUkQ1VmFVWjJrYlJ6dHpMd0VBUjdBTkRobVQ3aUphU3ozMHVELzJmWUVIUVY2VEZ1SmY0dHF4dzFqVjRiM3h4SDJtNTF6QS94TmNiWC9Tc3VmVEl5M3Y1U0d6R1VYdHF4WGg5MTY1OS8rS2NjemI5WHNuanFPUisvTEc5OSt0Uyt1Q1VXR05IRGgzNzR1alkyUG04bDBRekhiTjBBTmY0OEZ0VDQ4N3JVMitZbFN6bnVuYjJMRzRRU0tWSUhrdy8rRHpram9TeFBNbGRnTWYwUHNzdUF5VEFTLzJ1THkxdTJJNTYyOERPL0ZCV2JUUjBXYlZsd1BSVldnRWd3ZElIa2lDS2UwREU1dzBOdHdDVi9sS1hoVkxBcEROT2xWY0JSUFd4ZW1xTXNHdm5TUUNhS3BCMHFqUTBZMXpMUUZMZVJxY2lYb2FFQk1IUFFFS1lBaUNuL2kzYUxwQUVTekRPYkdWVy9DaXo4RTFUdWxnNUoxNmJhc1Y0bTZNZmM2eXlPRUNzck5jZEdSNnB6czNQM2I1cTFkUmppWm1GengyY1QrL3ppbmJjWnlvU2xGYjZuWGZ1K0NmYnp0bjJqdWtUSjdMdFl5c3dZbnQzZmoyTnZ2OTFMSEJzQVR5Y2V4N29XSFRTKzFPZFRTU3VEeFR1U3lJTXB1MC9qN1MybG1hWCtTeENMcFZzRUZnYTBlTGF0aUdWT3F4OEwydzhOd05KaWNTcnFHSHZoRFNTSVlYa0thU1JFa2NBQ1JLZGFmVkRFZ1Y0NmxrQ0VXNEpJb0RWd2dXUUJCUnhHdUIxUU5SazVqTTBpaEVQQUFSUkREY2xFY0dUcmlLaVpFanBseUFxYlNPN1BzdTZrV3BOYVJUcEN0OXdPUDQ0cWt0VlpqM1MxV2RIT0RIdzFDZk04dllyWHpNQlVLSE50SVY0K1d6bjNUdGZlZDU1Mi8rdzVMWDU3dXNxeHNQWmsybWQ4dzYyaVpvVFl4T3Y0bXNaVXNEMjBDcVl4Y3ZtUTEvNUpCdWxUSzFqTzV0b0NhSWoxWmxBVVQ1VDhzU2lYVEMreUdmeFFlMm9nQ0lzS0ZjWmxaYlV5SkU1VXdHaXFKam5zRDFXa0h2Tlpxb3R6YWJ4Tzc2U2hnK3NUUE9iem1NcFlCM3JNZGdVdkZVVTBnaGQ0WHBRT0VnZjloS2dBbG9SVnJWRm1Qc0tvS3hVYVNEemhnZ1hIWTAreE9GOFZBL05WVm9zemZMdElENXM1WHZUUTJQWU5KTXNJbUtlQ1FxYjIrK2kvU2l2M05YeVR2S3hjSlB6T0NWM3BqWU1qWmRvdjNYRVpSN2NZRmJMTHdGVWdsQ1Z1SkVQQWQ1MU4ydEQyK2M0NzAydnlHVFNEbXBlM2xMU0h3RWdlSGIvWm1UM0MwQis1NWlQR3kzZGROUE5UeDBlSGIyS0R6NXhVb0RoQjZNNGZKdmF0OTJhdWg5OWYrcGNjSEZxakMybTJyREZaZ29KaEJKTVp3U1NGSklRbGhXRXlIQmhPcGxCWktZZzFMS29EMEpCb1hMR2FiNGdHR25GdFlUVEZqTFMwbHhrRkVqMStSTnA0dHMzcFdFQU5MOFpJTEUzNTBvdG0wUk1xMWs0QkNnYXhJTkE4dUFhTVh5bk55YnNsRjJBS080QmtUV1dLK1NDUzJCWk40M3lwU1YxdnRKaW5zL096T0lhZklHYXlXSWFtUURBQ0VNWnFLQWN2SWlpN1RsRzhuanBPKzEzRVpMNVFSd2Y4VTJObU1LWXRraGZwbzBNeFkyMDhiRjErZHJTMFJQMXRIdGZsUVZHRms4OXNZV0FuSjJkNlE2UGpGejExWnUrK3NPUHVQSVJuL1NqVm1SeGNmaXMxLzBDRUI4NWtnNHR6dGErZUd4MEdHdCt5YVVWcFNTbURtcy8xMzhtOVU0c3BmbmRjMm1CNzNIWGVhZXJzV0lvTlNZd0xKdG1OU0dPSGtqYjZNMmdMM1VrWXNRSkFZS0VaYjl4QVFzaUlpK3pFWjlIck9uelRZQ3ZCRkdPek9raUw0a0NVT2lCSHJxa01YMkltZHVodExodUt4SnBXeXhLVmprUnhvazRKTk9wUUJJVVFxaVVSZ1dRQ2tBWlgwRjlMVXNvalY5QnBTVEtmc3o0a0VLU29MWEliSWl6ek1kNXN3TE5HbElwVmp6b3l5Q1FvcTkyczd5Q0h2U00vcnFhclRUeWd4QXVFMUI5MENub1o1RG5CVmtpNEdBTVFCZVJkZExmY1hjemJkc3lUM2s1a2pXaExodXQxVFhyTnJ5RUlqNVo4cnlzL3Q3OGdydjM5amdsUHpmM3JHYzlxOHRDMDlaSFB1TEszK1d6SzZNNFdna24yYWZxSFR5UXVuLzhwcFNtMWpETGdHREl5eTYyZGV2b0VtNGhkZGpoa0JoOG5BU0hLbENaMngrcjlNK2dLK09NTmsyUnFQQUc4dmp3bEt6bGZTUTJid1ppY1p2elF1R1FHRTVKYUVkOStnalQvd1BScHU0WTJ5Uk95Vmw2aUx4azFDUVA1aGUrZVNNT1g0NlY0U2l6ck4rMDRVNXVYOW1PckU1SUFaY1hPT1l4T3gxbVdpd0h4T0lqSlFkNW93WnFFVmk0azN6SWI1eVdoS2dNV2dta29wSSs3V3hUNlVnYTlPUmVBSjJZcmFXMXE1YlNGQ2NGbk84SUpIYnJMV0h6OXUzbi9IYzB6bkY0WC9YbklZaTcxK3MrSlJEZjdoRmtTODk4K3JPZU9qVTF1UVprK2pYVXZIQ0l1Si83NWxmVHlDS0xoeHNlbHJxTDg0aHJwc3QxQWNaL3dpMXM3ZGJ4VmxwZ2Vsc2ZaL1JQb2tyR1dQSGx0WUpRTUtTSk5SV0pvVXl6dVhiRGU1eHZRMFFQeW00WVIwemNtaTRTODVlSUlDQyt6NzB5UVdGb0JFd2NHWGpnNmdPcG1DTzc2VHJHQktCNWFIK2FQK2VDdERpK1FvTUF0WVo0cDM4Vk5MVVN5SDB4QVZPcU1pVlBTM1dtQk5MQmRXMmprRlRlUTZRcWNlWUpKNkNOdzdtLzVoZC9xOURFNWFRNTFtZG1qL2RRYTZpM0tlaUVhcU9JQUVuUmxlemxidGsxeXNpT1YraFlnV2NHakt1aUhuMUFGYkVuRjczMVhzZWpUQThDaHJtNWUwOERtNGlkQWx2SVFoRWYrR3pENDdWUGVjcVBQWTNJZDhKN1cwTEo5MzdkRjRBcU45NTRvMnl0akk2UFBkZlcyVGliVTJFaHJ6VTNsMzdqYnorYU9HK1lmbmpoVUxxQXFmTEdvV1lhcTZDNkFBWWY3Z1pRR0xNNktOVmkyYWcxemV2d2pQUWFiNTgyVUhYMTBhem1ZbzBFb3ZYQlpPOExRQm5NOVdhaVNkeUlpK2MwaUh0akJGRVEwRnZDQWFSb2I5em1leE9FTTAwTXZkU2p6WTNaWTZuK2pTK201c2J0YVc3ak9hbmRhSEpTQUxWRzRmRjZVUUJJc01SSkpEN2tuRUVUenczak1tQk1nNlBCOFV3ZkcwbmdDQ1RmeTdWZE5yMU5tUkF5cHZkeWFSNXBOTWVLY1FBSmcxdUpCQm43ZlkrdUZQMGhlVnhVR3lwTktkTEFJR29nU0MzY2ZIYXo3SzIzRVVXRXp6emtzT2VlSnBKb01UNVpITkxNQk9TWW1waDhEb0YzbGJ3dnN2cnd0T3VzS2t6MTlaS1h2S1Q3em5lK2MvdWxsMTcySDloSEd1R2tQN1RwVnZnbG0zVEhqdHZUejcvMzU5TVhKcmVuUDUzYm45NCtmeVI5ZTJrbUhla3VzZXhmU2NNc1hveXh3RFpNYTZzcWJGUllUd3ZRVGl3eHdxZVgwdEt4eGRTZVpZVVhzSVc0NWJtTGNYRUEzdDRYVndRSDdrdmlsTSt6bnhNc3A0VWlJYmVYQ1drNm4rZVVNdE13Nlp5aU1DanF4dzZsNXJFakdDZkRxY1BIb0RNWUJBWHBRaTB1NTFtK3o2QW95eElvMFJmOWNHV2RBQ2ZLS083SllKNDhVbklUdkVlUXAzblVtMHoxTXpkT3RVc2d5V01IVXppZWwyR2ZleEFDMGdjZ1hYUHltVmUweTdwMFJZU1d4TnhDTmEyY2JLWFZLK0NGQ0VaR3dXUDQyMXQzNmNNdStlQzExMTU3QkF3NEF5OUtNczNKMTMxSm9GQmZWejMyNnF2SHh5WldZcWxiRGU5MzVVSnUrdWFYNlcxS2oyRnRaYkV6RkNiN1g3VG0wMThBb25SaWI5ckdnYkVYREUrbXE5ald1R1I0TEcwWUhrcXl4TDBxcENYcmZVb21wQlJnYXM4djhHUStWSnZTcWM1WEtHcDg3czIzVldNeng1cHhoZkpDcWtFTUhqa0NIY2haQ2kzM1UybVU3NWJqYkhVUU1FcFJpZVc3SE0rdVA0VXFqV3FMYzJuOG0xOUJHbTFOczV1MkY5S0lMUUJWajJwTkNhTWtVcklvb1FaY0thRlVhZFZxN09sbjZlTzk2U0JlYktIUUJzTWVmdy9BVVo1ZmxMVkYycEtoMnZoT2tNc0FvOHpZL0RhU0R6VUxNdjJMdHBmTXNGVkVDUVRmZG5ISmdEM25MSW5zWUpRTUxVZ2piUVNUWTJidmdXWTZkOHRjOFp4ZnFtbTFPeE1Ua3l1dnV1cnFxNG04RTNkV05YWTJBRlhXenE2Vk5XbDhjdUlwdktOR3cyMHRIYVptcHZMcFUxKzVMcVZWWStsb2V3SFdTNGlVemtjWERUbVNhZWxCQ1B3N3N4elFuZUhMM2t3WFhqWTBrWjQ4TnBVZXpnYm9sckhoTkdZT0ZqT1dBa3d3RURCMTZYem5lSlpNR3VRMVZreHJ3eGxNTlhibUExREVCeUdsY201U3BrOFF5UmJuU3hJSGZmdUI4a21SUEc0cEkvSkpXWUxZUkFGWTlNZlF2cDFJcENOcGJ0dUZhV0Z5RllmaU1MQURHS294cEl2clF5QlkyeWVES3ZzWkVJQ0Z0TnB3b2RxMGp3b1ExVXJna1JkVDNzK0xGU3JQNVFMdHJkeE84d3FJR1daczgyeXFPdjF2OExrYkgxTkVYTW80STZMcHhBZ01OM2M3UjdNcWRQMUo2UlNFQ0c3Q0N0S0VkR09aNFo0amRZNlBzTDB3NnU1OUxwS3oweHo5bUhnS2QrOHRNR0R4UmFzaVRmL1B2UUtJcGV6S1cvN3FMUmE1a204WVBYNWhZVkVBMFNVL3BsMVBkKys5TzMzd20zK2NMbHo1cUxUQWhtYlJOZ1FTNzVDVFNFbUJtazBYTTIxdThtOEJJcjFuWVRxOVp3NzFBQUIvRWpEOUdFZFlyMlF1dTIxc0pFMElkTUNrWklvWFdlMGhBR2t2c1NVUlo5VWdEdEtveHJKQWplMkNHdXF4cHBGQW5DTXBDRXI2QUV5L2U1bWd5eUR5Z1QwNG1SN2xuYjRNc08yT2xaNTFMTTJuaVc4aGpUYWRrMlkzWWh1eDkxVmg0VlFiTUl4ckdRNkhUaktnUTBJQmRuMUJneVRLL2pLSXNqVHlSQk1BNndPSk1qSGFsVnNhL2g1NDA1ZmhiVDR0TU0zWDlac2pMQ1M2aG9SdXNNL0IxYUMzZmN1WDhXQTdkWTg3SG5MNkVtRVVGOTIzbndyMzJZVmFPbndNd0l4eHpJV0h3TE1xcit2d25KUXJ3Y0NzdENpbiswVVZmZTllQWZTa0p6M0p2YS9XWC8vMXB5NnExU29YTGl6RW1nRm4zcDNtVnRKdE8yN2p2RUZLdzJ1YWFjNnpOZjBpTTN1OEYzM1VubVp5TjlNRktPWVJBT1dJKytqU1hQcm9BajNrWXdWUDRSejBzOGRXcHNjaW5iYVBqbVl3b2Q1OHFiWHRGekJoUWtWd0FLb1dPK05MN0lvSEhRUVVVa2t3Y1VRVFJzRUFxU0pWSmE1REx5ZzgwTGdJR21rSnkvNXkrNHM0SWlvWTJaNkg5dURaOE40ZHFYNzhhSm85QjJrMFBwVnFBTjMzS1BzcWphME9nVkJLbzZ6V2l2VWhRUlFnV2ZaZEtlK3JRSDcxcVV5djd3WnVudjA1UzhzZGtGR3FxQmEyVVd1K3gxZmJBQk5iSkhZakpJejl5a2x6OTBzUVlaUzdyNjFLYy9VaUFBU0orRThka29uUDF4eHFwRzJiWEc2eFA2a2lyL2srNVlYeS91bFAvOUViMlozWGxLR1UwNjk3QlZCNVpIWExsaTJQbXBpWXFqcDlwd1ovQUlSRnJIYjY2bTBjMmVCY2IwdVJmeDhYZll4cmdhNHBpYnpPUTlXTklza2M3WjlzTGFaUEh0bkZSczJ1REtaeHdiUWliVmN5OVRoZ0Q0Z0VVMGN3TlJ6VmxBR2dNT2hUUjhrWTlwT2owaGtOWU1KbzUyT21qREFZZ1hnS2U0Z3MxdVgvZlBVRDNOckM1ZnV5dlRrYUNVR2JsVWIxaFprMGVldVhVMlBUdVdsMjNlYWNEYUFyRGxRc0laR1VSZ05BWWxKZWdDTkxuMXFvTXM0M0lpWUVsVUNLRFJWV0F3TlVBK2tGa29zSGluMTZicGNwRzZaVDVjSXh0ak00THpUa2IzSWd2RU1hK2J6c0NZR0lZd0NFUVk0a0dnVkU1YUtsNDh6TFJjOTdqdFhqTktRQWM2eFNCK2VFSnV1Yk5tMTZGRWx1S0xFUUdVNzVjMjhBcW93YzRDZHB1UGpvOTJNc01ReE1DS2wrbk9IY3pmVzMzOGpyeVZ0Q2ZVWENVd3ErcjF2ZlkxK2tQUE9lQit4SE9iTHFGV0E2REpod3p4aWVTTS9tYlkzSElKbTJqZytuVWNEVTVpeU9ZT3FHUFVKdUZrSUVsRXNGc1dUQUZHWmhZWTV5QlpTZnkxVTZNVTBQUUNFUjVBQ1hPTTZBS3FnZXNmN3hlVzVYUENkOTVHRHRxQmZTclpwR2R0MmVHaWVPcHBrdDU2ZEZwR2VvTkFaRVh4b0JoVkJaU2gwZGtqZExtQXdpUHpLZkpaTEtDaGNTeUREUHd3a2M4cEEzcEJGM3FqS1hCcFFZQWluc0dOVGEvQ0VXNVpCRXpiRXNWZ1JYdEYvU0VIS3NoWEhObXlEdWR3a2k5K1BvWWpnQmRHeW1sbVlCNHdyZTgzYzg1UHpWTkRZeThtanYrQktzSk1pRU1XTGdPaU9BMUhsdmVNTWJURGJhcU5VdmIvdGxibWhxdktQNjBKRkQ2YnJkSDA4WHJuaFVta2Q5UGRqTEZubVZZTEpQZ21rRU1QbnNZOWdmSHp1NEF6QlYwejltSnZjTXdQVElzY20wa2RuY01NUllLc0NrYW9zUC93ZVFBRHUrci9XMmtZNThnREwxRm1jcGo1RUtvQnJNREpzQXFsa0NTazRFWSt4aUJnNVY5eS9iVVFJcGhqUXM3REU3ckowNGdqUTZrZVlBMFR6bmpyUjIzVmR6Z1RDbTkwZyt3UkRHTlZ6MU16V3hWaFNBS3NEQ3ZOczBOUUdGeFJoaEFRVjRzb29UU05ueDlodGhUdzBvRVRNNEJCV3RTUjBtdmZQemZPSkZhVFNFQ1U5OHFHOGFiL3NGRUlJUDZaS05hMmQxdzM3eGxuSllNZUdZQno4QndXN1Z5aW1WVEF3WVptTnNTZFdibDVOOTlET2YrWXg3bi8zQjF5Y09BWFhiYWRjM3Z2R04ybHZlOHBiRUNiVU5WMTMxK0g5TnpqRTNGU21rNG5kb3ZuN2IxOU4vLytUNzBzYVY1NlJGRng0ZWdzdU82aHcxR3VKenVMV0FhVE9NWGcxb3IxdGFTQitaT1p6ZU5uMllEcXVqcS96Y1VqT05lLzRHeWVBaVBOdEQ2SGlJRno1czc5OW5RcmRnMkFJenh0bldYSnBodVdHZVY0cU1zK1k2ZGRWVmQyVitZays3eXVtUmJBT01FclZ4ZUgrcXQxajNHcDlralF1cFFYa0tPVnFSM1dDNGpDdjh2Q2FVMDhYTVRiVTJrTVp3dmdjQVpSNGFKWXR0U2p3WFVHSE1BQ1JBcE5Ic0tqL2lVT1FISUFTRk16TUJJNGcweUgwVzIwdTB6MzIxVlJPZHRHRU42M0ZhMzlLTnY3eTAyUndaSFhyZmIvekdiMHlEaVlRait1U3IwSVFuUi83OHovODhSYVRPazU3d3BDMDBkVzNMVnh0dEJjVjZFSHZudnJ0dFBkZHA1WjFjMEhkd1ovRktwbU1ROVFROVB4ODFjQVZiMlJjd2t0ODhjeVE5ZCsrdDZTZDNmVE85NDhpZTlJM09mT3J3bmNVUkFGVkhPblFKZDVpdGRWbTR4TFpGeXlHTktOQmxmN2NuMmtpZEJRems0KzM1dEgvaGNMcHJabCs2WTJaLzJzME1jUnB3K2Nacm5UUTFwUlBNY1pTWGYzT2Y2YmNxRGNuUmRVWjRaRzhhdjUzaklyUkxwdFQ1M2Q5d1ZmMVdhbkxmQ0o5d2RhbnZHdnc4eUZCbGdXV1BSZEprUCs0cmkya1lOeFRQZVRHdzhJZklPOFRwK3libERqR3pheUxOR29VejNOUys0amVuT2tmbU9YcXJVU3h3QkUxMkxnbDRBbm1KSGZnVG5BdWF3WTVxOFRWODB4dyt6dXpQc1NSUHlTalBPZXk2OWdsZ2dNaE9nUWtUbkhTZFVZVWRQTGhPL3JWWHJGbTduWk9IRlg3ajAxVTJZVTBEV254S1pDY2Z4cUZSRUpycTRoSnhPcTh5THQ4OU5IL3o4b0FqTXFXTGtFckRXSTc3QWNHL09iNmYyZUQrOU1MbWVQcUprUlhwNGJ3NnZacVptU0tjaGRZQWptTE5EZUJNeUF3Rlc2NW90MFRWM1h4M0lSMWhBYkdIUmg3aW5NVWs3NlN0Ykk2bENkUnBBd2tZS3BGMGZrRkUwWmJsQnNBaXJ1ZUlSNklOMy9tVlZGMjNQUzJ1M1JwclNlZ0JwSkd2WEpPNlZHazBJdHRGU2h1V0tGQlhlWXFQa2xLbGFTL1JyNXBHTlg2Y2dzVDN4R01kcHlwVHdibGVGQW9RY2VmMFc5TWxIRTJ4bjUwVFRGbXdGVGxVelV6U2tVT1BTU3VQWUZzc3ZzN3c1b2RiUjVoeG9jS1lXTVpNamI0aWlDc2RlRjliQXdiSThqa3djVWFzbkRGeTdkcDc1Qk9IdWtlMis1c05FQ2t3b1hoZjREV2RBek03MDZYcjFxZEpOazBiL0VxT1A3cTJSRU44NTZnRVQ0QXBXcnNjWjVuZnlWVVUxMThhY0ZYN1lkZ3p4bjhBQm41Z2NTYVdDZjVWY3lJOVlXZ3liV052emtWTlRsQ2dxbUEwYmN3Z2twNklmQm9iUUNKL0VCOUNlejhQaWc0S3BxVkRhYXcybk5ZMEp0SmFOcGttc0o4MGg1RTk1RFdIUUtKL01MaUx0SkpSdFFPM3BhSFpJMmxwNDRXcHcxcFhCbEcyYnZLMFgrRGdCQXZTdElyVWNPWEhrNDBWVjY0RkRzOUttR0MxRldFV0hBa1ozMUhkQXFZNGRzdlVXeUNoT0hNZmFGQnNzTm9uWGlYdm9sN2JmaEdGdmIwUU5iUTQxTHg5eDgyd1FLa1VVbjM3RGNoeFhpa0tnTkVyZVQ4eU1yeU5vbEtKQ2NPRDE1a0E1QWNUZ3YvWU80b3ZLUlNFY3AxbG5obk9nZGtkYWZYb0dqcmo1OTRnQjdUMEk0OHQ5TzlpT0JqR2ZjQ09ra1FqYmUwaktjTGVQOGpMeHVrWU1PbDQwVFpYd0VkWUxmZitOeFk0UGI1NE5MMndQcHArSENCZGlqUVo1NW1uK0paZ2pyTVJGWElHRVdDZ2RRSW4reENXWng3VTF6K0NaTnJIdVlzS0tGeFpHMHRibWxOcFEzMDhEU01wWE05cVFXMmg1QlVtTTN1RWlUM0IrcDFmNE5YUUMxTmxhbFBBeko4QmljVkhWNjhCalZzZXN0eTFJSUdCSEFud3RFTUs1WEFWVU9XMWFXVk80WlJvZ29jWTNjbVNTR2hhVWdhSDZqdnNOTTZNdEhqcFlRbFI0L3YvSG9CVGdvWXdMWml6Znk4ZmZXQW1OakhHTTRnVFF3TkdOV3JOd0VDQkNjbCtFdnZPQkNCcDRjWE10N1pCMFc4T0cyS3hjeEJ6dXYzTk5OVzhrRmxPQ3pHTEtjY3pmejRTRXlTTk9yS2g2SkpBQXRrNlIzOFVZdlZjSjdYQ3dvbWdpQWQxV1phdVhBR1hIcGZBWE9NK2dNSDhBV3lhSzFCNUwwU0tYSWxLV3MyaW9PQ1pwMDBlUFFseHIwOERiR1lBaWVmNkFzT1RjNTZFZHhmOTdzNTB1bTMrV0JxdmNDUzB1U3B0QjB6anFEc1p0aVNRN0lRK1JyM2gzdDZ2cHQ3TUlkVGFSUlRoRjltQXZBd1VNS1Zhb3dIOXhVZkNEbEpCRklEQzFsRWk2VHFBcVVZN1ZHMTk4QUJ5Nlo5ZmVDeWxVQVpSZ0psU2NoL2dEOGQ2aDlxTGFZNjl5UmFTMU5UUlhJamgvc0p4Wm1Fek04M2VodlZ6ekxhaG9qU2dMM3dSWmlQZGMxUGhqTmRwQUhyOTYxOWY0ZmVvVE54a21yakdFNGRVRkZQNEVrQ0w2UmdmZElSSjZIaGhsUnRDaGJRMlcvdm9WWXpKTWQ5cGdyb2hsZGltWU5ZZG96NndVZ0JHVHllZmlpanJ6dGRBeEVDd2ZIcWFUeEZSeG9sb1ZkNlhHNGJJZTJuZy80dEVTa3ZIMHkvQ3lLdXdrelpnUTdFcW11WXdoUGtlRFczUElNcWpOMHNqdzlvditxcXRQSHI1WGpSdzJybTRKODVCWGRKWWxTNGFXZ0V3UjJRSmExdEJyMmhibDkzTXpzd2VEdGdCb3JXWGNSNXFmZGc3MGpTbSs3RFJkK20wZ2ZKV0NNQkJ1c1RVWGZzbkpGQldVQjNBMUJGTXFyQkMrcWpRSWd3b000am9Sd0JLNE9oS01FRVhUa2YwVU0xRDh3ZlRISU5wdG9FUkM4R1VnRjErZzZQZFdVQTY3eURUSm5wQmo5Rnp0cE8xTkgvZnZna211bUlEZHhJclRnT1FQYi81NXB0TjFHUXpjNnJqT2poRkZtWVFOdENjQzYrOFpvSUNnL0NLdSt5eXloSk1KWWljTW5vSW5FOFdvemJRdGJTcmxFcHg4QXpBV1pGbEJ3Z0p4MFdrOFhhd3ZFcHd4SDA4TEo4VWFaZHYrOWxDS2hIdkVabDFqRjVYd3QvTVhvRHVSUmpIVHdCSW0xd1BnZ0ZMQUNVa0VnMFJDTHF3ZGNpckx4V3l5NENxODA3WUxDejZWR3QvK216cm5uUjVmV1Y2NU5DYXRKWnl0YTBXQVVEMGlkSGVZY2EydVArR1ZPWFl5OGlxaTZDSlg2YjFVSnNNVnFWbEVDbDlza29qTnFSUk5xTDlabEplRDFKaEZRQWFVR1dXa1VHRlQxOWlNeFcrNkplU0tIZ0VFWWxLemRiaE5OS2RUOGNhZkxBQ2lVd3duWGZwSC9NeE1HcnZiaU1GNjM2V0NlOFJHaXU0YVlLSitlM2J0eE04K1RvTlFKeklMOS9BNEFja0syUCtyZ1dFQUNVNTQ0S3pEUVNhS2l0SDIxQkJJSkFLSUlRa01tNEFUSXlBSnZIRHZMYXJmYVM5cEpwanJ6UlVYcFplT1U4UFpwcTN2TW9nMGZtU0VPVkRmRzdqR293ckUvaU1hdG0ySzJad1NDVFR2US8xcHZzSkpORVRzWkUyK1U0WHFrY2JTZHZHQmJzK2NDSmNBRWlna2IvTnlCVmtqVUs5ZmFwMU1GM1hPcFFlMzFpVEhqTzBPcTFCSW5sNmNRSHd1TFRTcTQraytSTjM4bkxnZ1RTeDZuSit4WGxEU0dNWE8yVld0bytrcU9FTWlaQkdBYVFzWVp5UjVSbWFCalFTcVpCQTJRelBJQ3B5OGd3Z0tWa0ZrYnlKd1o3cHBySGY3QjFQbyswVDZkRGN0clRxNFgrYkp0YS9FaVA2dmZTdUwwSEJiVkNVRGFzMHhIN1kvR01mKzlpUzFFVGxTNVBocEl2WGxyM3Z2ZWhGTDhLaVNjTmRDR3ExOFU5Q3N2STh3aE9ONTNBQXFSa3VnMHBnTlZCZnpYaXU3M01hckk4a1VocU5zbG82emp0VGs2TzFORFhxZ2lCYkdjUVBSMXJ5QTdZNnpuVVlsMkw2anRZYWhoYkxjVVg0cERoYVhLWXpYa2R4NGM5REl0MEZqUGFMY0grSkhmZHJHTjN2WGp5V3ZrWGYrS0ZuZmwrUzJTYSs2V0wvanJ3TDVvTUsyWFhEZDdGekJvTHJON0c3Rk0wZmJoMUkvMkhtVytrdjUzYW5vMTFVQm5GZUxTVVNJR29UdC8vZzM2YTloMjVpaEdPWEFObzZhcFR6bmN5RWl2VWoxNUVJTjFuemFjUzZFVDVyUVUzV2hocTRldUViYnJDR0ZEN2hacXduNmJ0ZVpQckNEWVpkajZyeFRTWm1mRU4wY3RzbEgweHJ0cndhKyt3S0FEMlBEQ2lHSVg2eFREUDA3R2Uvb01tWFdIeWxQZm95K09jMENWUStYTDE1TTg4cWpXd1k1bGpMYnJQeUxJRFlXd3lPbEpJblVNNXpHNkEweWRLb2xFN2VHMWF5NEN1aEVGc2EyMDNVbkxPaVVpcXA1clNiZkdZNkI0SDE4ajk4Ri9ZY3B4RmpaSEVOQkdsWEdWdmtXYjd0aDdUZXpITStpVjJGL2h5UzRGTkxKOUtUQU1JalVER3JHYVdLZnpjNkVaUlpHbEgzY2ppM3pYTDZxbzJHVGlDUlhBQjk2OUxlOUQrUVNzOGRXcGV1SEY3RnVsV2Q1UWRPRndUU1IvbEo4RHZTb2NWZGFkM2s1V25kNkRZR0RQbVVSclNGQlR3a0RSSWxabXlHbFN2TXgvUUJZcnpnQ09TVVZxbzI0V2RJU2FRTHc1b3krSDEwYUo1Vm1qVExzMHM3dzhzUXFvMUhmREpWTi84dU50QmwxUHNON1NCSklwMWRzU0VORk9BcnJ4ZGNzRVdjeERPZkQxNm5BWWpsNmlELzFOQlFEUHdBQWptQ2lmNWh0UGoxS3lXS3VqdXJMeXRUWGVrUWx3UXlZTXhuT0Q4elRSa08wVXE2RENTa0RranBBRXFYQThvbEFUZjIrbUNpakRLdkhiQjhhTExjSzU1SGZQYjRXMFJFYjNKa0FNOUNCaTZKS3NPM3lncWUzUXlEUHRPYUFVaU5kRDcyMFpoTTRIbFdXWUNHdkNWZzNEcFIzZlZWWFR6TDAvcE56TTRZeittZnplOU9UMXM4bEo0L3NqNWR3a0U2VC9RdUFxUWU2MHNveTNUN3NjK2xQWE4zcFcwVGw2YzFnTTB0bVFBUzdZbkZSd0JRQlVqNWZUWFVKdUYyckJkaCtJYkJMSkFFVGdrZy9BQmdqc3ZBOFpsOG9Nd1c5dGZvZEdwZjhGY3ByWDQvYTJNUEF5VDBpbm83dlRqT0d0U1JTZ1dwcWtOZ3djZ1NHNUdnK0hNYWdJcDRpcE1GRk5NdktRSmhRSFBLQWxWRXAxaXhzcEtZd1FTQXlGRUFxZStIeENsQnRHd25aU21WQVJlU0JqQXBpZndVbTM0YlcwbndsSURLUUJKd2pxcUJadGxPRytHUUtkc2NvWHhmUkM1N1JicUk0SSs5S3E4MmJWM0x6VHFvK1UyWWZDdUc3a1ZJcFBVTUZIK2tWQWtxNExTUE1wQUV6d0NnaW5BWTRLU3g3TWNCcER0NFYrN1ZzM2VsNXk5T3BHZU9yZVBGZzFHZUNSOVBOMHlrWXhqaGV3OS9MSzBmdVNoZE9INHBKL2hXaGtFZlFLSk5ZUjhKSkozL2lHc0Q5Q29MUGNnanlzRUhOUG03MlNXUVdOeWtIL25iU0lDc2l6RlBmVE1iYms2TG0vODBWWWQzOFdidVplZ1laS3dUQXJaQTVqUklTU005cFo0OU1GeTg3ak5BVUI0VzE3MEJpSjgzbWxXUUFJZUN5REtOaHRmWlJPVFljTmc1R2hvQmhBSTB3Vnd6a1U1UStXWUcveGs5QXNmOHVZenMyemlaWWh6cEJBWTNxaTRYK0FSTzdOMkV6MzNFUWJnQVdVN1RMOVB1V2s1MEt2Y3poNHRlbm5SVHhKMzB5QVJGdmtqTGg1ZTR0L3c3QWRKZTJyWU9CbkZ3QS9ibGVpUjFTQ1o4UVVTekFoQUJMRExxNjZaSnhiaFBsMWVIMHArMTU5S2ZIYnN6dllxUFR6eWVyNjJOc3VXeWdOcGlpeHBicHA1MkxId3IzYlp3YXpwLzVQSjA4ZGlGYVVWOVJVenovZjFVTjMwMWpLVjVIRFlMTUtuU0JKU0dmMTV5SkFHMVpxbFU1NWhJQmNmbnROS3gwVHZUb1ZXZjQvMjlUN0MzdGhWRnNnVkp0c1E1SUF4OTNJR1pPOUxXS2FISlNLRXZCSEpIWVEzSGw0TXF4SngyM1J1QUtydDI3V2FnWVdGR1FZRkZDbVRKbTFrTEdNTEpmS3FqeUVDWlNMQi9CVmhLaGxoam45RTJqSnRsNlVPNUpmaUlqM0FCb0pCQ0pYandCNlZSQnBnZ3lrQ3lhdXNvNjhxaDR2NWVid1lmWlBBWWs0dko5NVk1UlE4Rnh3RWFkNVQrdW4xU0VzMjBncWdFaXhLbERFc1RuMFhiOEZWbkhxTHo1NnorSzJ0U2Y3RTBuVjQ2dGlhZFB3b3NzYTJjOXRlckxEWlN6MDF6WDBnM3pYODFYVGg4S1c0N1N3TnIyS0xoRUk4Z29RMHhtRWpYSmwvK3pSQTJQQ2cvQmk3UGxlTHNxNmVaMnJGMHFMRXY3UjlGNm96ZHlPUmxsRE5WRi9JQ1JKdU41TmswTjlNS1NlWVJGL3VLNzNwZldKazBPWVE2aG5UcnpqdnZkSXdzRTRtYjhpcHBVZDc3Rlk0ZUo5RXFmLzduSDF6Nm5UZis5cUw3TnhadWdYcWU5RU9pUitGT01BUlNXRndBdDZ3aGtwc2U2Z21Xck9JeU1VdEpFMkFoVFFaVDdyeHgxbFZLTUovRmRnTWMxTWoyNTY5TGxSWUE0M21XVkVYWlpJNjIybHdiY2NwMWhxaFRVaFMzQXdrTityMEl4bklBYVNZNlJFK3BBRXJIWlYwMEpUdHU4dHJMY2x0TUpHMjB0Ynd1eEw1eU52ZmJNd2ZTank2ZVNFK2NXTUhLUG0rMkFDS2x4VWlWcjRrZ3oyNmMvMUw2ek56bldSTFlrTFkzdHFaTmpmVnBWVzFGR3EyT1lmaXptb3pCcm5xeldGZjc1OGg5bkpJUDE0K2xlK3A3MHBIbUhaeWszTWRodlJYc25XMU1KMWpKUGRSam53NXBaaXVkSFEreHhTUC9iQm5DSWJNd2lFZFEzbmQ3aXgvLytNZGJZa0pzUkFjRy9wd0dJSi94S25ONis5dmZ6dXA4YjliM3hibWlTS1hITUI4R24rQ2svNlRISm1LRm04b0xvTWhzMXc2eUxRTUJ6UmwveTNxemJyWEVlQnJSaGdpVVNTS1BBRVVGS3E1SnJLL1U4MTJ6VXdFVVFCSlkxTzNJczQwMnRpajZwR0tqRTBYNVovS2lwOUcyd2FmUnVpaFFZamtBbEVpeEtJcTRVUXJtL3BDa3JQZWtXcGZMaXZMNTQ5S0FaVjNDWUx5QnBZUHJPRkh3QWs1ZlhzRFhUVmk4WlZzRXlVQ2FzZXFrUHpiQ2Z0eDB1bVArQnI3OXpEa29jbzVYeHRJb2JyZ3lRdDB1Z21LL1VPcE05VGpMRDhkWW8rdXd4UUxRbGxaZzU2eE9SMnVzR2RYdXdYNVZnN0NrZ212Z1dQUm1hUUUxeU9URlFUTGM1TldNWWx6UVRIODloLzUyZVdjakxZa0pmZ1Z4dVRORjZEUUE4VHByYjhZdFdqTHhrdG54TElGa0IrQ0FTZXpRcDlVcno2VWI3dUs2V2drUlM4NUl3SEQrTVl0LzlQbGZnTXN5akJYMW9RcUQvRUhhSW0rUkZjYWNhZHBmcXJZK2tFalhZZTJwakMrbi8yWDFBMDNJQlVlRGNxT0VjNjY1SDNtR2dLTXpXa3o3Q0VsMGJ2MW1SSk8rejd2ZkI2Sk1jZHBsNFR6SVl6QUR6VFFSelIrbDBDYkV1YzgvaENSNkdPZVRIajB5empHU0prOVVhN3pKUzJWdXBLNENFQ3Y1NStMa0VwTHFCSHpsOUJMeVNrWHBlaGxUK1M2dlNsVTVxdzFORnFIelVuT0p0VFRYaWdBTU5LcXhOaGZMVXV4OThYb29aWEV4K0h5cGN6Zjd6NVVMT0taSVc2S2Zsa28rREdqZWZFaExuSkd1SUlWNnhXZCt6Qm5YYVFCaXJ5Tzk4WTF2OUdHTHpJZWRQa28zZTJuQlRYYWthNVZWQUVKdEx5bm9BRVNLU2dVSElqNVVFV0ZmY1BQMVpvbXJxaHRDYXZsN1ZuNVhzR3hvYUFUelVjaHkySkZ1bkNDaTdBQlRqak0rYkIvS2RqVzdSZm1xdGtFVlY1WVRlYWs5dDQ5R2NObVdmRW1wTW54ZnZ2MDBlZUhiSm13TmZ3L0RSZFI1OXZsNFVXUjVJQTBVZHhKNGNyZmpxZkdXSmlPRjhVV3NBN2tnK1RFK3N2Nndkak9kTXpRTTg1MVJ1ZHJsd1FNQUFEVzBTVVJCVkZ0UG4wc25uY2dYUHcyS1RaU1ZrWFc3TW82a3dTaTN2Q3JyQVZVLzNXSWFXV1g3QUk3U1hETTdla05aMHQxRnhZTzg3VEhDTVJqdjR5bVBYSTlDaVBCaVgzeVpwZkxhMTc0Mm5nMytPUTFBUE96eEdSZlRjQ3kyZmNDT1dxaWR0UnNOM3VCdlZOY2luamlsVGVPVUxISE9Ca2FHK3BLWkVGVHc4R09GYVlvZmxSdm1lMEUxQ0cwNVliUElkRkFRNmNrdkZnVkdPSmxqbWNFazY4UVZZVzlVYlVqZmVCUEIxMzZIbmNwQ1VVSEVUNmZqTXFna1dnQUpSa2QrTStmLzlpM2lJbUM0REF6NHViK1p5VVpIbWlJaHJZdjhkY3IyeUlTRG9nbVk1amlNNXJrbzY0dExuNElzSzY0aTdMMFNPT0w1QTA4RENFM2kxbkt6azAzcS9SaTY1L0x0cGNsNlpwRkY1WDdZRm1qRmpVT3pkTWFWVnp5SEptZzJpSUNqVEFSVXJzaktjR0RUUnNSZzlyMjFGY05yZUEyZDR4NHgrbk1kOHI2MTFPYkVYbXFEQ1plT2x5dmh4dXRNQU9LQU5pOGVrWGhoZm42UERTMHZDMjlVaDFraTM4QmgrbS9DZUg3M0M4YjVpckwrMG1JK2F6TXkya2dUZklWamFOaDlwd3lvRmtaREcrYUdmV1I2YmFWVHdDUEFySTdvQWxBMGduQjJ1UjBSTGhwa2pQZjBNMFEwdjV6TzcwTFE2VGprNWt1S3VZNStHZWF6dkVIZmNIR1o3djVjU2g4disyWWU3YUlHUnNRUUlKcGRaUHVEZWdXdjh4bXZuRHI0RlhmZXk1eHdaZGhVL0tjbzFGQUcvZTJjQTEvSlR2azZWSnBIYkMydEJFN1VuVnNROFZFVGVjdktMRnRSZ3hESmp2dCsyRGdTNVBxWjJiRzdNRFYwY1M4QVpNT0x5N29XRitmMmNOc3JNRkUrNnZ0bkJGQXg3NitjbUo2KzI5OTV0NjVnQW5DdXNaNHhYTm1ZRHJiK053Z0hRSXo2bG0rUDRvOENuSldyaHdNNEhnVllZbjFoaVdlRElJc3d6N0tFa05DUVFpRGhsQ0lDeTB2VktTQlVmZkVwM2R6YmVHYUt6TGpsZk9Wc1RNS3l2RUkreEM5akpsUWNaY3JrM0llY09kZGlPUDVIdWY0eHphbFhSUFhqY3lESFphWkd1VVRFUGlBZ21nZEU4Nzd2WDlRNVdKN2Q4TkpBamR6aHkxQWM4ZjNuTU5rbGcxbGswMDVlSWxpRndUMkswV2k5TXRaL1NoL3ZTNkNHK2luS0l6cjN6YlFrT3NuWkx0U1psYW1tRmp2SDBzYUpSMnRFUTZjTUlJdVI5ek1uWnUrbXBNcTlyUVdkRVVCMzNYVlhDTDc5Qi9mZGZkN3MrVEpUQVVoTFdDUm5aWFdzdGhsZzdFajE3cFlBanlKOHc2YlJOTG1DbHdESnVjQzNsRXVKNDFzQzJrR2RrRDVaVWdtU1VGZWs5VFZtUWVYc2c5OURTOE1qZFg1cUE0TVFsWmVubDZaMWxPdWo5Z2hMcU96bnNNUXAwNFE5TktES0Fvam1qVG9sdmgweEgzOEdydFB1ZlZhazdTZUwrd0lCUGk0eTZlbkFEck1jTm8yUlJoeVhBa1RhWnZrWmovcFhXVUtweGtyUTZKY2dLdVB5Z1YwK0ZNNlMzQnpHOHppczBJU0VERkZuVm1IY0ZOS3UzN0dpVFVyTEdLRFdYbGJNYnIvbWgrL1RhVXZOTHUxTUd5YWV6L1lVNzkxNXpBUTdnZXgrOXE2M2Q4K2VYZVNzRnBpd2xKT3VNd0pvY1hIUjlqV3Z1KzRUZTY1NjdPTVA4cU90YS9uNGtQU0tMazQwTnNGMGQ0VlRXZ0ZvMW16Z3BUOCtHdVZvWDV6SHJDc1lwblRLNENtQm85MUQyM2tlYWcrbWFoOU5yQjFLSTN3YVZ6dkowUlhmRlFxMXFLUVNMSU91WUFqcCtpQ3lTM2FaOWlpeGxENllEK1RsR0N0dGNMVTEzajZnSEpQWkRUdGorRXhYUkJmUHlpUmwydEkzWHhuV3oyVUNJT3BnYVFYcHllSWVVK1NGQUJGdE5VMmtNeU11S0Zud3RBd1ArSmFmQVVVa2wydkxnbVdhbWRrUVlkZWxsdFdaUlZwb1VWN3hUQ0VqamNKcTF1ZUtOcHNVYzhSQjZ6RVBYM0hhTUxXZFpEVXc1VmRJV0wrdTF5dnpTMHVIL3ZxVG4xQ0YxY0RFR2QvZk9oT0Flc3ozdTlkZWUyMzFuZTk4NStGLytVdS90cU14MlFnQTVRWjAwdVR3ZW81ZWJPZjNRWGtaYlRXZmJPSExZOEY0M3ora29XSGY5Q1hQTW5oOEZxOGpBNHBTM1FrY082OEtES2tWd01tcUxFc1ZwUTRNMENpbTk4RUVDWU1UaUprV1JYd1FxS0FVUkpRQnczek53dE9UU2lhQnBMTzhUT3JNSE8vT2VsbFgxSVJmSkE0QVVvZlIwU1lMSU9BaXFNWjFuVDRLWkcwamJTSlZyTlZhZHhSUmxHTVJ1UlVDUnJXbW4xdWpYejR6Smo5RnFsR1BTeWVxQlJzUTNlRmUweXp5NEtNQkl6Nis4S1lVSXNLYW1RTWI4SCtVN1N6UVNjaUdsVnNzckx6NGxhMUdtcDV1N2ZpVFAvbHZoOFNDbU9CaDJlb3kzWm1OYUQ4bzlGdS85VnNtbXAxYldQam0ybHJ0c1REUDlqbXQ0K3pPcXJSMnhaVnBkTVUwbjM3QndFTnlLTFN5NUZIS2xLNEVBcytvV3VLcG5sYXZHUWwxcCs1ZVhHRDFWVW1saWdNODVVSmtWams1ZjVScnAzRUJUc3VYRVVWM0pIeW10Q1MybFVWYTAxQ3V5VFFnQlZPVEJSeWxVY3dVUzZ4RmprejhJdGhuWW5rdlM2SWsyMkdrVE5IenZnaUV1aUJPb01jYUYxTnB2NHJxZEQ5bWh5Rk5zK1FvMjI3VzNPSitGOHF1aEIvUGlnVFpvMHd5Q3hvbklXcXVaV2xxYWZseThEbGpqVmVpYVVPV2tFcGVlSUY5YVVvbDFGSnZJYTFxWEpEVzhKTmE4dFlIY3N1M2VCY1dGNzlCc3JtTEw3NjQ5aXUvOGl2TGhSZDE2SjFKQXNWamJBZkoyNWsrZnZ3ckdNUXZvL0h4djRzZUhtSXRhTzNVNVJ3TCtKK29JTmFFRUt2OHljeG5wR3YzQ0FBWkh6M0ZRMXFtaVpYTnRIYjlTS2dyQVNQb0FpaWt6ek01cC9kazBjZ21iNVJoRVlTVklONnJva2I1K0ZTRDB3QXVFempLWThSU3ZrekpqclMwM3ZvZFhhcEVBYU5SYjdnMHNrMmJwUnh0SmR5L2NtZjduT1cyejkzQmRMa3U2elMvekNuckw5UUwwa2VieUMvTjY3SkJYOVJwM2RacDNuN0ZWbVBsc3R1TE94R1NZL1ZJYnp3NkJWK3BJbTNrdXc5eS9mam1oeWhaR2xrV3hqSXBzSjJMUytJWTEwelRTL3ZUSmV1ZTFGdkIxMUZZOTR0OEpJcnowTWVuajMrRk1POWl5cjB6WC9jR29ON2RkL01qVTdSeng1MjNmM1hyMWkyYy9mWVhHeUFWaG5TRmJ5Q3VITDQ0SFczOER4akl1UlFNcjFCUDBabUM4WVN0TmJZaGtGQWEyS3ZYanFRaGpHUm5hR2FJOVNOQUVYWlNvYm9FaWVDUitUcUI0eldPalRYR1o0T0hPTW5vR29halBOSVc2ZVB0RVpMMjFSeDVGSm1hLzAyWXFPUWI5WFVZaU4wQ1NBc3NPUWdvNVlqTCs5RlltUkljc3VYV3UweTNBQ2t4NVJXdEt0SXZnOGMybDIwQVJIQ3NpL1JSUXRmcFg1MHB1U0R5ZkhndzN2d0J2RnhyVkJrVlVHLyt6NTF0eUdEd2tYZVpzdVFodjhQY0k3T2g0cUVYLzZQcFJZbG1pWHNIaWpEQXk1Y2dnemdIRm5hbDU2eC9KR3ArR1BYT1YrTDQyZ0sxMWFhbmozZjVlWEErd1pKcUJSWXMrYlRyM2dDVWJybmx6enBYWFhYVjBLdGVmZTBkTjMvbDFqdW5wa1l2NExjeEtFUVRuWk4zOVhQVE5KdDB5a0ViVjlvOUlUVzR0Nk9DUnlreE1kbElLMVpsVzhrV1JHZGxQTTcwZlNBWUxvRGpNOHRZc1hJb1RlRWFuR2tLU2FTNkN5WVUrU1ZhNUtGY2ZWcW82d09KbXpMT3VpM1VJN2NON0NMcldPU1R4QXVvMFFCMWpOcVNXU1MwQVdZcC9jR2JlQklSRVRwWkN0RW0yeER0WXB0RkNjUk10Y0ZnYVBHT3RTdm9makRjQVdLNnNuM2hsK1VTMzYrL2pGdU9pcEJKL0g1UmxBT1NIQnk2M0phQkFneWFWdEFRRHBDYmp6QnpublRCeGt0ODdDUC85SWJROWNlUEg3L3oxZkFlRE5UQndoa05hRE1wMmM1MDlUaEUzWHZHTTU3aHN5TzgydnlGQmxNOCsrc284VUQzTUVldmhpcDgycmZIQWp4RG9GeE1sQ2xlZ3FlSm1oRThTaDhOYmUwUFJXc0pvQkk4QVRyeWhkUXBxRGhPK3EzblRxUXQyOGJUMkRnNEoxNURPOXRLZ0tkUWFhRXVDUStDVVJVWVpRVURLYmNvTzFRajROTllkKzFLUXZNN0kybHFSU09OKzNGMGdHVTl5KzNJSUJZL2RDZUFwSy9BMHNiSnN5MW5YQm1VNWJsdisyM1lRM2Y1SERnTG5JU0hHUVFqbnYvR2pZUTlsdE41ZnJ3OFF4NXJTYW85eW96eXJhdDAxQm0yVmVGbjlXaGFIUUNsSFB0Z3ZQUzMzZm1TSnpqL1MxOWxHSEptbmtQMWw0eGYyZHU4OWh3R3BjaUROL0JZWHN0ekVoNFJBMkloRjhEZlU2NTdsVUNrWTFPVjc1N2hIejUwOERNYk4yNzZHYjRDVVN3b2N1aTdOOEpMaEk5SU03MnZNZEkyaGFxUndZTEJTOXRFdFRHRzZuSEc1WFRkYWFQcW81UTRKWUN5WEhYa3N3aEl2a20yUDFhdVpVR1MvRzU1Q0paZ0ttVXJLZnJHdHIxRjJ2bU0vMEVjQ1JSZ0lrSmFCUmxsZnJTS1A4VGx0TFREcHBMSWR0Vmd3RGhBTlc5cGIvbTR2SlJDMmVYQ0xHL1plQzlUWmQ5NnN4VEFwNUpRdDZneloyYXFaOHV2NC9URDVxTVB1VTNSbkdpM3FzMHJNenlYZThhLzFrWHZUS2ZFRTJEMm9ZckxFaEE2a0RIYUd5bHoyaHBiOFB2bmIwN1BmZGkvVGxOOEc5dHZIbVM3aVE4cjhHbVhnd2NQL0MreWRjQ0FXUWRKY1ZJenpncWdyMy85YnUyZ29ZLy96NC9mZU02MmM0L3pzYWtwN0IwS1U0MnhVdHErTkUyekdTU0JTc0liNytXSUVBQnVad2lrOGhYb0lLaWRLNXozTXNaUjVtYXI0SmxDM1RYSkp3SGNNdGJQSzlnNVh3Q2tJRkFBcUtoZmNFbUVYQzhidDBnOGpXN0w5N0pwcGExbUdiclN1SGJGWE9kc3piWlhrUmhsbmdnTS9DbUt5MXdwNHZ0eDNBY0pBSUNzODRQK0dVQzVIL2FsalYyVTFka2dpQVQ4c20xa3NSbUVXZFVVMWVTeXk1dlNwMExwSHAvam93eS9ndWFQM3NSZ1F3UUVIY3UwUlFrdUlCNWcyZVVSMngrSGRLMzMxMy80N21RTjlYWDhiejcybHplUXBRNEcvQUJVZEtsZnhFRGdiQUJLSC92WW16dS85RXV2ci82bi8vVDZuUzk5OGNzL3YzTEZpcWVmbURtaFZLcDNlVDFrdUwySmtYUVpVOEc3WUhEZTlaVkJNbEhHYWYvb0JJOGp2SWVFQ2dhZUNoN1NLdmJIVVhjVC9NYkdDSi81VlFTN3R4YlNDc3oyQVVmZTB2aVdhUEVjNEpoLzlXcE8zS0g2ckRPRFdydEFpWmVKR0F5UjAyQ0RLbVBoTWh2WG5HMlNzY3dNRnpnYlBJOWg0RmZRUkY0QXNGUUg1QW1nK0lkblpmaFVmNW0rUEFubVpoQUZtS2pIRC9sM05LNXBtM1ZxRTJtNzhJaDJsTkxFck9ZWFdIcUZYeFpPWEhubFlNNFhSam1qTWVoQ0p6T0lDbWxVNVBHdDJBVmUwMzcwMUNONzUyM21JeEMrdHgrRjlUcDhUS0YrNU9qaHo3LzViVy9lV2ZCZWZ0L3JkVFlBV1YyMzJZeGZaRzRkT0hEZ1krdlhiM2c2Y1NGOUlBRlRTZFJZNjNHc2puNkJqdk9pSEFTeHM0NTQxWUlnY0N0QjV6dGVqTzk0THJPVUhLUXFubk9VQU5DTWpUZjVHZ1NmMTFWMUNSclRCWGl5Mml0dG1YSThTTlFtZHNXS0ZjTnBFa05iVzBDVnA1cFV6VmxHMkVvU1A5UkU5dnZNTUo1V2VDL28zWE1ibTZpenFzNjc4SlFoa0JiZElFYlBEUGJKdnRFVG04Ly9aUW1YVlVCMEsrTHRZYjZzcDJDd0VvbCtlZml0Z1NHZHBSRnREaEJsdWtnYndXU2JCL1BSVE83NVo2TzVTai9mTGQ4Yjc5ZENZcjJJT2tvUXhkSUlCVGZZanJwcjVtdnBwWTk2UTFvNXNZclpGeDh0dFlOMHg3U0hEaDdnbFkyMENPOFZ3M0txcUpIUUtkZlpBR1RTM3Z3dDgxcmdJKzk5MzN1dSt6Zm4vTnNqSXlOanE5Q1hOTVAzSjd0cHZPVnJJYXNoQ2tlZG9zT3VrTG8ySTNWdFZPSEhQUVdhQmlsaWsySkRFWjJ0RkJCQXcwelJCWS8yazBzRFdicEExRkppRlJTektJMU50MDlXc0hrcnd5VzRYM1ROZ0tQWFJJUzZ4SS84NUkyNjlhUDZBVWJZVWRQYktQN2JaTGRWSnFZNC9jZjc2U0VsaXRtZmtpMnV3aXZtTHRGZmx4ZHl2Nk1JYnl5S3k3K1duZ2VRZ0EwcFJKM2FSVzJOWUFEVW4xMHFoV3czZFdTYWt0dDJTenRWSS9IaExOcXd2aGZQdk92WFl4bW9NcVZhSDBRQVJQN1kxa2RmZExYbE9mR2laWlZ1amE5cEhEdDI5TWg3M3Z0SG42R2d4aTIzY0FSeW9IakNwMTBpN0t6WG0xRmp2L3FydjFwNS8vdmZ1NU12dGY1UFJCeVYyaVNoeVJ1UTNiVnByUHZEckRZZG9JTytzSlpyN0hlVWRIWTJpRmpxZU5LWTMwN0VXUnJVanpNMGJaWTY3OXpIZ1RQU2xNQlJCVm11bDFKTmtMa3NzSFlEbndSRzdha2VnM1Rta1dnUVNTRDFaMm9SVjhRVGxoa0JUbWRrMkQwdDE0UncrbkZQbkN2a2kyd0tPenZockJjQTUwM2FxVWFjYjVwazlkMVptOEJWWWc1anJ3MHpzMUtOdXNBWnl3VE1obHl3ak5rVXZvRE1zeVhqYzVxWXJTRkJuWjJaZnlUSzhhMlhyTktkd2VueWVhTnNDc1FzcXl6WDJaaGhmSjNoTUIyUXBGRlh0Q0huazc3U2JZUWZKSjd2M1phdTJmN1Mzam5yejBYeStZMXZRZG50eWx0NUxLL2x1U1pNcHZxOS82WEtzMTZ5dmp2TnBnaCs5ZHUzMy9xbmZMSHFIM0hNbFRkMmZJUmpPWFJsdWlydHJQS1NtZ0FoeWlYeWVGcU1sbElrT3lLRHdTYXlRTUNRYmFRTUhBbWxBUnVqalNUOTZYNlpudnd5d3YyekNZeHRwWmI1VlZlTzJEQ3VTMVdnclVSY2pHUWxtR0dCVTZSVFVqUUFhNU5wdkJMUGkwZFJodVhGcWpIK2t0dnB2SGducUQwaEdHZHF5Q3RpSFFCZWhmaVBPSUZzUDhPTHY5N2pjcGV6UnpoTENkdEQyTEp0VjloRlNpSWxSdEVmNGlPTmVYRHV0WlhTcWFTVDhZYTlDcThJa3haZ3hYT0d2SXV0UUozRncrUHBTWmM5aTZXRDRjb0NYN1hWeEpDbi92cUFQQ2F6UEhmSTZuTEJVZUxwZis0TFFPYm84WlhPcGVjOTcyVVQxMTc3a3M5LzRmTTMzN1JtN2RvcjUyYXhqVmpLN0xCN08xRmhZN1grdEhTczlrbk9DSzBoaTJzc3VXWjlHYVBqZnhBakNBSlZ3VThlTVlER2tlTjNucldWVEd2aVU4RW1vMXlKZG1uQVl4OURqQ3FaNVZ1anBiUUtFQldBQ2RCRXhRV1FDS3N1Qlo5bDFKRVc4cmFzSi92NTNuSzBvVnBzdDh3amlUU3VsVTRaT05wdUNIMGRCYWdFREJqMnVWNFo2S3UwSEJsUC9HTVhWVG1leTdHSkFhQlFONmcxZ0JRMm9DRGlZZlJKdFFZeGc1NkNMdWhEVy9FTmw4NkMrZCsvTXJBRW5mRU5QbWh4SkYyeDRTZDZGMis5SXFSUHRJOHFSa1pIYW9jT0g3eEpIc1ByQmp3L1lRdjdCZDFMNFA0QXlGZDlPcHpLZDBvL3ZYZnZuajlHQ2wwWlhZbUdNM1h1RGFkTlF6K2E3cTUvRUUyNkFVTFMycUNtSFJUNU1vWGNCWVVqYk5Na3RvU0hFZkVoQlh3WkkrNkRJRUVkazVrbUw5YXBMcHppSzVKRCtrQmtpZE1IVHR6bk9Mc3YzNnhqVkJYRWd1WUVUdkdlQWFLaHJjR2RHUlVncE00QXVBMGdzOTlVYnZMbHJNbHVNN1krRnVZQUU2L0hLS1c4K3BNRm1HLy92SS80N09XdzZleDdFVGZ3S0RnVUVwdnN0WkFTdElXeTNEdXpqWDBBUlRoTDhHd2UyTTRNcXR6ZVpZRFpkSy9zNTlvRWFvMjNPSTYzdnBDZWZmR3Y4WTdZUk1VdnJYaWdyT1RsM3QxNy9waHMweGRkdExIeTRROS8vVDdWbDNYY0h3RFpuTjc3MzMvRDRpV1hYREwybk9jLzR5Ky9lTVBYL3RuVWlxbHRuaHRTOUhVNEVybXFjVkZhTy9vODFoWSt5L0hMdFJBc21wWEZiY0VVZ2FEWUNkVkNxU0hHYllXWHhQZWZJQ0taQkIrMGU2Uy9ObEk0VkkrcVR0WGpUeStVMGtjL3E2M01LNDEwWDNWeWFqL0pScTVTeTFyTEJjOHlYK1FoYnpCQzhOcGVxSjk5N3RsQXRzUXdyRjIxeHRZVGRIR0tRQUNTUG85ME80V3pzWkVqQjJPUVJKLzZqK0o1L2tNL0RUalFZTEk3VWZGR0x3QlNLdG5HREtKaWtBUXRyUy9UY2ZrZHVpSXVtbUE0TjZXc0NHT0JkOGVPcHUwcmY2SjM2WmJISUgyY3VrYzd1N3o3WGo5eTVNZ09lUXVQRy9DYUkvYlJyR2hhV2NhWi9FS0xuK25SU1hHOUhUdXVhMTl6elhNZGR2djNIOWovYm42QVJhS0ZLZVJaYWIrMmZ0N0VNL21VMnpHa0NJd1NBRFNRL2tLQTNIbGJvNW95VGxkMlVqK1BvbHhuMkJybUo5NU9DcWhzZ0dZYnlhVjZtUm5TeWpva3FnQVFRT1lodlNwUnc5Ujl0RGl6cE1vS1d5ZVhXNllQQmdWNHlLdnhyU3ZMSzhBa2tFM24xSDZSMytyd3B4N2N4UnppQSs2dVhVMGgxVmF3ZnVVaTZCakdkVG1qVkZyNlhZSXdoTjFpb00yMjY4eE9RNWcwdU5qT3dMYUxyUWtuR0lSalM2VGMvaWdNZFY4cXlBWjdUdXVnQ2pvVjVTelg1MlJsaU0vNjNaS2VlUDVMZXFQTkNiOEJEYkdsQlZNZmVMbC8zOTUzeTF0NUxLOEpROG43dnU0M2dDaXErNVd2ZklaWE1WTGpXVC81MVBlakwzY1BOVms2WnB3NndscDg5MmIxeUFWcDg5aUxlVDl5RjVaOUFDeUFVVEpKNWpwaktocHU0OGt0ZUdCKzMvRVV4RWhrTDhFZ1VHSXRpYmhRZFdFck9SWE5ZMGdCWVIyV0Y0QWozaG1Pa21jTU44UTJpc3dJbzdjRUIrbFZRNUZQQU9tS05paDVKSjkrcURxbThMRi9oa0d0eWxPQ0NTWm5ibjRKZjRtend5M2VvbkEwQlhqcFlnWko2ZWYrQkVNRlVlbnNUN2lCZE1XekFCUGhQR01yUUZRQXlYMDIrNVAzendSUENTVFQ1NGxKbHRBRklIa2RmYW0zSjEyNCtxVzlpelplV1ZuaU5LbnR0SWZ5OE5EaGUzYi94SE9lOW9HSmlZbEd3V080OHRBQ0tHcTcvdnJyVzcvOHk3OXM0ZnYyN05uOWRqZmRvQmxUSUI5em9aUFBuM29HdXBiRDJVYUgvVk13QVpIdnFUenRGbWMwbVZsa0lhL1NaOW5sd3NxWlVSYi9CWEFDU0Vva1lJSUxBT0VIRUNNYjhUQXYzcjRFMis2L2FTdUZ2VlJJbjdBcnRIbEMybEN2NEtNUmdxVUVqdmNDUm9ENStic1JQc2syUGpiRWIycnhFd25PeTJsdmdJZXBmbGFIUkZHbUwraUZQUldBVkpJVlpVT2t1UERrRzkySVB1U0JrZnRXU3FXUXJ0QW5KSWxnQ0VBVW9JQjJmYW5rOUQ3dVN6OERLYVJTNU1sU082YjUvRjVJcDNKNzcrcnpYdHpqclJvK3lVakRWSUUwV1I3dTJiUDNEMmpXdmxlKzhKVmRlVXk0YUhDMCtxeC9OQXJ1NzJXaFhVNHJ6di9Zai8zWXhIT2U5K1AvL1licnYvcVNsU3RYWDhRckh4MFlXdlAxa01ubXBuVHU1Q3ZTN1NkK2k5SHdDQWpLYTdveWdsRWJZSUI2RFdaQ2k4eHFwR3NmT0lSTFhlOHBuU3lwY3RNY0xVcWxFa3h4THhNUUtUSkJLYWFUT2FhUjZCSlhzT3BranVtQ1lvVzBDb2IzZ1JPUGdteUMwWkc5YXVWSXJJeTdyaU1valEvUWs5LytlQXhrbG84VHpNejRoUXNsdnRKVmlVSmkvdWZXS0JHWHd6UXU3bndXUVc0akppcndFU0RtcjNhUTlZWHZMTTMrVVdiUXFoaVVFZlpaMlM3U2FGVG5nV2tldzM0WlpDUk5MMzRtWGJueERiMHRLeThwcEUrWUVXeGJqTlR2T1hUZzF1Yzg3K252aDZlTkQvNzFCNTE1VWRMOUIxQjBsUXozOStyeHRjN1crZWVmTDBvUDMzNzdyYitMQ3MxRW9DTVNvODJQejIyZmVDSWY1WDRTSDlROHpLaGtWUmx4N3hUWWxXS1N4YUV5Yk8rZ25nUXp6bzZIcllTdk9vblhjRW5ETFJjRTkyK2ZBVGxPVUpTU0ttSjRIbkZoQzJRajIrZTZBSnIxaEhRb21DS0FySnhMcWVZVWZ4VXIyMXZPbVVqck53T2dLZkx5WVVkYVJ0dFlWTlN4Yk5IalJUeC9nbkxWdW1ZY045bThaUkliYUFUSjU0RzFiS1QzMVdNVW4rdXdFOVpqMTZPZDBYNGxVS0hDYkhkZittUjd4b0hVdDIwaXpPQndnTVFnS2NOSUg1NHRxN0ljYm5LdU9kWG0wNHJSSCs0OVp0dFBRbVAyTmNSR3dTdDU5KzNiYnYyUGRQK3dQSlczaEl2R1NwWDd2aDZJQkxJMEMrKys5YTF2blgvbEsxODU5ZUtYdnZBdi90ZW5iL3prbGkxYm56SjlZcHF2dDFYcXpsanFxTEJMVnJ3a2ZlSGdQK2Q0eGhUVUFtUkNGZUtGU0hZS3pzaU9MUTBMcEVNeG9nU1JETUJwYkNzOU9HNFVLL1FDcWVBMWpaQU91WittR1p3Nnk1aFNNaGtPcVdXY0NDUmZBRlVRQlhneU5HV29COWEwbDBZNTBtRTRacEdreTlLdEFGemM1N3haR3VRMm1INFZVMzBzaXBpWjVka1pzME1UQmN0c2NaWTYwUjdiZ2hzTTU5Ymx2MUdxL1NXUjNWUzFsdTNWRDhjRDI3WXNkVmlhaUQ3bHRtWTFOY1NTdzJmVGs4LzVVRytzc2FxNnhMdjN6SnFsZDN0eVlxSytlOCt1VDd3VUhzTExCanoxSGZnSEpIMXNyV3g5b0pmOWE2TzIzQ2RwLzhYSFB2TC9IenQrZEpHanJmR2JDRGF3emRmZFZ3K2ZsODRmLzRWMFl2N0xxYlBFQXBiYkJTN0dzVEFIanNJdUNjWnpJNUd5K2dJOGhhMWtvaVkyVElDTGl2cUVvNHRLRGUwcnJ6dzY2UVpsWklia0VXN1oyVmFTVnhsVTFqdG82MWlDSUlzZCtXSXZMczVhTTVvRm9XVmFyNkNPMlZuNEpZTnNnODk5RXpZYjB5MS8rcE5Ocm1GK3YydUNiWTlZZDJMYnc3ZDAzZnJ3WUp4Ykl1NzV4WG9Xd0l1dEQ2VkhTSmRCYVZNTU5pUk4yRFhGekN2YlBVVjZCazlzYmVDWE03Sk1ENlE4WDU1dFZiNllMbHY3Nzd2YlYyZzRjMXcxQ0JBSDV1dEhqeDFkL01oSFAvS2JrS0RQUzhMMDZJRmRMT1UrdU91V1cyN3AvZHpQL2R6d205NzBlL3QvNHNlZlZkbThlZXNUV1JkU1JnWW9sVVNyK0RqUzBUbStiTC8wTll6UktRaWViUVZyaEM5aGNBYlRZV0kySWd0MW84MkNVOTFNSDJXbm1MUUNRaHNqM3JjS2dtVUpKY0htWjl0aGowZ2ZBYUVSWGRvL2JsZGtPNGlqcEtqUk9YNjdYaHRHNWx1M0V0RXpTODdVWW9FUzQ5dTJDQXdONUx5am4yZHJHY1JRT1FCOHNtK2ZNcUFFV0pFKzJKRlZ1d09pN0d0SVNmdElXM1BZaVFWdEg0d3JucW5lVEtNRXorbjFsOU1HWGVLNXF0QjBxSDhPaTNYNUdQemswSlc5eDY3N1dkWjFhNXlnME5RSTI2b3pQalpldmYyTzI5NzR6My9wWno4Q0R5dnZldGU3WFBmQnVudmdBQXBtMi9rSGVFbWE5dHZlOXJiWjV6Ly8rWTJmZlA0ejNyNXYzNzR2akkxUDhGNmRLSUVCeWxjV3J5NWYrMksya2xhekZUQURBM245aDVsTFNDR2VTakFMQ3NJREZoa2I0cDh6TWpMUFJVT2xnMkRMekNra2dsS0I0Z1dZVEhHQlVKOXFnMGo2Y2FOWFhCSmFZQlU4alhReVpObkd5S00vbUdCWkpCUkVZVE5SWDBpdWFFZVdQTkVnQ3l2QmRGSWFvMDFYdWpKZEZERFFCbWhBWFFMQ2VzTkJrNWlKT1ZnSWwxUCtVdEtHcitUaGVTbU5sRDRhL2c2VUpqdTRZUXMxWjN1UFh2dUx2VVpsbkorYmxTWHlwTmVXUi92Mjdma0Nodk4vbFhmd2tKK3I4OWhlYmhiK0E3cStFd0NKa0NWR202cHM3cU1mL2REcmppTVcrVnl0YndveUIvQ0EyUkt2UWE5SmoxcjdML2lOaloyb3NMeDJFdS9MRjh6UGpDcHNIOVNYQU1vNzRoUVBVVWV3U3dTRUdpdEFOTURZQUJHTTgwMFBpZGNuZ1l3ZHZNZ3NwbUtuWDNCdzZRbTZQS3J4QjBkL2tXYlE5b2hNWmJrbGFLalFxRnhpcmw3UUJLZ2lRL2tucHl2dkhEYTVmdkxTN0w1RU9Ra3dBQWhnQ0pqbDZUcWdRWlhsWFg4R1Z3Q21YQThTUkRwT1M5Uy9tQzVmOGZyZVZIVmIxZTk2eXd1cTdNb2JlZlRoajM3NGRiUmxydUNkaHJPOExIdFhOdk4rK1E5YWhaV2xmK3RiMytwaWhBMi8rYis4YWQ4MTF6ejErSmF0NXp5MTVTb2JkSkZLSGQ3cG5oemV3SWV2TDBnN2p2MW5Eak5kd0VqSXY3RmhrelBCTFEwbXE2c01CWFVqRVBlK2F4L01sc0RoRlBtRkEyUlZpRHg3Z2dVOTdDeUIwSmNxaGZxU0NjWlpyRk52cFdDSWZub3Y4TUlPSVcwNTlmZVpzeWpMSzlWZHhrVWhVYUpWL0xIOUFMaTB6MHlUMFNSZ1MxaVpPTjlidjJESndNMHpyd3hjYmE3Y3Q4RUpRTzVyQm5rWkx2M2w5SlJOb1NIRjJPdHFWNytVemhuK2Q5M045U2RYV3QwRnFpcmJVZWtPYzZML2ExLzcydXYrMVd0LzRlUHdyUEsrOTczdk81SSs5b3p1ZkVjWEpIdHk1eDN2ZU1lSmw3M3NaYzJmZWZIei8yam56aDBmbUp6a25lY2VLT0hTcU5hQTI3N3k4ZW1TbGIvTkQ3eCtES082aVJyTEc1S1pBU3pBSVU3aTRGYXh3cnVFc1MwREt3QkNZOXBMQnNWVVgzVVhEbW1GMUJJWnZqTldYcEtzZEZsMDVid0NTVnRIb3Naei9EQzBZWjZnQ2NlRGJId3ZxOWUrS2lvcjBLY3hscUZOTnN5dkZvN3dYUm5WaDdKWDhOa2YrMWFPNjJXcFE1Mmx2VVBmK2hLUStuTTRnOHpEOFNHWjRGQitFeU0vTHdkUXFETDZFd01BSWQzazF4eFQ0OXRwdy9DcnUxdHJUNiswT256ZTBnWjZ3UXUrTUZiYnVmT3VEN3pvSmM5N3I3eVNaL0xPcDVIbVFmNzVqaVZRU2p1aUFSeTQ3NjVldlhyNGQzNzNONjkvNFUvL3pJK3NYTGxxNHhJcmJMTEZ0am1MV1Q5eEVZdHU2OVBlNlhmemR1dUZJWW1DMVpZdzBJMXl0SmQ5Q3VEQUZDa2lrV1YwOXZNVVBnQkJuRjhkdFp3c2hiTHhYRXFmY3BGUG0wWnBKWEZsUm1aQVlYUVhra29HSzFWS0NXUzR2S3hMMjJUWW4ybGcvMnZscXBIWWIzTWZiR0pxaURjN1dLM0dkdk55Qm1uYnJTdmFYclEvUUJCUzQyVFFtQzc2UlNENmRFYS9LQStxbHJQTUdoLzk2bFIycHFuYWovZTJkbDdDMnB2U1g0QURXK3llY2FhQSsvYnR2ZVZIbjNyMUx6ejg0UTl2Y1diK3hKNDllemdzditQN0FVQ1p0RFNvZC9YVlYxZFJhZTM1eGZrYkhuN0ZJNTh6eHNYR0k2dlVMcXBtWW02Y2ZCamZ6NWxJKzZiL0dCQmxkUllkcFppU1RSSmR5c2Q5RVNuakkxZ1NXU0QxQ1N4b21HVXhuVlo3bG91SEdzM1pDQVVnam5iVkhvUjMxaVlvWWsycUdNWDlFWTF4S2dDVk9wNVFqQVZCMHRwR2dhdWFjN1BVZmJaaERyYXhFMEI2bnJQV0pkUGM2ZkRNVXB4V2pOZVo4a1FncHRzQlVGVVY3WElRVUUvWVFCS283QS90NDFiekwzekRPcXJQOTdhRGlPeE1OOHd1L202K3FQL0Uzc2JGVndBZTNzYm5BQndsMm9mTzhQQlEvZGl4WTBmZTh2dHZldmt0WC8vcVBuaTA4SWxQZk1JUFozN0g0S0dNNGdNUGhyN3pxd2Q0T2ovek02OXMvc21mL0xjakYxNTAwUzFiTjIvOXFRYkRrZThwSXRoamFRNWdWTkxtcVNzd3FnSFI4WGZ3VmE5TEMwbFVORURnZ0pSQjV4UHZuUlhGRmNTVXFseEIzRXhRYjBQdHlSd1lvZDJ6ekN6RG1YbDVNNVNqcWdFd3dHVzZ3bUFWY0RKV2JwWFRlTUVrb3dXY3M4TDhxbEkyYmkyalpINzJiUVhwS2NMNndnRFc4STAxbi9JWVNnRVkyeGxnb0RyS1B4VTBsbkdxNndNSnNBcWVYbTBYSDZLNnVyZjJ4TFc4OWNKM252bXVIYVhhQm5iWkc3V0YrWVh1cHovOWlWZjgzcHQvKzh2d2hxMm85N2xkOGFCblhmWnU4SG9JVk5oZ2NTbDk3V3MzZGE2OTl0cVJONzd4TjNjODdyR1AzN2w1MDVabmtrSTJaeENKQkc0M3IzZzRXeDBiK0Ryb0h5Q0pMZ1lnK1UxUnhZd3BSRXdzRnBxK3lCTkJuM2xaWWx4bEFCREJnVkppS0cyV1ZkMEF3NHduUzd3WFQzb0JJekF5MlBLOUFCSU1MaUE2STFSYWVlOHNydUVtWml6cVplQUZhSGpHZjhyTmJTaWxpeUMyTHROa3R4dzJiVCtQK1lxOE9iNjRMK0l0UktEcFJ6b2h3bmVpdTdXN2VOLy9LYjNWeDE1ZWdNY3pQb0lIV21OWm0vWkxOMzNoRi8vNUwvL2N4K0ZKOVkvKzZBK25lZllkemJxQzVBTi9IbW9Bd2UxSHB5OS8rYS9hcjNqRks4Yi8vVy84dTY4LzRlb2ZPYktaclk3NDNYbXhRYTlVUm9KaDg4b3JPTUY0ZnRweDVQZjVpYUx6bzFtTzlzQ0xkeEhPeG14R2xYR1JiT0FQaE9VYWpKYnhtZWg0Y0NtSUhzdzBEQk1CaUxNck02bm0vazk3MXdKY1ZYR0d6N25QNU40OFNFSUNlUkNJb0lnQkZTaUtpRldFc2JRS2d5QnRpRXBMOFRIVFVUdFRaenBUdFdwbFdwMXhuRkhyYU91REtSUkpSZ2FxcUZYUnRENktUQTBDSVFSTEdVZ0llUkNTbStRbU44LzdPUDIrZjgvbVhtUGJZYVlFQW1XVHZidG56NTQ5Ky9qTy8vLzcrcGZhMEJTclEvV3pzUWtnbGF3STloU0dOZEJVVDQwOU5zYlQxQWNaMEkwNzlCNDdIYVpsVzFJa1NaOXhkVHk0REpNODZqVGdhc0RRMVg0VmgrL0VOblBYRVNNMXRpS1dGdmkrR2NPMmpqamxJWGlnL2dJTGlLcXE5ajY4Wm0xcEdkckNqY0ZDS1BLZERmQTBueGJXSlpXT245TU5JQ1RaRER2YjJyZnZ6eEZJKy83SGYvWEludXZtMzlDYm41ZC9QZFdIQUJRYzBsRWdRc1BralprR1RlcXpqU050djBOZ3R2cXlJQVV5Rm9Ha0xEMHF5M1NHQUVaL3dyV0VJM0daSThJTlZqaVJRRWNhR0kwbEZ5cEFla29FbUlBSFlCQjJaRGV5VUM4OFIrcERVR3NxUmFGYnlVdDR6cVptOGg0N2FYa1AwbzhEbHdCUWVXRTh2anB1MVRVQkl1OURSQUVNODB5LzdTby9pMklQbUxvZ01BL2VGZk8xM2d6d2NKQ0xNZzhMcWNDREZZWm1kWFhWdXR2dlhQRXEyc0M5WWNNR2dnZEM4NWVuRlR4ODRRZ0FpRzFLRUJsV1ZWVlZaUFhLMWI1SDF6MVVDUkQxWUgvOTlSaThBbmhzZG9hb0JGVk8ya1ZHVHNvQ282N3RNK2dWYk1ZRXJOcG5wcWtSQWFIOGhBc3FpZzZNT1BpaEd3ZVZvbGlrR2xUZkp0WEtGdnVhVVEwazRFQTRHMGlQQW10cXdUQlNDVzBZUGlTVXc2L0JKa2tqZWZVZUd4eE1rNWJodGljT0hxUnJoek5Nc1RtRzJaYnYxZjRoRitDaFlqdEhEMlMxUGlzdDlJRGxhWjJIVllWUUJJM2F4QS9yQUhzSlRRZGtUclA2d1A1MXEyNi85ZmVvZTlmR3NvMEFEODRrVnBSSFM1RzZXUCt6T3hJQVlxYWtUZUhHcWc1V1JVdVhsL29lLy9VamxWZlB2YlpqL1BqY0c2RnJDSVhIMmdJVW1MVVp4dGJhOU9SY296Qnp2aEhvNmpCT2RtMkJUaCt3TktDQ0p5WVNIQUlJR3ltQVJodzBPb3h4YVBGU3RwbjRlYUdOQkNJY3JucmFqZ2VnOFFGcE5NMU8wSWp4cjE4bHdNY0pvaUg1Qm43R29XVVphTmlRNHVOUGd1VnRaWlZIYm9rWDhlMExSWVh3RHVZQllYR0xkK0EwSHd0blgzaU1JaXNsY0w5bHRsMk1rN2IwT0k5UTZpak9lTWY1Y3FZQnR2WElIYXR2ZXcxMTd0cTBkUk5uMkxtS2xFTHphUWNQMGh3UkNzUjB0V0VUeHFxL3FvNldscTcxclZ2MzBKNlpWODZ1eThuTytRNDJzVG1weVJ4VnlMcVNkVVJlWjRwUmxIMFZNbldKVWR2MkVrQ1RnUVg2cVFBUnpyUmk4WkdhVUEzeEF3WTJZalJZTkpYaU5ZMjQ5UE1GY09rVmEvdHhLZGZxaDQySmlJeHJXMTRLa0hnTkk0MkwzR3FYSThEeUNPN2JVZUJSb09CMW9wVUUrQk9QcUo1RmdKS0hjQXRwS3lEck1JNFJRREIyTmVIY2kyVXhiL01xTTlhVjRiQndaQ1ZpU0dLWUpJMndxOTdmM3hmYi9lVVhQMTE3OXgxbHFHdlg1amVFOHNpS0NVUmtzVWZFakJRRlNzd3NNeCtycnQ0YlFjSDhUejcxV00ya3dxSXZjL1B5YjB4UFQvZGoyZ05UcHhZK2JLNVQ0WWRpR25rWjA0emN0TVZHUzJldEVRaTlpK21QSWxRQjU5YlVLa1lCREZrVUxBbUlablZLWG9sZnM5Nkd3SVYwRmFCVUdLdFVubVBtRXFwM3lJdjJFVDljMVZoc1lGSUdObTZjK2d3QlNMV25OS3VBaUUvWllHS2d4R090TUo3NlVhNTlMWEVad3JqOHJpbnZPRS9nQThxd2tqdnVzUnpOMTVuUlFkeDFxWjRXU3NGVXduNG9VZ29HTzlzcktuYmM5VE5NVVFoNE5yL0dVMUUwNVdFeGhvb0YvMmsxWndKQXpEQUtVQXdRZlJBdUtWbVQvUHdMVHgvcjZPeXF3TUV1czhkbVplY095UFpQeEJJU2dLNHpnSktHSXlLTGN1WkJEOUVsUm4zZ0xld1F4U2swamh5aFFOeUhMNDBQU3FRRVpodE05alh2eVNnd3I1R3NBRVNRaEdzRXFHY0pwSytEaW8xQ3cxL3hTVnpicjI4QVJOTElOclVnTlJJOElKQlk0RDE2dEYrQlNBVXdUTjNRRVZXQUZGdUNxTXdYOHhLT2JweWcwMkY1KzIrMjNFMmxSalF3d1JFemdSNUtqM1kzSFc0c0xUWE4xWHlpNmNDenp6Mzk0eGRmZW00ZjZ0WXNLMXNQOEJSRDVtblZZejFTRkw1cEpJeVVhU1FTL2pkcE9nQVk2SnVwOFpTVWxLU1ZsNWVqcG96MHQ3ZC85R2pSeE1rckJnY0h3TWE0cVJlZkhnelhyL0FFR2hjV2hBZEN4NDI5ZFc4YVJ3UFA0MEFROU5xUzhpQ1BjRUtVKzlidHdVTEtKT3hKb1VzdXNncTcySlJadEV1cUlkY0lZN2VkOGVWWk5JV0FnUzRzUGlrMTRLamljRkc2dnM4R1pJVXBGc2E0aUNQVXlBWU84MjJEY0pqRElyRlFDRVlLZE5Hc0d0Zzh5eFRMdkpBSXRMMDUya0JrNWxpdXRzVldyTFhJeERKYXJqYkhNMFNxcEIvaHJEcDBkeHUxdFVlMkxsbTI2QWtFQjB1V2xvVEx0NWQzb1k0SFVjY2pKdk5JSmhKK3ppU0ErRnJXQXFtZVorSENwU210clhVK0hHaHZySDlsYytuVVM2ZjlNZ01LRWFFZG5ZVm5iYUs1V05IVVdnWlpBTHRkR3dOZkdmdnF0eGxOd1UxUUVYY3BkbGNTU0pnakE1aFVvOXRqT2dRU0FhTEJZL3RWbUEwTUFWQ0NYd0Ntd1BKMUVDbWdNSXpVQmRFVUt5UFlZQldBOEM3N1dpcVVjVkNJYjN6NkNKQXdBUkw4VUExSTRHQjJEdmhvTjV6UlN5MW54eUlyMW5LWkdlMXptNWFMU3pGb1dHMkVuQkgxWTFramREWVAvUFB3UDU1WXMzWlZHZWEyak96c1NiMFZGZHM1czA1Tkt1eXFVMG84STRhTmVTWU5LNEUyVmx0N0tKS1JrUkZic0dDQjk4bW4xdTMxdWoyZlRKaFFPRFZyN05nQzZPTkJMeTNLTmRZUU9UQWlESlpGK1NZakpjKzRhTnhjWTJ6SzlVWTNGQUcwQk4vQ2dHQVlhS09xWWFpblE0OU5MVDIxVndSeS9nelBLY0U3MFVVRzlLcEIzT2R5V3NiUlZqOUROb2pnT0R2RWhXS1Bxam5acEx3dkxKRUZRN054M1I5TGlIOHh3dExnSXhEb1YreUtSSmFJUTVzN1c2SEhwOGh5ZDY2d3JQcnZtZUdUQmRCT2g0V2RrSFVVY0ppZUZjR0tZYWZQNzNjME5UZnUzbHoreDU4OCt0alBQOFE1N2c0czVPdXFyTnlaQ0I3OWFqdy84b2JsT2h1RzcrVm54WnBNc2xrYXIvMWxyMjliVTFoWTlBQ29rU2NVNmdFRTJDVGdaVEN5QXhhU0xIZFNSckNSc2JuOXNIR282V1BqV0hzWlBydFdIRmMwRXdvWHhvRDZvS0hBM2tnMU5Oc1M5aWFVU0ZHZE9IdERHdzZ4dlRpYlUvZmp6MnZxSlduYWJJdHg0bFFJY1lrSjNCTktaYnZLRDhxSVB3R1BDU0tCVXdWbEJHUGdDaHhIZUxVVk9UblpqSVNTVFlzOUxsRFRCSFlGSkZGM285L1owZGs1VUZkMzlMZTMzN2w4UGFxaUYzVVdneGpBcVFrdExKUHFuRkh3NEgwMmhhVHZ6QnVDeUxUbEl2ZkNoUXRUc0REZnQyUEhqdWc5YSsrZnNYejViUStPSDUrM2dBdXMwRVVsV3lQQWFQRkJFbFFLU0ZoRlpIU0VtbzNhazN1TW95Zi9ZclQzdlljQlAraHY5TTdDc29vMGdBa05oNWx5c2pyRm1wUnNGQWZXY05EWTEwT2dBc0NHc3p0Y1N4aUJSSkJxUU1IRjYvQStoQVBvR084U2xtZmdkR1NUZ3JGekVGL01CTXZaTnd2NlQ2ZERPTTQxSXYxZ1ZjT0FneUlTRExFa3JOVWxwVHh4b3VtdjI3YVZQL1B5YXk5VlkvK1dFNE92WUZrVklkUmQySlozQ0p3ekRoNjg4NndDaU8rbjBjQ2dVTzFkdVhKMTJwWXRHeG5tZnVINVY3NWJmTm5sOStYazVGeE16YUdEb3JoUXhkZnlFZnMrNmlCZ0FDM2NiYlFHanhuMWJmdU5obzVkUnJEL0F5bGhrcWNJbEdrY0tCZE9BWVRnTEpSQ2xtQncreEF5QUJ1bk1EWTR0S0J0ZzBVTDNvblVTZ1I0SkNiVWphNE5LSk5UQzlpUFpUcERFdVkyQ3l4UHVOaHc5azR6ek9BRUl4Wks0elFLWG9UdmdsdWVPTHFwbWtLQWcza3NGOCtxT0hteTVYRE53ZW9YN252Zzd2Y1FJWXk2d1d6NlJsSWQ5TEtHSmtYNXpGa3paNHVGRFMrd1ptbG9Tc016Yjk1TnZxeXNkRDlPanFaQW1MbnhEMi9jTnJGdzBwcXNzZGw1R0h6RVhpZXNTWVVSMW9ZblJRYUJRT0lFRXFDbURld0J5aklIUTBLWldvSkhqQk9kQjQxQWJ4WDBJa1B4S09JVFNCNTNJZHcwMkdTQUNsck9iSUZiQVlvZ0lyRGdha29FVjAxbDZKNGVXUjhhSHl5SGxJV0FvY3ZkVFI0TU4zak5Jc3NibTJLNEJ5WUJPT1BBYUZKeDVCVnl4bU1FMllOa2wxeDZYeXdKZC9mekxJOGtaTVZ0dExXMU50WFgxNjVmL2FNZmJFVncrNUlsSzUyQlFMRG44ODkzY0IxUG9xQjhWcWdPODZyTmFBRVE4OE84MEpMNlVEYnlMbDFhNG05dWJraXFyUHdiV1ZqdTZ4dTIzb3J0UTZzeXM3SUtjUTNGVDcxc0JWUyt5RWhTRnJJM0pzTWhBRFltWlJDdXkrN0RPZTNkL1FHcnM2Zlo2T3c5VG12MmhCdXdLNkFCOHROUlBJSTlYVVBVaU9EdzRua2ZYSFVNRmNFaWs2aFl0dXJDS2pLM093VWd6TUNwUmRsV2tndW5Gem55Y0JCZkhsVCtnZExocEdSSEdPZVBoc0dlS0p5RElrRnhzd0lOaTZqblUweVY5K1JrYkNTRGFRKzAxUjl2YkNpNzg0Y3Ivb1RMNWpsejVydHljd3Y2dDI4djU3WWJVaDNXQXd0STRKeDE4Q0FQMG1CMFI1TmhaZEtTR3JreFd1MWR1UEFXLzg2ZEg3bWhLWlpmNnJqMXIyeTZDWUwyeXZTME1WZWdad0laQ2Flc1k5ODBLUkY3YnVwNTlwamdrM29HMVFBNktKTlFrS1ZnVHAxR1laejdHbzcyV1FPUlhtTWcwZ04vTDg0ODdjR0FBWSt3eGJHREpxYnJrQnFldy9sWlhoT0FORDFPbitWeCtVQmwvQmpZOUFIcEFCa1ViTW5SMGVpV3l3QW0wdWVxUUE0OWlPQXMrUkNNSUl0S213bkd0NXhZQm14UXJWeFhWMmRWYlYzdGxydnZ2V01ITXR5QzgwbWQxMTY3S0Z4UjhVNFBscDlxZHNXeWp4cmdzR1pwcEZUS08rcCttVGMwWHpHQVZPTXFLQ2hJdXVxcTYzMDFOYnZkaHc0ZFltV20vV2JkMDNObXpKaTVKRDE5ekExanhvekpJRUFHQmdnbUxMbFhZQ0tqZ0dUQ21vY1BZZEtXS0RiL0tPaEtid2lna29hV1VCVVgxMnhzaFRlRWc1SWdHVHNsU1lvQVpYcmNPMjhUQmI3TlRvTXVBWXlrZ1NtVkVDYzh2VGlObVJQRVdHYmFnU21JancvVVZHMy94Y01QN3NhRFhUeFdxYmo0VytFdnZ2aWt0NkdoUWZldVdGWk5kZUFkWFlZMU10b044MGlxUW9ya0tpd3M5RjUrK2RVK25DYmorZlRUSGF4WTU5eTU4d3ZYcnJsM1hsNytoRVdwS1NtelUxUFQweWlFS3NGN0FJM1BGZFZEUnNhV2NJVjBiVUN4cFcyaklLQ3Yvb3VMcHdsQ1pjUWxUbmpKUE1rZFRMWTZPV0tzODlMZEhld0s5ZlRzYm15b3IzajUxUmQzVmxidU9vNm8wVzkvK3lZSGRySU03dC8vOTk3NmV0RU1UMVkxcW9IRE10TG9HbEJYby9kWDUxTUR5WWxCU00rc1dkY2xwYWVuSkczYnRwbmhiRGp2NHNXM1RGaDZ5NHBaV01CMlRXcHEycFZZWERVUnV4SndXQlUxWjNDZkY5WE55RnlhWmdta0pKSSt5STErajEwVEtoelZGRWNZN21pa2tFclpFZmtveENYSVJ5S1FxM2VGUXQweGJQZUdldVN1ZlkxTmpidTJ2N1Yxei9zZnZrUFFrQzA1bGk4dmpRV0RvZjQ5ZXo3cngraXlGbzQxY0ppMFRwLytVV21HVmRpb3pPUHdUREhQQkl3R2s2dTQrQnJQNU1uWlNRNkh6L1BtbStXOFR6QlJFTS9Ba1oyVGlxZlB1Q3d6TTJ1NnorZS9CQnE1Q2pDb20rVlA5a01ZWm8rTnJJYnNpQXFodUdmZVprM2lJZ1cwSWVNa1dvNU5hZGJIK0tSMHZYMDRYemtTQ1dDbzRYaFBiOC9oOXJiQUFYVEJEejd6N0pOMVNLUWRsc0J3TEZ0V0FvTFlPM2prU0d0L1RjMHVnaWFSMmpEZm94NDB5T09RT1JjQnBEUFB2QThIRTJTSWF6eFRDM0toVHN6dzRNQTBCK2JhMkNDMFpJRit5RXlaTnk5ZU1oNHlWWDVtUmxaZXNzK2ZDemFUalVObU0wQ2xVaUVwSjRQSGVRQVlOeXhCU2xCUmpvRjZmbXNRaS8vN0lLOTNnNHAxWUFLNEZXQnA3dXdJTkVGbWFYejMvYmRQWU5sS0FJL29iVE1tNXFyTUtWT21RQnVWTVhpb29YbkFCZzNCcENtTkJzMDVCUnpXQzgyNURDQlZnbmdaRXNFazFBbHN6alY5K25SUFJrYSsyMnRGWFMzQm9CTnlFNS9Ub0tKZlpDdTRITWprOWxhNjdwa3o1N2pTL1hMVWtSSHM2YkgyN3Ewa3BlQUVGUzBwaC9ZVEFEUUNhTWd6eHJqMGRPd0xkVVk2T2hyRDJFbzhDUFkwbk1wbzBQQzVjeEk0ekRqTitRQWdWUkwxcThzampZa2dBb2wrZ3NTUm1abnB6TS9QZDZMSDVrcE5IWTl1dEFkS3hRWWRrSTFNSExCbVF0V3QyZElTTkk0ZE80VG8zelFUSjA0MXhvMUxONUNPNWZQaEFFMmNBaHFOZW1MOS9ZT1I3dTRUVWZTc0l0aGdHVVU2bXJyUUpVQTBZRFJZdFB2Tmw1eGpJYnJDejdGc24zSjJkZmswb0JKZERTNkdPY2FPSFdzQ1dHWWtrdUlZZzVNOG85RVVhRFJTaGd1TG5jNlExWW5sNlM1WEtBYWdXRzF0YmNPQmtRZ1MzdE9XaVp3M2dHRmhFbzJ1NE1Tdzg5bWZXRjd0SCs2eS9EcHNlRjBrQWtIN2g3dDhSb2NOZi82OHUvNVBGWFhlRmZRVUMzU3E5ZkYvQTVCVHJMY0wwUzdVd0lVYXVGQURaNkVHL2dWRFdBL1pMdno1L3dBQUFBQkpSVTVFcmtKZ2dnPT0iIGlkPSJiIiB3aWR0aD0iMTQ0IiBoZWlnaHQ9IjE0NCIvPjwvZGVmcz48L3N2Zz4=";const Lt=Object.freeze(Object.defineProperty({__proto__:null,default:It},Symbol.toStringTag,{value:"Module"}));var pt="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0OCIgaGVpZ2h0PSI0OCIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iIzAyMDIwNCIgZD0iTTIzLjgwMyAwYy0xLjEyNSAwLTIuMjU0LjIyMS0zLjI3NC43NzJhNi4wMjUgNi4wMjUgMCAwIDAtMi41MTggMi42MmMtLjU0NyAxLjEwMi0uNzYxIDIuMjgtLjc5NSAzLjU3Ny0uMDYyIDIuNDY0LjA1NiA1LjA0OC4yNDIgNy4zOS4wNDkuNzEyLjEzOSAxLjEyOS4wNDcgMS44NjItLjMwNCAxLjU1Ni0xLjY2NSAyLjYwMi0yLjM5MiAzLjk2OS0uODAxIDEuNTA4LTEuMTM5IDMuMjEyLTEuNzQyIDQuODEtLjU1MyAxLjQ2LTEuMzMgMi44My0xLjg1MyA0LjMwMi0uNzMzIDIuMDU3LS45NTIgNC4zMTktLjQ2OSA2LjQ0OS4zNyAxLjYyMyAxLjE0IDMuMTQ2IDIuMTggNC40NDktLjE1LjI3LS4yOTcuNTQ2LS40NS44MTQtLjQ4My44My0xLjA3MiAxLjYyLTEuMzQ1IDIuNTQtLjEzNy40Ni0uMTkxLjk1MS0uMTAzIDEuNDIzLjA4OC40NzMuMzI4LjkyNS43MDMgMS4yMjUuMjQ1LjE5NS41NDMuMzIyLjg1LjM5NC4zMDUuMDY5LjYyMi4wODYuOTM3LjA4IDEuMTk0LS4wMjYgMi4zNTMtLjM4OCAzLjUwOC0uNjkyYTQxLjg1IDQxLjg1IDAgMCAxIDIuMDY4LS40ODNjMi40NjQtLjUwNSA1LjIxMi0uMzAyIDcuNDk4LjAyOC43NzQuMTE4IDEuNTQzLjI3IDIuMzA0LjQ1NSAxLjE5My4yOSAyLjM4LjY1NyAzLjYwNi42OTIuMzIyLjAxLjY0OS0uMDA1Ljk2NC0uMDc1LjMxNS0uMDcxLjYyLS4xOTguODcyLS40LjM3Ny0uMy42MTctLjc1My43MDUtMS4yMjUuMDg4LS40NzMuMDMzLS45NjYtLjEwNS0xLjQyNy0uMjc4LS45MjMtLjg3Mi0xLjcwOC0xLjM2NC0yLjUzNS0uMTk1LS4zMjgtLjM3NS0uNjYyLS41NjgtLjk5IDEuNDgyLTEuNjYzIDIuNjc0LTMuNTg3IDMuMzY0LTUuNy43NTItMi4zMDYuODktNC43OS41NzQtNy4xOTYtLjMxNy0yLjQwNi0xLjA4LTQuNzM5LTIuMDgzLTYuOTQ3LTEuMjYtMi43NjgtMi4zMi0zLjc3LTMuMDg4LTYuMjAxLS44My0yLjYyOS0uMTQ1LTUuNzQtLjc2Mi04LjEyM2E4LjMzMyA4LjMzMyAwIDAgMC0xLjAyMS0yLjI5MyA3Ljg1NiA3Ljg1NiAwIDAgMC0xLjk5Ny0yLjE1QzI3LjAyNC40OSAyNS40MjYgMCAyMy44MDMgMFoiLz48cGF0aCBmaWxsPSIjRkRGREZCIiBkPSJNMTkuMzM3IDEzLjg3NWExLjkzOCAxLjkzOCAwIDAgMC0uMzQ1LjczYy0uMDY2LjI2Mi0uMDkuNTM0LS4xMDEuODA2LS4wMjEuNTQyLjAxMyAxLjA5My0uMTMyIDEuNjE2LS4xNTMuNTU5LS40OTcgMS4wNDQtLjgzMiAxLjUxNS0uNTgzLjgxNy0xLjE3MiAxLjY1Ny0xLjQ1OSAyLjYyYTQuNjUyIDQuNjUyIDAgMCAwLS4xNyAxLjgwMyAxOS4yMzMgMTkuMjMzIDAgMCAwLTEuNjg0IDMuMDM0Yy0uNzA5IDEuNjA3LTEuMTk1IDMuMzE3LTEuMzY1IDUuMDY0LS4yMSAyLjE0LjA2MyA0LjM0LjkxIDYuMzE3LjYwOCAxLjQzIDEuNTIgMi43MzcgMi42OTUgMy43NTguNTk3LjUxNyAxLjI2Ljk1OCAxLjk3IDEuMzA2IDIuNDU3IDEuMjEgNS40OTUgMS4yMTIgNy45MTItLjA3NyAxLjI2My0uNjczIDIuMzMtMS42NTcgMy4zNTgtMi42NTMuNjE4LS42IDEuMjM1LTEuMjE1IDEuNzA4LTEuOTM1LjkxLTEuMzg5IDEuMjI2LTMuMDc3IDEuNDIzLTQuNzI1LjM0My0yLjg4LjM1NC01LjkyNS0uOTEtOC41MzdhOS40MDYgOS40MDYgMCAwIDAtMS43MS0yLjQ0NiAxMy4zNSAxMy4zNSAwIDAgMC0xLjA4LTMuNjQyYy0uMzg0LS44MzQtLjg1LTEuNjI3LTEuMjA3LTIuNDctLjE0Ni0uMzQ4LS4yNzQtLjcwNC0uNDM1LTEuMDQzLS4xNjMtLjM0LS4zNjItLjY2Ni0uNjM2LS45MjdhMi41OTIgMi41OTIgMCAwIDAtLjk5LS41NzUgNC4yNDQgNC4yNDQgMCAwIDAtMS4xMzYtLjE5NWMtLjc3LS4wNC0xLjU0MS4wNjItMi4zMTIuMDMtLjYxMy0uMDI1LTEuMjI0LS4xMzItMS44MzctLjA5NmEyLjgyOSAyLjgyOSAwIDAgMC0uODk2LjE5IDEuNzkzIDEuNzkzIDAgMCAwLS43NC41MzJaIi8+PG1hc2sgaWQ9ImEiIHdpZHRoPSIyOCIgaGVpZ2h0PSI0NyIgeD0iMTAiIHk9IjAiIG1hc2tVbml0cz0idXNlclNwYWNlT25Vc2UiIHN0eWxlPSJtYXNrLXR5cGU6bHVtaW5hbmNlIj48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMjMuODAzIDBjLTEuMTI1IDAtMi4yNTQuMjIxLTMuMjc0Ljc3MmE2LjAyNSA2LjAyNSAwIDAgMC0yLjUxOCAyLjYyYy0uNTQ3IDEuMTAyLS43NjEgMi4yOC0uNzk1IDMuNTc3LS4wNjIgMi40NjQuMDU2IDUuMDQ4LjI0MiA3LjM5LjA0OS43MTIuMTM5IDEuMTI5LjA0NyAxLjg2Mi0uMzA0IDEuNTU2LTEuNjY1IDIuNjAyLTIuMzkyIDMuOTY5LS44MDEgMS41MDgtMS4xMzkgMy4yMTItMS43NDIgNC44MS0uNTUzIDEuNDYtMS4zMyAyLjgzLTEuODUzIDQuMzAyLS43MzMgMi4wNTctLjk1MiA0LjMxOS0uNDY5IDYuNDQ5LjM3IDEuNjIzIDEuMTQgMy4xNDYgMi4xOCA0LjQ0OS0uMTUuMjctLjI5Ny41NDYtLjQ1LjgxNC0uNDgzLjgzLTEuMDcyIDEuNjItMS4zNDUgMi41NC0uMTM3LjQ2LS4xOTEuOTUxLS4xMDMgMS40MjMuMDg4LjQ3My4zMjguOTI1LjcwMyAxLjIyNS4yNDUuMTk1LjU0My4zMjIuODUuMzk0LjMwNS4wNjkuNjIyLjA4Ni45MzcuMDggMS4xOTQtLjAyNiAyLjM1My0uMzg4IDMuNTA4LS42OTJhNDEuODUgNDEuODUgMCAwIDEgMi4wNjgtLjQ4M2MyLjQ2NC0uNTA1IDUuMjEyLS4zMDIgNy40OTguMDI4Ljc3NC4xMTggMS41NDMuMjcgMi4zMDQuNDU1IDEuMTkzLjI5IDIuMzguNjU3IDMuNjA2LjY5Mi4zMjIuMDEuNjQ5LS4wMDUuOTY0LS4wNzUuMzE1LS4wNzEuNjItLjE5OC44NzItLjQuMzc3LS4zLjYxNy0uNzUzLjcwNS0xLjIyNS4wODgtLjQ3My4wMzMtLjk2Ni0uMTA1LTEuNDI3LS4yNzgtLjkyMy0uODcyLTEuNzA4LTEuMzY0LTIuNTM1LS4xOTUtLjMyOC0uMzc1LS42NjItLjU2OC0uOTkgMS40ODItMS42NjMgMi42NzQtMy41ODcgMy4zNjQtNS43Ljc1Mi0yLjMwNi44OS00Ljc5LjU3NC03LjE5Ni0uMzE3LTIuNDA2LTEuMDgtNC43MzktMi4wODMtNi45NDctMS4yNi0yLjc2OC0yLjMyLTMuNzctMy4wODgtNi4yMDEtLjgzLTIuNjI5LS4xNDUtNS43NC0uNzYyLTguMTIzYTguMzMzIDguMzMzIDAgMCAwLTEuMDIxLTIuMjkzIDcuODU2IDcuODU2IDAgMCAwLTEuOTk3LTIuMTVDMjcuMDI0LjQ5IDI1LjQyNiAwIDIzLjgwMyAwWiIvPjwvbWFzaz48ZyBmaWx0ZXI9InVybCgjYikiIG1hc2s9InVybCgjYSkiIG9wYWNpdHk9Ii4yNSI+PHBhdGggZmlsbD0idXJsKCNjKSIgZD0iTTE2LjYyNiAyMS41OTZjLjE2My4yNDYtLjEwNCAxLjA5NSAzLjcyMy41NTIgMCAwLS42NzMuMDczLTEuMzM1LjIyNi0xLjAyOS4zNDUtMS45MjUuNzMtMi42MTkgMS4yNC0uNjg0LjUwNi0xLjE4NyAxLjE2NC0xLjgxNSAxLjcyOSAwIDAgMS4wMTgtMS44NiAxLjI3MS0yLjQyMS4yNTUtLjU2LS4wNDEtLjUzNS4xNi0xLjM2LjItLjgyNS42OTItMS42MTguNjkyLTEuNjE4cy0uNDAyIDEuMTY3LS4wNzcgMS42NTJaIi8+PC9nPjxtYXNrIGlkPSJkIiB3aWR0aD0iMjgiIGhlaWdodD0iNDciIHg9IjEwIiB5PSIwIiBtYXNrVW5pdHM9InVzZXJTcGFjZU9uVXNlIiBzdHlsZT0ibWFzay10eXBlOmx1bWluYW5jZSI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTIzLjgwMyAwYy0xLjEyNSAwLTIuMjU0LjIyMS0zLjI3NC43NzJhNi4wMjUgNi4wMjUgMCAwIDAtMi41MTggMi42MmMtLjU0NyAxLjEwMi0uNzYxIDIuMjgtLjc5NSAzLjU3Ny0uMDYyIDIuNDY0LjA1NiA1LjA0OC4yNDIgNy4zOS4wNDkuNzEyLjEzOSAxLjEyOS4wNDcgMS44NjItLjMwNCAxLjU1Ni0xLjY2NSAyLjYwMi0yLjM5MiAzLjk2OS0uODAxIDEuNTA4LTEuMTM5IDMuMjEyLTEuNzQyIDQuODEtLjU1MyAxLjQ2LTEuMzMgMi44My0xLjg1MyA0LjMwMi0uNzMzIDIuMDU3LS45NTIgNC4zMTktLjQ2OSA2LjQ0OS4zNyAxLjYyMyAxLjE0IDMuMTQ2IDIuMTggNC40NDktLjE1LjI3LS4yOTcuNTQ2LS40NS44MTQtLjQ4My44My0xLjA3MiAxLjYyLTEuMzQ1IDIuNTQtLjEzNy40Ni0uMTkxLjk1MS0uMTAzIDEuNDIzLjA4OC40NzMuMzI4LjkyNS43MDMgMS4yMjUuMjQ1LjE5NS41NDMuMzIyLjg1LjM5NC4zMDUuMDY5LjYyMi4wODYuOTM3LjA4IDEuMTk0LS4wMjYgMi4zNTMtLjM4OCAzLjUwOC0uNjkyYTQxLjg1IDQxLjg1IDAgMCAxIDIuMDY4LS40ODNjMi40NjQtLjUwNSA1LjIxMi0uMzAyIDcuNDk4LjAyOC43NzQuMTE4IDEuNTQzLjI3IDIuMzA0LjQ1NSAxLjE5My4yOSAyLjM4LjY1NyAzLjYwNi42OTIuMzIyLjAxLjY0OS0uMDA1Ljk2NC0uMDc1LjMxNS0uMDcxLjYyLS4xOTguODcyLS40LjM3Ny0uMy42MTctLjc1My43MDUtMS4yMjUuMDg4LS40NzMuMDMzLS45NjYtLjEwNS0xLjQyNy0uMjc4LS45MjMtLjg3Mi0xLjcwOC0xLjM2NC0yLjUzNS0uMTk1LS4zMjgtLjM3NS0uNjYyLS41NjgtLjk5IDEuNDgyLTEuNjYzIDIuNjc0LTMuNTg3IDMuMzY0LTUuNy43NTItMi4zMDYuODktNC43OS41NzQtNy4xOTYtLjMxNy0yLjQwNi0xLjA4LTQuNzM5LTIuMDgzLTYuOTQ3LTEuMjYtMi43NjgtMi4zMi0zLjc3LTMuMDg4LTYuMjAxLS44My0yLjYyOS0uMTQ1LTUuNzQtLjc2Mi04LjEyM2E4LjMzMyA4LjMzMyAwIDAgMC0xLjAyMS0yLjI5MyA3Ljg1NiA3Ljg1NiAwIDAgMC0xLjk5Ny0yLjE1QzI3LjAyNC40OSAyNS40MjYgMCAyMy44MDMgMFoiLz48L21hc2s+PGcgZmlsdGVyPSJ1cmwoI2UpIiBtYXNrPSJ1cmwoI2QpIiBvcGFjaXR5PSIuNDIiPjxwYXRoIGZpbGw9InVybCgjZikiIGQ9Ik0yOC45MjcgMjEuMzczYy0uNzguNTQ0LTEuMjM3LjQ4LTIuMTgyLjU4NS0uOTQ3LjEwNy0zLjUwNi4wNjgtMy41MDYuMDY4cy4zNy0uMDA2IDEuMTkyLjE0NmMuODIyLjE1NCAyLjQ5Ni4zIDMuNDM5LjY1OC45NDUuMzYgMS4yODguNDYzIDEuODYyLjgyNS44MTYuNTE2IDEuNDE2IDEuMzI0IDIuMTk1IDEuODkgMCAwIC4wMzgtLjc1LS4yNzctMS4zMS0uMzE1LS41NjEtMS4xNjItMS40NDQtMS40MTItMi4yNy0uMjQ3LS44MjQtLjM2Ny0yLjQ0NC0uMzY3LTIuNDQ0cy0uMTY1IDEuMzEtLjk0NCAxLjg1MloiLz48L2c+PG1hc2sgaWQ9ImciIHdpZHRoPSIyOCIgaGVpZ2h0PSI0NyIgeD0iMTAiIHk9IjAiIG1hc2tVbml0cz0idXNlclNwYWNlT25Vc2UiIHN0eWxlPSJtYXNrLXR5cGU6bHVtaW5hbmNlIj48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMjMuODAzIDBjLTEuMTI1IDAtMi4yNTQuMjIxLTMuMjc0Ljc3MmE2LjAyNSA2LjAyNSAwIDAgMC0yLjUxOCAyLjYyYy0uNTQ3IDEuMTAyLS43NjEgMi4yOC0uNzk1IDMuNTc3LS4wNjIgMi40NjQuMDU2IDUuMDQ4LjI0MiA3LjM5LjA0OS43MTIuMTM5IDEuMTI5LjA0NyAxLjg2Mi0uMzA0IDEuNTU2LTEuNjY1IDIuNjAyLTIuMzkyIDMuOTY5LS44MDEgMS41MDgtMS4xMzkgMy4yMTItMS43NDIgNC44MS0uNTUzIDEuNDYtMS4zMyAyLjgzLTEuODUzIDQuMzAyLS43MzMgMi4wNTctLjk1MiA0LjMxOS0uNDY5IDYuNDQ5LjM3IDEuNjIzIDEuMTQgMy4xNDYgMi4xOCA0LjQ0OS0uMTUuMjctLjI5Ny41NDYtLjQ1LjgxNC0uNDgzLjgzLTEuMDcyIDEuNjItMS4zNDUgMi41NC0uMTM3LjQ2LS4xOTEuOTUxLS4xMDMgMS40MjMuMDg4LjQ3My4zMjguOTI1LjcwMyAxLjIyNS4yNDUuMTk1LjU0My4zMjIuODUuMzk0LjMwNS4wNjkuNjIyLjA4Ni45MzcuMDggMS4xOTQtLjAyNiAyLjM1My0uMzg4IDMuNTA4LS42OTJhNDEuODUgNDEuODUgMCAwIDEgMi4wNjgtLjQ4M2MyLjQ2NC0uNTA1IDUuMjEyLS4zMDIgNy40OTguMDI4Ljc3NC4xMTggMS41NDMuMjcgMi4zMDQuNDU1IDEuMTkzLjI5IDIuMzguNjU3IDMuNjA2LjY5Mi4zMjIuMDEuNjQ5LS4wMDUuOTY0LS4wNzUuMzE1LS4wNzEuNjItLjE5OC44NzItLjQuMzc3LS4zLjYxNy0uNzUzLjcwNS0xLjIyNS4wODgtLjQ3My4wMzMtLjk2Ni0uMTA1LTEuNDI3LS4yNzgtLjkyMy0uODcyLTEuNzA4LTEuMzY0LTIuNTM1LS4xOTUtLjMyOC0uMzc1LS42NjItLjU2OC0uOTkgMS40ODItMS42NjMgMi42NzQtMy41ODcgMy4zNjQtNS43Ljc1Mi0yLjMwNi44OS00Ljc5LjU3NC03LjE5Ni0uMzE3LTIuNDA2LTEuMDgtNC43MzktMi4wODMtNi45NDctMS4yNi0yLjc2OC0yLjMyLTMuNzctMy4wODgtNi4yMDEtLjgzLTIuNjI5LS4xNDUtNS43NC0uNzYyLTguMTIzYTguMzMzIDguMzMzIDAgMCAwLTEuMDIxLTIuMjkzIDcuODU2IDcuODU2IDAgMCAwLTEuOTk3LTIuMTVDMjcuMDI0LjQ5IDI1LjQyNiAwIDIzLjgwMyAwWiIvPjwvbWFzaz48ZyBmaWx0ZXI9InVybCgjaCkiIG1hc2s9InVybCgjZykiIG9wYWNpdHk9Ii4yIj48cGF0aCBmaWxsPSJ1cmwoI2kpIiBkPSJNMjEuNTk0IDIwLjIxNGMtLjAzLjIzNS0uMDY3LjQ3LS4xMTIuNzAyYTIuMDg1IDIuMDg1IDAgMCAxLS4wOS4zMzcuNzYzLjc2MyAwIDAgMS0uMTkxLjI5Yy0uMDc3LjA3LS4xNy4xMTctLjI2My4xNmE0LjAyIDQuMDIgMCAwIDEtMS4xNDcuMzI2Yy4xNTcuMDEyLjMxNS4wMjcuNDc0LjA0NC4xLjAxLjE5OS4wMjIuMjk0LjA0NmEuODM3LjgzNyAwIDAgMSAuMjc0LjEyMi43NTguNzU4IDAgMCAxIC4yMS4yNTJjLjEwMy4xOS4xMzcuNDEyLjE1Ni42MzEuMDI0LjI3OC4wMjYuNTYuMDA1LjgzNy4wMi0uMTg2LjA1OC0uMzcyLjExNy0uNTQ4LjEwNi0uMzIyLjI3NS0uNjIyLjUwNC0uODcyYTEuNjYgMS42NiAwIDAgMSAxLjQ3LS41NSAxLjgyMiAxLjgyMiAwIDAgMS0xLjE2My0uMzYxIDEuNTA4IDEuNTA4IDAgMCAxLS40MTYtLjQ2OSAxLjMxIDEuMzEgMCAwIDEtLjEyMi0uOTQ3WiIvPjwvZz48bWFzayBpZD0iaiIgd2lkdGg9IjI4IiBoZWlnaHQ9IjQ3IiB4PSIxMCIgeT0iMCIgbWFza1VuaXRzPSJ1c2VyU3BhY2VPblVzZSIgc3R5bGU9Im1hc2stdHlwZTpsdW1pbmFuY2UiPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0yMy44MDMgMGMtMS4xMjUgMC0yLjI1NC4yMjEtMy4yNzQuNzcyYTYuMDI1IDYuMDI1IDAgMCAwLTIuNTE4IDIuNjJjLS41NDcgMS4xMDItLjc2MSAyLjI4LS43OTUgMy41NzctLjA2MiAyLjQ2NC4wNTYgNS4wNDguMjQyIDcuMzkuMDQ5LjcxMi4xMzkgMS4xMjkuMDQ3IDEuODYyLS4zMDQgMS41NTYtMS42NjUgMi42MDItMi4zOTIgMy45NjktLjgwMSAxLjUwOC0xLjEzOSAzLjIxMi0xLjc0MiA0LjgxLS41NTMgMS40Ni0xLjMzIDIuODMtMS44NTMgNC4zMDItLjczMyAyLjA1Ny0uOTUyIDQuMzE5LS40NjkgNi40NDkuMzcgMS42MjMgMS4xNCAzLjE0NiAyLjE4IDQuNDQ5LS4xNS4yNy0uMjk3LjU0Ni0uNDUuODE0LS40ODMuODMtMS4wNzIgMS42Mi0xLjM0NSAyLjU0LS4xMzcuNDYtLjE5MS45NTEtLjEwMyAxLjQyMy4wODguNDczLjMyOC45MjUuNzAzIDEuMjI1LjI0NS4xOTUuNTQzLjMyMi44NS4zOTQuMzA1LjA2OS42MjIuMDg2LjkzNy4wOCAxLjE5NC0uMDI2IDIuMzUzLS4zODggMy41MDgtLjY5MmE0MS44NSA0MS44NSAwIDAgMSAyLjA2OC0uNDgzYzIuNDY0LS41MDUgNS4yMTItLjMwMiA3LjQ5OC4wMjguNzc0LjExOCAxLjU0My4yNyAyLjMwNC40NTUgMS4xOTMuMjkgMi4zOC42NTcgMy42MDYuNjkyLjMyMi4wMS42NDktLjAwNS45NjQtLjA3NS4zMTUtLjA3MS42Mi0uMTk4Ljg3Mi0uNC4zNzctLjMuNjE3LS43NTMuNzA1LTEuMjI1LjA4OC0uNDczLjAzMy0uOTY2LS4xMDUtMS40MjctLjI3OC0uOTIzLS44NzItMS43MDgtMS4zNjQtMi41MzUtLjE5NS0uMzI4LS4zNzUtLjY2Mi0uNTY4LS45OSAxLjQ4Mi0xLjY2MyAyLjY3NC0zLjU4NyAzLjM2NC01LjcuNzUyLTIuMzA2Ljg5LTQuNzkuNTc0LTcuMTk2LS4zMTctMi40MDYtMS4wOC00LjczOS0yLjA4My02Ljk0Ny0xLjI2LTIuNzY4LTIuMzItMy43Ny0zLjA4OC02LjIwMS0uODMtMi42MjktLjE0NS01Ljc0LS43NjItOC4xMjNhOC4zMzMgOC4zMzMgMCAwIDAtMS4wMjEtMi4yOTMgNy44NTYgNy44NTYgMCAwIDAtMS45OTctMi4xNUMyNy4wMjQuNDkgMjUuNDI2IDAgMjMuODAzIDBaIi8+PC9tYXNrPjxnIGZpbHRlcj0idXJsKCNrKSIgbWFzaz0idXJsKCNqKSIgb3BhY2l0eT0iLjExIj48cGF0aCBmaWxsPSIjMDAwIiBkPSJNMjAuNTk3IDI1LjcxNGExNC4xMzMgMTQuMTMzIDAgMCAwLS40MDcgMi4zMDhjLS4xMDMgMS4xLS4wNzkgMi4yMDktLjEzOSAzLjMxMy0uMDQ4LjkzNi0uMTYgMS44ODMuMDA0IDIuODA3LjA3Ny40NC4yMTYuODcuNDEzIDEuMjcxLjAzLS4xNTQuMDU0LS4zMDcuMDY3LS40NjMuMDctLjc1LS4wNTYtMS41MDItLjEtMi4yNTItLjA3NC0xLjMxNi4xMDgtMi42MzIuMTgzLTMuOTQ5LjA1Ni0xLjAxLjA1LTIuMDI1LS4wMjEtMy4wMzVaIi8+PC9nPjxtYXNrIGlkPSJsIiB3aWR0aD0iMjgiIGhlaWdodD0iNDciIHg9IjEwIiB5PSIwIiBtYXNrVW5pdHM9InVzZXJTcGFjZU9uVXNlIiBzdHlsZT0ibWFzay10eXBlOmx1bWluYW5jZSI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTIzLjgwMyAwYy0xLjEyNSAwLTIuMjU0LjIyMS0zLjI3NC43NzJhNi4wMjUgNi4wMjUgMCAwIDAtMi41MTggMi42MmMtLjU0NyAxLjEwMi0uNzYxIDIuMjgtLjc5NSAzLjU3Ny0uMDYyIDIuNDY0LjA1NiA1LjA0OC4yNDIgNy4zOS4wNDkuNzEyLjEzOSAxLjEyOS4wNDcgMS44NjItLjMwNCAxLjU1Ni0xLjY2NSAyLjYwMi0yLjM5MiAzLjk2OS0uODAxIDEuNTA4LTEuMTM5IDMuMjEyLTEuNzQyIDQuODEtLjU1MyAxLjQ2LTEuMzMgMi44My0xLjg1MyA0LjMwMi0uNzMzIDIuMDU3LS45NTIgNC4zMTktLjQ2OSA2LjQ0OS4zNyAxLjYyMyAxLjE0IDMuMTQ2IDIuMTggNC40NDktLjE1LjI3LS4yOTcuNTQ2LS40NS44MTQtLjQ4My44My0xLjA3MiAxLjYyLTEuMzQ1IDIuNTQtLjEzNy40Ni0uMTkxLjk1MS0uMTAzIDEuNDIzLjA4OC40NzMuMzI4LjkyNS43MDMgMS4yMjUuMjQ1LjE5NS41NDMuMzIyLjg1LjM5NC4zMDUuMDY5LjYyMi4wODYuOTM3LjA4IDEuMTk0LS4wMjYgMi4zNTMtLjM4OCAzLjUwOC0uNjkyYTQxLjg1IDQxLjg1IDAgMCAxIDIuMDY4LS40ODNjMi40NjQtLjUwNSA1LjIxMi0uMzAyIDcuNDk4LjAyOC43NzQuMTE4IDEuNTQzLjI3IDIuMzA0LjQ1NSAxLjE5My4yOSAyLjM4LjY1NyAzLjYwNi42OTIuMzIyLjAxLjY0OS0uMDA1Ljk2NC0uMDc1LjMxNS0uMDcxLjYyLS4xOTguODcyLS40LjM3Ny0uMy42MTctLjc1My43MDUtMS4yMjUuMDg4LS40NzMuMDMzLS45NjYtLjEwNS0xLjQyNy0uMjc4LS45MjMtLjg3Mi0xLjcwOC0xLjM2NC0yLjUzNS0uMTk1LS4zMjgtLjM3NS0uNjYyLS41NjgtLjk5IDEuNDgyLTEuNjYzIDIuNjc0LTMuNTg3IDMuMzY0LTUuNy43NTItMi4zMDYuODktNC43OS41NzQtNy4xOTYtLjMxNy0yLjQwNi0xLjA4LTQuNzM5LTIuMDgzLTYuOTQ3LTEuMjYtMi43NjgtMi4zMi0zLjc3LTMuMDg4LTYuMjAxLS44My0yLjYyOS0uMTQ1LTUuNzQtLjc2Mi04LjEyM2E4LjMzMyA4LjMzMyAwIDAgMC0xLjAyMS0yLjI5MyA3Ljg1NiA3Ljg1NiAwIDAgMC0xLjk5Ny0yLjE1QzI3LjAyNC40OSAyNS40MjYgMCAyMy44MDMgMFoiLz48L21hc2s+PGcgZmlsdGVyPSJ1cmwoI20pIiBtYXNrPSJ1cmwoI2wpIiBvcGFjaXR5PSIuNzUiPjxwYXRoIGZpbGw9IiM3QzdDN0MiIGQ9Ik0zMy43NjUgMjQuNjA2Yy4xOTMtLjAzIDEuMzc2Ljk3NiAxLjIxNSAxLjM1MS0uMTYxLjM3NC0uNDY3LjE0OS0uNjg0LjE1LS4yMTguMDA0LS44MTIuMjc0LS45MTIuMTA0LS4xLS4xNzEuMjYzLS41NjkuNDUyLS45MDIuMTU0LS4yNjgtLjI2Mi0uNjczLS4wNzEtLjcwM1oiLz48L2c+PG1hc2sgaWQ9Im4iIHdpZHRoPSIyOCIgaGVpZ2h0PSI0NyIgeD0iMTAiIHk9IjAiIG1hc2tVbml0cz0idXNlclNwYWNlT25Vc2UiIHN0eWxlPSJtYXNrLXR5cGU6bHVtaW5hbmNlIj48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMjMuODAzIDBjLTEuMTI1IDAtMi4yNTQuMjIxLTMuMjc0Ljc3MmE2LjAyNSA2LjAyNSAwIDAgMC0yLjUxOCAyLjYyYy0uNTQ3IDEuMTAyLS43NjEgMi4yOC0uNzk1IDMuNTc3LS4wNjIgMi40NjQuMDU2IDUuMDQ4LjI0MiA3LjM5LjA0OS43MTIuMTM5IDEuMTI5LjA0NyAxLjg2Mi0uMzA0IDEuNTU2LTEuNjY1IDIuNjAyLTIuMzkyIDMuOTY5LS44MDEgMS41MDgtMS4xMzkgMy4yMTItMS43NDIgNC44MS0uNTUzIDEuNDYtMS4zMyAyLjgzLTEuODUzIDQuMzAyLS43MzMgMi4wNTctLjk1MiA0LjMxOS0uNDY5IDYuNDQ5LjM3IDEuNjIzIDEuMTQgMy4xNDYgMi4xOCA0LjQ0OS0uMTUuMjctLjI5Ny41NDYtLjQ1LjgxNC0uNDgzLjgzLTEuMDcyIDEuNjItMS4zNDUgMi41NC0uMTM3LjQ2LS4xOTEuOTUxLS4xMDMgMS40MjMuMDg4LjQ3My4zMjguOTI1LjcwMyAxLjIyNS4yNDUuMTk1LjU0My4zMjIuODUuMzk0LjMwNS4wNjkuNjIyLjA4Ni45MzcuMDggMS4xOTQtLjAyNiAyLjM1My0uMzg4IDMuNTA4LS42OTJhNDEuODUgNDEuODUgMCAwIDEgMi4wNjgtLjQ4M2MyLjQ2NC0uNTA1IDUuMjEyLS4zMDIgNy40OTguMDI4Ljc3NC4xMTggMS41NDMuMjcgMi4zMDQuNDU1IDEuMTkzLjI5IDIuMzguNjU3IDMuNjA2LjY5Mi4zMjIuMDEuNjQ5LS4wMDUuOTY0LS4wNzUuMzE1LS4wNzEuNjItLjE5OC44NzItLjQuMzc3LS4zLjYxNy0uNzUzLjcwNS0xLjIyNS4wODgtLjQ3My4wMzMtLjk2Ni0uMTA1LTEuNDI3LS4yNzgtLjkyMy0uODcyLTEuNzA4LTEuMzY0LTIuNTM1LS4xOTUtLjMyOC0uMzc1LS42NjItLjU2OC0uOTkgMS40ODItMS42NjMgMi42NzQtMy41ODcgMy4zNjQtNS43Ljc1Mi0yLjMwNi44OS00Ljc5LjU3NC03LjE5Ni0uMzE3LTIuNDA2LTEuMDgtNC43MzktMi4wODMtNi45NDctMS4yNi0yLjc2OC0yLjMyLTMuNzctMy4wODgtNi4yMDEtLjgzLTIuNjI5LS4xNDUtNS43NC0uNzYyLTguMTIzYTguMzMzIDguMzMzIDAgMCAwLTEuMDIxLTIuMjkzIDcuODU2IDcuODU2IDAgMCAwLTEuOTk3LTIuMTVDMjcuMDI0LjQ5IDI1LjQyNiAwIDIzLjgwMyAwWiIvPjwvbWFzaz48ZyBmaWx0ZXI9InVybCgjbykiIG1hc2s9InVybCgjbikiPjxwYXRoIGZpbGw9IiM3QzdDN0MiIGQ9Ik0yNi41MzUgMi4wODVjLS40MTQuMjkzLS4yMzQuNjU4LS4wNTYgMS4wMjQuMTc4LjM2Ny0uMzkyIDEuNDIzLS4zOTggMS40NjgtLjAwNS4wNDUgMS4xMjItLjUzNCAxLjQyOS0uOTEzLjM2NC0uNDQ1IDEuMjguNjA0IDEuMjMuNDQ0LjAwMi0uMjg1LTEuNzktMi4zMTQtMi4yMDUtMi4wMjNaIi8+PC9nPjxtYXNrIGlkPSJwIiB3aWR0aD0iMjgiIGhlaWdodD0iNDciIHg9IjEwIiB5PSIwIiBtYXNrVW5pdHM9InVzZXJTcGFjZU9uVXNlIiBzdHlsZT0ibWFzay10eXBlOmx1bWluYW5jZSI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTIzLjgwMyAwYy0xLjEyNSAwLTIuMjU0LjIyMS0zLjI3NC43NzJhNi4wMjUgNi4wMjUgMCAwIDAtMi41MTggMi42MmMtLjU0NyAxLjEwMi0uNzYxIDIuMjgtLjc5NSAzLjU3Ny0uMDYyIDIuNDY0LjA1NiA1LjA0OC4yNDIgNy4zOS4wNDkuNzEyLjEzOSAxLjEyOS4wNDcgMS44NjItLjMwNCAxLjU1Ni0xLjY2NSAyLjYwMi0yLjM5MiAzLjk2OS0uODAxIDEuNTA4LTEuMTM5IDMuMjEyLTEuNzQyIDQuODEtLjU1MyAxLjQ2LTEuMzMgMi44My0xLjg1MyA0LjMwMi0uNzMzIDIuMDU3LS45NTIgNC4zMTktLjQ2OSA2LjQ0OS4zNyAxLjYyMyAxLjE0IDMuMTQ2IDIuMTggNC40NDktLjE1LjI3LS4yOTcuNTQ2LS40NS44MTQtLjQ4My44My0xLjA3MiAxLjYyLTEuMzQ1IDIuNTQtLjEzNy40Ni0uMTkxLjk1MS0uMTAzIDEuNDIzLjA4OC40NzMuMzI4LjkyNS43MDMgMS4yMjUuMjQ1LjE5NS41NDMuMzIyLjg1LjM5NC4zMDUuMDY5LjYyMi4wODYuOTM3LjA4IDEuMTk0LS4wMjYgMi4zNTMtLjM4OCAzLjUwOC0uNjkyYTQxLjg1IDQxLjg1IDAgMCAxIDIuMDY4LS40ODNjMi40NjQtLjUwNSA1LjIxMi0uMzAyIDcuNDk4LjAyOC43NzQuMTE4IDEuNTQzLjI3IDIuMzA0LjQ1NSAxLjE5My4yOSAyLjM4LjY1NyAzLjYwNi42OTIuMzIyLjAxLjY0OS0uMDA1Ljk2NC0uMDc1LjMxNS0uMDcxLjYyLS4xOTguODcyLS40LjM3Ny0uMy42MTctLjc1My43MDUtMS4yMjUuMDg4LS40NzMuMDMzLS45NjYtLjEwNS0xLjQyNy0uMjc4LS45MjMtLjg3Mi0xLjcwOC0xLjM2NC0yLjUzNS0uMTk1LS4zMjgtLjM3NS0uNjYyLS41NjgtLjk5IDEuNDgyLTEuNjYzIDIuNjc0LTMuNTg3IDMuMzY0LTUuNy43NTItMi4zMDYuODktNC43OS41NzQtNy4xOTYtLjMxNy0yLjQwNi0xLjA4LTQuNzM5LTIuMDgzLTYuOTQ3LTEuMjYtMi43NjgtMi4zMi0zLjc3LTMuMDg4LTYuMjAxLS44My0yLjYyOS0uMTQ1LTUuNzQtLjc2Mi04LjEyM2E4LjMzMyA4LjMzMyAwIDAgMC0xLjAyMS0yLjI5MyA3Ljg1NiA3Ljg1NiAwIDAgMC0xLjk5Ny0yLjE1QzI3LjAyNC40OSAyNS40MjYgMCAyMy44MDMgMFoiLz48L21hc2s+PGcgZmlsdGVyPSJ1cmwoI3EpIiBtYXNrPSJ1cmwoI3ApIj48cGF0aCBmaWxsPSIjODM4Mzg0IiBkPSJNMjkuNjc2IDE0LjM2OGMtLjM1LjMxOS4xNjUuNzk3LjQwNyAxLjM1OC4xNTEuMzQ4LjU3Ljg0MS45NzUuNzYzLjMwNS0uMDYuNDkzLS40OTkuNDY1LS44MDctLjA1Ny0uNTk2LS41Ni0uNzM2LS45MjUtLjk0LS4yODktLjE2Mi0uNjc3LS41OTctLjkyMi0uMzc0WiIvPjwvZz48cGF0aCBmaWxsPSIjMDIwMjA0IiBkPSJNMTUuNzQ2IDE4LjkyYy0xLjE0NCAxLjI5OC0yLjMyIDIuNTU2LTIuOTY0IDMuOTYtLjMyLjcxMy0uNDcgMS40ODgtLjY5IDIuMjM4YTE2Ljg2IDE2Ljg2IDAgMCAxLS45NjQgMi40NzhjLS4zNS43NC0uNzM3IDEuNDY1LTEuMTIxIDIuMTg2LS4yODEuNTI3LS41NjYgMS4wNjQtLjY2NCAxLjY1Mi0uMDc3LjQ2NS0uMDM0Ljk0NS4wODYgMS40MDEuMTE4LjQ1Ni4zMDguODkuNTIzIDEuMzA5LjkxNSAxLjc5IDIuMjkgMy4zMzIgMy45MTcgNC41MTMuNzQuNTM0IDEuNTI5Ljk5NyAyLjM2IDEuMzc4LjQ1LjIwNC45MjIuMzg4IDEuNDE3LjM5Ni4yNDcuMDA1LjQ5Ni0uMDM2LjcyMy0uMTM1LjIyNS0uMS40MjgtLjI2LjU2My0uNDY3LjE2NS0uMjU1LjIyMS0uNTcyLjE4Ny0uODc0YTIuMTA0IDIuMTA0IDAgMCAwLS4zMDktLjg1Yy0uMzg2LS42MzMtLjk5Ni0xLjA5Mi0xLjU4Mi0xLjU0NmE1My4xMjYgNTMuMTI2IDAgMCAxLTMuNjY2LTMuMTA5Yy0uMzMtLjMxLS42NjItLjYyNi0uODkzLTEuMDE2LS4yMjUtLjM3OS0uMzQ3LS44MS0uNDI5LTEuMjQzLS4yMjctMS4xODctLjE2OS0yLjQzNi4yMzQtMy41NzYuMTYtLjQ0Ni4zNjgtLjg3Mi41Ny0xLjMuMzUtLjc0LjY4LTEuNDk2IDEuMTM4LTIuMTc0LjU3Mi0uODQ2IDEuMzM3LTEuNTYyIDEuODAyLTIuNDcuMzk0LS43NjcuNTU0LTEuNjI3LjcwNS0yLjQ3NS4xMi0uNjY0LjM0Ny0xLjMxMi40NjMtMS45NzYtLjIyNi40MzEtLjk1OCAxLjEzOC0xLjQwNiAxLjdaIi8+PG1hc2sgaWQ9InIiIHdpZHRoPSIxMSIgaGVpZ2h0PSIyNCIgeD0iOSIgeT0iMTciIG1hc2tVbml0cz0idXNlclNwYWNlT25Vc2UiIHN0eWxlPSJtYXNrLXR5cGU6bHVtaW5hbmNlIj48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMTUuNzQ2IDE4LjkyYy0xLjE0NCAxLjI5OC0yLjMyIDIuNTU2LTIuOTY0IDMuOTYtLjMyLjcxMy0uNDcgMS40ODgtLjY5IDIuMjM4YTE2Ljg2IDE2Ljg2IDAgMCAxLS45NjQgMi40NzhjLS4zNS43NC0uNzM3IDEuNDY1LTEuMTIxIDIuMTg2LS4yODEuNTI3LS41NjYgMS4wNjQtLjY2NCAxLjY1Mi0uMDc3LjQ2NS0uMDM0Ljk0NS4wODYgMS40MDEuMTE4LjQ1Ni4zMDguODkuNTIzIDEuMzA5LjkxNSAxLjc5IDIuMjkgMy4zMzIgMy45MTcgNC41MTMuNzQuNTM0IDEuNTI5Ljk5NyAyLjM2IDEuMzc4LjQ1LjIwNC45MjIuMzg4IDEuNDE3LjM5Ni4yNDcuMDA1LjQ5Ni0uMDM2LjcyMy0uMTM1LjIyNS0uMS40MjgtLjI2LjU2My0uNDY3LjE2NS0uMjU1LjIyMS0uNTcyLjE4Ny0uODc0YTIuMTA0IDIuMTA0IDAgMCAwLS4zMDktLjg1Yy0uMzg2LS42MzMtLjk5Ni0xLjA5Mi0xLjU4Mi0xLjU0NmE1My4xMjYgNTMuMTI2IDAgMCAxLTMuNjY2LTMuMTA5Yy0uMzMtLjMxLS42NjItLjYyNi0uODkzLTEuMDE2LS4yMjUtLjM3OS0uMzQ3LS44MS0uNDI5LTEuMjQzLS4yMjctMS4xODctLjE2OS0yLjQzNi4yMzQtMy41NzYuMTYtLjQ0Ni4zNjgtLjg3Mi41Ny0xLjMuMzUtLjc0LjY4LTEuNDk2IDEuMTM4LTIuMTc0LjU3Mi0uODQ2IDEuMzM3LTEuNTYyIDEuODAyLTIuNDcuMzk0LS43NjcuNTU0LTEuNjI3LjcwNS0yLjQ3NS4xMi0uNjY0LjM0Ny0xLjMxMi40NjMtMS45NzYtLjIyNi40MzEtLjk1OCAxLjEzOC0xLjQwNiAxLjdaIi8+PC9tYXNrPjxnIGZpbHRlcj0idXJsKCNzKSIgbWFzaz0idXJsKCNyKSIgb3BhY2l0eT0iLjk1Ij48cGF0aCBmaWxsPSIjN0M3QzdDIiBkPSJNMTQuNDMgMjMuNjQ0YTUuMzIgNS4zMiAwIDAgMC0uOTYyIDEuMTgzYy0uNDMxLjcyLS42ODQgMS41My0xIDIuMzA4LS4yMzIuNTgtLjUwNCAxLjE2Mi0uNTM2IDEuNzg3LS4wMTYuMzIuMDMuNjQxLjA0Mi45NjIuMDExLjMyLS4wMTkuNjU0LS4xNzcuOTMzLS4xMy4yMzUtLjM1LjQxOS0uNjAzLjUwOS4zNDMuMTE0LjY0Ny4zMzUuODYyLjYyNC4xOC4yNDQuMjk2LjUyNy40NTIuNzg0LjEyOC4yMS4yODMuNDA1LjQ3Ni41NTcuMTkyLjE1My40MjIuMjYyLjY2NC4yOTJhMS4xNyAxLjE3IDAgMCAwIC45MzItLjI5NiAyMS44NTIgMjEuODUyIDAgMCAxIC44MzItOC42OTRjLjA1NS0uMTc3LjExMS0uMzU1LjEyNi0uNTM5YS43NzUuNzc1IDAgMCAwLS4xMzUtLjUyNi41Ni41NiAwIDAgMC0uNTItLjIyLjU3My41NzMgMCAwIDAtLjI3MS4xMDcuNTg0LjU4NCAwIDAgMC0uMTgyLjIyOVoiLz48L2c+PHBhdGggZmlsbD0iIzAyMDIwNCIgZD0iTTM0LjI2NyAyMy44MzVjLjk4My43OTEgMS42MDcgMS45ODYgMS44IDMuMjMyLjE1Ljk3Mi4wNTMgMS45NzEtLjE2NiAyLjkzLS4yMi45Ni0uNTU3IDEuODg2LS44OTUgMi44MTItLjEzMy4zNjctLjI2OC43NC0uMzIgMS4xMjktLjA1NS4zOS0uMDIxLjguMTY2IDEuMTQ1LjIxNi4zOTYuNjE3LjY2OCAxLjA0OS43OTUuNDI1LjEyOC44ODUuMTI0IDEuMzE2LjAxNy40MzEtLjEwNyAxLjE1Ny0uMjQ2IDEuNTA3LS41Mi44OTEtLjY5MSAxLjEwMy0xLjg5MyAxLjMxNS0yLjk0Ny4yMi0xLjEuMTEyLTIuMjU0LS4wOC0zLjM2NS0uMjY1LTEuNTE3LS43MS0yLjk5OS0xLjI3NC00LjQzYTE1LjQyOSAxNS40MjkgMCAwIDAtMS41ODMtMi45OTJjLS42MjItLjkxNy0xLjUwMy0xLjYzMS0yLjE1Ni0yLjUyNy0uMjI3LS4zMTItLjQ5OC0uNjM0LS43Mi0uOTQ5LS40OC0uNjc5LS4zNzEtLjU1MS0uNjctLjk5Mi0uMjE1LS4zMTktLjU1Ni0uNDI3LS45MTQtLjU2NmExLjgyIDEuODIgMCAwIDAtMS4xMzMtLjA3N2MtLjQ4Ny4xMzctLjg4Ny41MjMtMS4wOTguOTgyLS4yMTIuNDYyLS4yNS45OS0uMTY3IDEuNDkxLjEwNy42NDUuNDAxIDEuMjQ1LjczNSAxLjgwOC4zNzUuNjM1LjgxIDEuMjQ4IDEuMzc4IDEuNzIuNTkyLjQ5NCAxLjMwOS44MiAxLjkxIDEuMzA0WiIvPjxtYXNrIGlkPSJ0IiB3aWR0aD0iMTEiIGhlaWdodD0iMjAiIHg9IjMwIiB5PSIxNiIgbWFza1VuaXRzPSJ1c2VyU3BhY2VPblVzZSIgc3R5bGU9Im1hc2stdHlwZTpsdW1pbmFuY2UiPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0zNC4yNjcgMjMuODM1Yy45ODMuNzkxIDEuNjA3IDEuOTg2IDEuOCAzLjIzMi4xNS45NzIuMDUzIDEuOTcxLS4xNjYgMi45My0uMjIuOTYtLjU1NyAxLjg4Ni0uODk1IDIuODEyLS4xMzMuMzY3LS4yNjguNzQtLjMyIDEuMTI5LS4wNTUuMzktLjAyMS44LjE2NiAxLjE0NS4yMTYuMzk2LjYxNy42NjggMS4wNDkuNzk1LjQyNS4xMjguODg1LjEyNCAxLjMxNi4wMTcuNDMxLS4xMDcgMS4xNTctLjI0NiAxLjUwNy0uNTIuODkxLS42OTEgMS4xMDMtMS44OTMgMS4zMTUtMi45NDcuMjItMS4xLjExMi0yLjI1NC0uMDgtMy4zNjUtLjI2NS0xLjUxNy0uNzEtMi45OTktMS4yNzQtNC40M2ExNS40MjkgMTUuNDI5IDAgMCAwLTEuNTgzLTIuOTkyYy0uNjIyLS45MTctMS41MDMtMS42MzEtMi4xNTYtMi41MjctLjIyNy0uMzEyLS40OTgtLjYzNC0uNzItLjk0OS0uNDgtLjY3OS0uMzcxLS41NTEtLjY3LS45OTItLjIxNS0uMzE5LS41NTYtLjQyNy0uOTE0LS41NjZhMS44MiAxLjgyIDAgMCAwLTEuMTMzLS4wNzdjLS40ODcuMTM3LS44ODcuNTIzLTEuMDk4Ljk4Mi0uMjEyLjQ2Mi0uMjUuOTktLjE2NyAxLjQ5MS4xMDcuNjQ1LjQwMSAxLjI0NS43MzUgMS44MDguMzc1LjYzNS44MSAxLjI0OCAxLjM3OCAxLjcyLjU5Mi40OTQgMS4zMDkuODIgMS45MSAxLjMwNFoiLz48L21hc2s+PGcgZmlsdGVyPSJ1cmwoI3UpIiBtYXNrPSJ1cmwoI3QpIj48cGF0aCBmaWxsPSIjODM4Mzg0IiBkPSJNMzEuOTU0IDIyLjMxYy4wNzguMDc2LjE2MS4xNTIuMjQ1LjIyNC42MDQuNDkzLjkyNSAxLjA0NiAxLjUzOCAxLjUzIDEuMDAxLjc5MSAyLjAxNSAyLjE1NiAyLjIxMiAzLjQwMy4xNTQuOTczLS4wNDggMS41MDItLjI5NiAyLjY0Ny0uMjQ3IDEuMTQ4LS45NDkgMi43NzItMS4zMyAzLjg3OC0uMTUuNDQuMzA4LjI1OS4yNDguNzI0LS4wMy4yMjgtLjAzMy40NTktLjAwNS42ODguMDAzLS4wNDMuMDA1LS4wOS4wMS0uMTMzLjA3NC0uNjM0LjI2Ny0xLjI0My40NzktMS44NDIuNDA3LTEuMTQ5Ljg3NC0yLjI3OCAxLjE5Ni0zLjQ1OS4zMjMtMS4xOC4yODctMi4wMjkuMTE4LTMuMDQzLS4yMTItMS4yNzctLjk1NC0yLjQ1NC0yLjAwNC0zLjIzMy0uNzQ0LS41NDktMS42Mi0uOTAxLTIuNDExLTEuMzgzWiIvPjwvZz48cGF0aCBmaWxsPSJ1cmwoI3YpIiBkPSJNMTAuMzA5IDMyLjg3NGExLjQ3IDEuNDcgMCAwIDEgLjgyMy0uMDc3Yy4yNzYuMDUxLjUzNi4xNzEuNzY3LjMyNy40NjMuMzE1LjgwNi43NzIgMS4xMzQgMS4yMjZhNDMuMDY0IDQzLjA2NCAwIDAgMSAyLjE0MSAzLjIwM2MuNTM1Ljg5NiAxLjAyNCAxLjgyIDEuNjQzIDIuNjU4LjQwMy41NS44NTcgMS4wNTggMS4yNjIgMS42MDMuNDA1LjU0OC43NjMgMS4xNC45NDMgMS43OTdhMy42MDMgMy42MDMgMCAwIDEtLjI2MyAyLjU3OCAzLjM5NyAzLjM5NyAwIDAgMS0xLjI1NiAxLjM0OCAzLjIyNCAzLjIyNCAwIDAgMS0xLjcxNi40NjNjLS45ODggMC0xLjk1My0uNTMtMi44NzItLjg5Ni0xLjg3MS0uNzQ2LTMuOTA0LS45NzktNS44MzMtMS41Ni0uNTkzLS4xNzgtMS4xNzYtLjM5LTEuNzcyLS41NTMtLjI2Ni0uMDc0LS41MzQtLjEzNy0uNzg2LS4yNTItLjI1LS4xMTItLjQ4NS0uMjgzLS42MjQtLjUxOS0uMTA3LS4xODQtLjE1LS40LS4xNS0uNjExIDAtLjIxNC4wNTMtLjQyNC4xMjYtLjYyMy4xNDQtLjQuMzc4LS43NjEuNTM2LTEuMTU3LjI1Ny0uNjQ1LjMwNC0xLjM1NS4yNjgtMi4wNDktLjAzNC0uNjkyLS4xNDYtMS4zOC0uMTkzLTIuMDcyLS4wMjMtLjMxLS4wMy0uNjIyLjAzLS45MjguMDU4LS4zMDQuMTktLjYwMi40MTItLjgxNmExLjUzIDEuNTMgMCAwIDEgLjc2LS4zNzVjLjI4LS4wNTguNTY4LS4wNi44NTMtLjA1NC4yODUuMDA2LjU3Mi4wMjMuODU3LS4wMDIuMjg1LS4wMjIuNTcyLS4wODYuODItLjIyOS4yMzUtLjEzNS40MjktLjMzNS41ODgtLjU1NS4xNi0uMjE5LjI4OS0uNDU5LjQyMi0uNjk3LjEzMS0uMjM2LjI2OC0uNDczLjQ0Mi0uNjgzLjE3My0uMjEuMzg2LS4zOTIuNjM4LS40OTVaIi8+PG1hc2sgaWQ9InciIHdpZHRoPSIxNyIgaGVpZ2h0PSIxNiIgeD0iMyIgeT0iMzIiIG1hc2tVbml0cz0idXNlclNwYWNlT25Vc2UiIHN0eWxlPSJtYXNrLXR5cGU6bHVtaW5hbmNlIj48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMTAuMzA5IDMyLjg3NGExLjQ3IDEuNDcgMCAwIDEgLjgyMy0uMDc3Yy4yNzYuMDUxLjUzNi4xNzEuNzY3LjMyNy40NjMuMzE1LjgwNi43NzIgMS4xMzQgMS4yMjZhNDMuMDY0IDQzLjA2NCAwIDAgMSAyLjE0MSAzLjIwM2MuNTM1Ljg5NiAxLjAyNCAxLjgyIDEuNjQzIDIuNjU4LjQwMy41NS44NTcgMS4wNTggMS4yNjIgMS42MDMuNDA1LjU0OC43NjMgMS4xNC45NDMgMS43OTdhMy42MDMgMy42MDMgMCAwIDEtLjI2MyAyLjU3OCAzLjM5NyAzLjM5NyAwIDAgMS0xLjI1NiAxLjM0OCAzLjIyNCAzLjIyNCAwIDAgMS0xLjcxNi40NjNjLS45ODggMC0xLjk1My0uNTMtMi44NzItLjg5Ni0xLjg3MS0uNzQ2LTMuOTA0LS45NzktNS44MzMtMS41Ni0uNTkzLS4xNzgtMS4xNzYtLjM5LTEuNzcyLS41NTMtLjI2Ni0uMDc0LS41MzQtLjEzNy0uNzg2LS4yNTItLjI1LS4xMTItLjQ4NS0uMjgzLS42MjQtLjUxOS0uMTA3LS4xODQtLjE1LS40LS4xNS0uNjExIDAtLjIxNC4wNTMtLjQyNC4xMjYtLjYyMy4xNDQtLjQuMzc4LS43NjEuNTM2LTEuMTU3LjI1Ny0uNjQ1LjMwNC0xLjM1NS4yNjgtMi4wNDktLjAzNC0uNjkyLS4xNDYtMS4zOC0uMTkzLTIuMDcyLS4wMjMtLjMxLS4wMy0uNjIyLjAzLS45MjguMDU4LS4zMDQuMTktLjYwMi40MTItLjgxNmExLjUzIDEuNTMgMCAwIDEgLjc2LS4zNzVjLjI4LS4wNTguNTY4LS4wNi44NTMtLjA1NC4yODUuMDA2LjU3Mi4wMjMuODU3LS4wMDIuMjg1LS4wMjIuNTcyLS4wODYuODItLjIyOS4yMzUtLjEzNS40MjktLjMzNS41ODgtLjU1NS4xNi0uMjE5LjI4OS0uNDU5LjQyMi0uNjk3LjEzMS0uMjM2LjI2OC0uNDczLjQ0Mi0uNjgzLjE3My0uMjEuMzg2LS4zOTIuNjM4LS40OTVaIi8+PC9tYXNrPjxnIGZpbHRlcj0idXJsKCN4KSIgbWFzaz0idXJsKCN3KSI+PHBhdGggZmlsbD0iI0Q5OUEwMyIgZD0iTTEwLjcxNyAzMy4zMTljLjIzNS0uMDk0LjUwMS0uMTA1Ljc0Ny0uMDQ5LjI0Ny4wNTYuNDc4LjE3Ni42NzcuMzMyLjQuMzEuNjc4Ljc0NC45NDcgMS4xNzRhNzcuMDE1IDc3LjAxNSAwIDAgMSAxLjg2IDMuMTZjLjQ1LjgwOS44NzcgMS42MzIgMS40MjggMi4zNzMuMzY2LjQ5MS43ODQuOTQzIDEuMTU3IDEuNDI4LjM3My40ODYuNzA1IDEuMDE1Ljg3IDEuNjA1LjIxNC43Ni4xMjggMS42MDItLjI0IDIuM2EzLjA3IDMuMDcgMCAwIDEtMS4xNjIgMS4yMTQgMi45ODggMi45ODggMCAwIDEtMS42My40MDFjLS45MDQtLjA0LTEuNzMtLjQ5My0yLjU4Mi0uNzk4LTEuNjMzLS41OTMtMy40LS42NzMtNS4wNzctMS4xMzUtLjYtLjE2My0xLjE4NS0uMzgtMS43ODctLjUzMi0uMjY4LS4wNjgtLjU0LS4xMjQtLjc5My0uMjMtLjI1My0uMTA4LS40OTEtLjI3My0uNjMtLjUxYTEuMTM0IDEuMTM0IDAgMCAxLS4xMzctLjU5MSAxLjg4IDEuODggMCAwIDEgLjEzMS0uNTk5Yy4xNDctLjM4Mi4zNzUtLjcyNy41MjItMS4xMS4yMjMtLjU3Ny4yNS0xLjIxMy4yMS0xLjgzLS4wNDItLjYxNi0uMTUtMS4yMy0uMTg4LTEuODQ2YTMuMjA3IDMuMjA3IDAgMCAxIC4wMzgtLjgyN2MuMDU2LS4yNzIuMTc0LS41MzUuMzctLjczLjIxNS0uMjEyLjUwNy0uMzI2LjgwNS0uMzczLjI5Ni0uMDQ1LjU5OC0uMDI0Ljg5Ni4wMDIuMy4wMjYuNi4wNi45LjA0My4zLS4wMTkuNjA0LS4wOTIuODUyLS4yNi4yMjUtLjE1Mi4zOTMtLjM3NS41MjMtLjYxMy4xMy0uMjM5LjIyMS0uNDk1LjMyLS43NDcuMDk4LS4yNTMuMjA1LS41MDQuMzU4LS43My4xNTQtLjIyMi4zNjItLjQyLjYxNS0uNTIyWiIvPjwvZz48bWFzayBpZD0ieSIgd2lkdGg9IjE3IiBoZWlnaHQ9IjE2IiB4PSIzIiB5PSIzMiIgbWFza1VuaXRzPSJ1c2VyU3BhY2VPblVzZSIgc3R5bGU9Im1hc2stdHlwZTpsdW1pbmFuY2UiPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xMC4zMDkgMzIuODc0YTEuNDcgMS40NyAwIDAgMSAuODIzLS4wNzdjLjI3Ni4wNTEuNTM2LjE3MS43NjcuMzI3LjQ2My4zMTUuODA2Ljc3MiAxLjEzNCAxLjIyNmE0My4wNjQgNDMuMDY0IDAgMCAxIDIuMTQxIDMuMjAzYy41MzUuODk2IDEuMDI0IDEuODIgMS42NDMgMi42NTguNDAzLjU1Ljg1NyAxLjA1OCAxLjI2MiAxLjYwMy40MDUuNTQ4Ljc2MyAxLjE0Ljk0MyAxLjc5N2EzLjYwMyAzLjYwMyAwIDAgMS0uMjYzIDIuNTc4IDMuMzk3IDMuMzk3IDAgMCAxLTEuMjU2IDEuMzQ4IDMuMjI0IDMuMjI0IDAgMCAxLTEuNzE2LjQ2M2MtLjk4OCAwLTEuOTUzLS41My0yLjg3Mi0uODk2LTEuODcxLS43NDYtMy45MDQtLjk3OS01LjgzMy0xLjU2LS41OTMtLjE3OC0xLjE3Ni0uMzktMS43NzItLjU1My0uMjY2LS4wNzQtLjUzNC0uMTM3LS43ODYtLjI1Mi0uMjUtLjExMi0uNDg1LS4yODMtLjYyNC0uNTE5LS4xMDctLjE4NC0uMTUtLjQtLjE1LS42MTEgMC0uMjE0LjA1My0uNDI0LjEyNi0uNjIzLjE0NC0uNC4zNzgtLjc2MS41MzYtMS4xNTcuMjU3LS42NDUuMzA0LTEuMzU1LjI2OC0yLjA0OS0uMDM0LS42OTItLjE0Ni0xLjM4LS4xOTMtMi4wNzItLjAyMy0uMzEtLjAzLS42MjIuMDMtLjkyOC4wNTgtLjMwNC4xOS0uNjAyLjQxMi0uODE2YTEuNTMgMS41MyAwIDAgMSAuNzYtLjM3NWMuMjgtLjA1OC41NjgtLjA2Ljg1My0uMDU0LjI4NS4wMDYuNTcyLjAyMy44NTctLjAwMi4yODUtLjAyMi41NzItLjA4Ni44Mi0uMjI5LjIzNS0uMTM1LjQyOS0uMzM1LjU4OC0uNTU1LjE2LS4yMTkuMjg5LS40NTkuNDIyLS42OTcuMTMxLS4yMzYuMjY4LS40NzMuNDQyLS42ODMuMTczLS4yMS4zODYtLjM5Mi42MzgtLjQ5NVoiLz48L21hc2s+PGcgZmlsdGVyPSJ1cmwoI3opIiBtYXNrPSJ1cmwoI3kpIj48cGF0aCBmaWxsPSIjRjVCRDBDIiBkPSJNMTAuNDk4IDMyLjczMmMuMjI5LS4xMTMuNDk3LS4xMzUuNzQ2LS4wODQuMjUuMDUuNDgyLjE3Mi42OC4zMzEuMzkxLjMyLjY0Mi43NzUuODc1IDEuMjIxLjUzMiAxLjAyNCAxLjAzMSAyLjA3IDEuNjY4IDMuMDM2LjQ2NS42OTkgMSAxLjM1IDEuNDY5IDIuMDQ3LjYzNS45NDMgMS4xNTMgMS45ODIgMS4zNjYgMy4wOTQuMTQzLjc1LjE0IDEuNTU4LS4yMiAyLjIzMWEyLjQ3OSAyLjQ3OSAwIDAgMS0xLjA3OSAxLjAzNWMtLjQ1NC4yMjktLjk3Ny4zMi0xLjQ4NS4yNzYtLjgtLjA3LTEuNTI2LS40NjMtMi4yOC0uNzM5LTEuMzM3LS40ODYtMi43ODItLjYwNC00LjE1OS0uOTcxLS41NzktLjE1NC0xLjE0OS0uMzU1LTEuNzM2LS40NzctLjI2LS4wNTQtLjUyNS0uMDkzLS43NzItLjE4Ny0uMjQ4LS4wOTQtLjQ4Mi0uMjUtLjYxLS40NzhhLjk2Ny45NjcgMCAwIDEtLjEwNS0uNTMzYy4wMTMtLjE4MS4wNjgtLjM2LjEzOS0uNTMuMTQ0LS4zMzguMzU2LS42NDkuNDY3LS45OTguMTY1LS41MTUuMDk3LTEuMDcyLS4wMjYtMS42LS4xMjItLjUyNC0uMy0xLjA0LS4zNTUtMS41NzZhMi4xMzggMi4xMzggMCAwIDEgLjAzMi0uNzE2Yy4wNTQtLjIzNS4xNjUtLjQ2LjM0LS42MjcuMjI0LS4yMTUuNTQtLjMyNC44NTQtLjM1NC4zMTQtLjAzLjYyOS4wMTEuOTQuMDU2LjMxMS4wNDUuNjI2LjA5NC45NC4wOC4zMTQtLjAxNC42MzUtLjA5Ni44OC0uMjkuMjQ0LS4xOS4zOTgtLjQ3NC40ODYtLjc2Ny4wODgtLjI5NC4xMTYtLjYuMTUyLS45MDMuMDM2LS4zMDQuMDgtLjYxMS4xOTktLjg5NS4xMTgtLjI4My4zMTctLjU0My41OTQtLjY4MloiLz48L2c+PG1hc2sgaWQ9IkEiIHdpZHRoPSIxNyIgaGVpZ2h0PSIxNiIgeD0iMyIgeT0iMzIiIG1hc2tVbml0cz0idXNlclNwYWNlT25Vc2UiIHN0eWxlPSJtYXNrLXR5cGU6bHVtaW5hbmNlIj48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMTAuMzA5IDMyLjg3NGExLjQ3IDEuNDcgMCAwIDEgLjgyMy0uMDc3Yy4yNzYuMDUxLjUzNi4xNzEuNzY3LjMyNy40NjMuMzE1LjgwNi43NzIgMS4xMzQgMS4yMjZhNDMuMDY0IDQzLjA2NCAwIDAgMSAyLjE0MSAzLjIwM2MuNTM1Ljg5NiAxLjAyNCAxLjgyIDEuNjQzIDIuNjU4LjQwMy41NS44NTcgMS4wNTggMS4yNjIgMS42MDMuNDA1LjU0OC43NjMgMS4xNC45NDMgMS43OTdhMy42MDMgMy42MDMgMCAwIDEtLjI2MyAyLjU3OCAzLjM5NyAzLjM5NyAwIDAgMS0xLjI1NiAxLjM0OCAzLjIyNCAzLjIyNCAwIDAgMS0xLjcxNi40NjNjLS45ODggMC0xLjk1My0uNTMtMi44NzItLjg5Ni0xLjg3MS0uNzQ2LTMuOTA0LS45NzktNS44MzMtMS41Ni0uNTkzLS4xNzgtMS4xNzYtLjM5LTEuNzcyLS41NTMtLjI2Ni0uMDc0LS41MzQtLjEzNy0uNzg2LS4yNTItLjI1LS4xMTItLjQ4NS0uMjgzLS42MjQtLjUxOS0uMTA3LS4xODQtLjE1LS40LS4xNS0uNjExIDAtLjIxNC4wNTMtLjQyNC4xMjYtLjYyMy4xNDQtLjQuMzc4LS43NjEuNTM2LTEuMTU3LjI1Ny0uNjQ1LjMwNC0xLjM1NS4yNjgtMi4wNDktLjAzNC0uNjkyLS4xNDYtMS4zOC0uMTkzLTIuMDcyLS4wMjMtLjMxLS4wMy0uNjIyLjAzLS45MjguMDU4LS4zMDQuMTktLjYwMi40MTItLjgxNmExLjUzIDEuNTMgMCAwIDEgLjc2LS4zNzVjLjI4LS4wNTguNTY4LS4wNi44NTMtLjA1NC4yODUuMDA2LjU3Mi4wMjMuODU3LS4wMDIuMjg1LS4wMjIuNTcyLS4wODYuODItLjIyOS4yMzUtLjEzNS40MjktLjMzNS41ODgtLjU1NS4xNi0uMjE5LjI4OS0uNDU5LjQyMi0uNjk3LjEzMS0uMjM2LjI2OC0uNDczLjQ0Mi0uNjgzLjE3My0uMjEuMzg2LS4zOTIuNjM4LS40OTVaIi8+PC9tYXNrPjxnIGZpbHRlcj0idXJsKCNCKSIgbWFzaz0idXJsKCNBKSI+PHBhdGggZmlsbD0idXJsKCNDKSIgZD0iTTEzLjM1IDM1LjI5Yy40MjIuNzYuNjc5IDEuNjM0IDEuMDk3IDIuNDAzLjM4NC43MDcuODIxIDEuNDM0IDEuMjExIDIuMDg1LjE3NS4yOS41OC43MzcuOTg4IDEuNDI5LjM3MS42MjYuNzQ2IDEuNTAyLjk1NiAxLjc5Ni0uMTItLjM0NS0uMzY3LTEuMjctLjY2My0xLjkyNy0uMjc2LS42MTUtLjU5OC0uOTY2LS43OTUtMS4yOTgtLjM5LS42NS0uODEyLTEuMjM3LTEuMjEzLTEuODU4LS41NTMtLjg1Ny0uOTc1LTEuODE1LTEuNTgxLTIuNjNaIi8+PC9nPjxtYXNrIGlkPSJEIiB3aWR0aD0iMjgiIGhlaWdodD0iNDciIHg9IjEwIiB5PSIwIiBtYXNrVW5pdHM9InVzZXJTcGFjZU9uVXNlIiBzdHlsZT0ibWFzay10eXBlOmx1bWluYW5jZSI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTIzLjgwMyAwYy0xLjEyNSAwLTIuMjU0LjIyMS0zLjI3NC43NzJhNi4wMjUgNi4wMjUgMCAwIDAtMi41MTggMi42MmMtLjU0NyAxLjEwMi0uNzYxIDIuMjgtLjc5NSAzLjU3Ny0uMDYyIDIuNDY0LjA1NiA1LjA0OC4yNDIgNy4zOS4wNDkuNzEyLjEzOSAxLjEyOS4wNDcgMS44NjItLjMwNCAxLjU1Ni0xLjY2NSAyLjYwMi0yLjM5MiAzLjk2OS0uODAxIDEuNTA4LTEuMTM5IDMuMjEyLTEuNzQyIDQuODEtLjU1MyAxLjQ2LTEuMzMgMi44My0xLjg1MyA0LjMwMi0uNzMzIDIuMDU3LS45NTIgNC4zMTktLjQ2OSA2LjQ0OS4zNyAxLjYyMyAxLjE0IDMuMTQ2IDIuMTggNC40NDktLjE1LjI3LS4yOTcuNTQ2LS40NS44MTQtLjQ4My44My0xLjA3MiAxLjYyLTEuMzQ1IDIuNTQtLjEzNy40Ni0uMTkxLjk1MS0uMTAzIDEuNDIzLjA4OC40NzMuMzI4LjkyNS43MDMgMS4yMjUuMjQ1LjE5NS41NDMuMzIyLjg1LjM5NC4zMDUuMDY5LjYyMi4wODYuOTM3LjA4IDEuMTk0LS4wMjYgMi4zNTMtLjM4OCAzLjUwOC0uNjkyYTQxLjg1IDQxLjg1IDAgMCAxIDIuMDY4LS40ODNjMi40NjQtLjUwNSA1LjIxMi0uMzAyIDcuNDk4LjAyOC43NzQuMTE4IDEuNTQzLjI3IDIuMzA0LjQ1NSAxLjE5My4yOSAyLjM4LjY1NyAzLjYwNi42OTIuMzIyLjAxLjY0OS0uMDA1Ljk2NC0uMDc1LjMxNS0uMDcxLjYyLS4xOTguODcyLS40LjM3Ny0uMy42MTctLjc1My43MDUtMS4yMjUuMDg4LS40NzMuMDMzLS45NjYtLjEwNS0xLjQyNy0uMjc4LS45MjMtLjg3Mi0xLjcwOC0xLjM2NC0yLjUzNS0uMTk1LS4zMjgtLjM3NS0uNjYyLS41NjgtLjk5IDEuNDgyLTEuNjYzIDIuNjc0LTMuNTg3IDMuMzY0LTUuNy43NTItMi4zMDYuODktNC43OS41NzQtNy4xOTYtLjMxNy0yLjQwNi0xLjA4LTQuNzM5LTIuMDgzLTYuOTQ3LTEuMjYtMi43NjgtMi4zMi0zLjc3LTMuMDg4LTYuMjAxLS44My0yLjYyOS0uMTQ1LTUuNzQtLjc2Mi04LjEyM2E4LjMzMyA4LjMzMyAwIDAgMC0xLjAyMS0yLjI5MyA3Ljg1NiA3Ljg1NiAwIDAgMC0xLjk5Ny0yLjE1QzI3LjAyNC40OSAyNS40MjYgMCAyMy44MDMgMFoiLz48L21hc2s+PGcgZmlsdGVyPSJ1cmwoI0UpIiBtYXNrPSJ1cmwoI0QpIiBvcGFjaXR5PSIuMiI+PHBhdGggZmlsbD0idXJsKCNGKSIgZD0iTTQxLjAwNiA0MC40MjdjLS4wNzUuMjUtLjE5MS40OTEtLjM0LjcxMi0uMzI3LjQ4Ni0uODA1Ljg1My0xLjI4MiAxLjE5MS0uODEyLjU3Ni0xLjY1OSAxLjEwNC0yLjQxNiAxLjc1OS0uNTA3LjQzOS0uOTcuOTMyLTEuMzk3IDEuNDUtLjM2Ni40NDItLjcxMS45MDctMS4xMyAxLjMtLjQyMS4zOTgtLjkxNi43Mi0xLjQ1Ljg5NWEzLjUyIDMuNTIgMCAwIDEtMS45NjMuMDQxYy0uNDQtLjExMi0uODY5LS4zMDctMS4xNC0uNjYyLS4yNzItLjM1NC0uMzYtLjgzMi0uMzkyLTEuMzAxLS4wNTctLjgyOS4wNDMtMS42NzQuMTMzLTIuNTE2LjA3NS0uNy4xNDQtMS40LjE3Mi0yLjA5Ny4wNS0xLjI2OS0uMDM0LTIuNTI1LS4yMDQtMy43NTlhMi44MTcgMi44MTcgMCAwIDEtLjA0My0uNjI4Yy4wMTctLjIxNC4wODgtLjQzNS4yMzgtLjYuMTM5LS4xNTIuMzMyLS4yNDIuNTIzLS4yODUuMTkxLS4wNDUuMzg2LS4wNDcuNTgtLjA1My40NTUtLjAxLjkxLS4wMzkgMS4zNTkuMDAyLjI4My4wMjUuNTYuMDc3Ljg0Mi4xMDMuNDcuMDQ1Ljk2LjAyMyAxLjQzMi0uMTE2LjUwOC0uMTUuOTkyLS40MyAxLjUxLS41MDYuMjExLS4wMzIuNDIzLS4wMjguNjMuMDAyLjIxLjAyOC40Mi4wODYuNTguMjE1LjEyNS4wOTguMjE1LjIzMS4yODQuMzczLjEwNS4yMTQuMTY5LjQ0OS4yMDYuNjkuMDMyLjIxNC4wNDUuNDM0LjEuNjQuMDkuMzQuMjk2LjYyOC41NDEuODYyLjI0OC4yMzUuNTM1LjQyLjgyNC42MDQuMjg2LjE4Mi41NzUuMzYyLjg4LjUxMi4xNDUuMDcxLjI5My4xMzUuNDMuMjE2LjEzOS4wODIuMjY2LjE4Mi4zNTguMzEzYS44ODUuODg1IDAgMCAxIC4xMzUuNjQzWiIvPjwvZz48cGF0aCBmaWxsPSJ1cmwoI0cpIiBkPSJNNDMuNzc2IDQxLjc5N2MtLjQyNC41MDMtMS4wMTMuODM1LTEuNiAxLjEzNS0xIC41MDgtMi4wMzYuOTU2LTIuOTc1IDEuNTctLjYzLjQxLTEuMjEyLjg5Mi0xLjc1NSAxLjQxMS0uNDY1LjQ0NS0uOTA2LjkxOS0xLjQyNyAxLjI5Ni0uNTI3LjM4LTEuMTM1LjY1Ni0xLjc3OC43NTItLjE3OC4wMjYtLjM1Ni4wMzktLjUzNi4wMzlhNC40NyA0LjQ3IDAgMCAxLTEuNzc0LS4zOWMtLjUwNi0uMjItLjk5NC0uNTM2LTEuMjg2LTEuMDA1LS4yOTMtLjQ3Mi0uMzYtMS4wNDgtLjM2LTEuNjA1LS4wMDItLjk4LjE4LTEuOTUyLjM1LTIuOTIuMTQzLS44MDQuMjc4LTEuNjA4LjM2Ni0yLjQyLjE2LTEuNDc0LjE1OC0yLjk2NC4wNTMtNC40NDYtLjAxOS0uMjQ3LS4wNC0uNDk2LS4wMDItLjc0Mi4wMzctLjI0Ni4xMzktLjQ5MS4zMjYtLjY1M2ExLjA1IDEuMDUgMCAwIDEgLjYzOC0uMjI4Yy4yMjgtLjAxNC40NTcuMDIyLjY4NC4wNTYuNTM0LjA3OSAxLjA3NC4xMzkgMS41OTcuMjc3LjMzLjA4Ny42NTMuMjAzLjk4MS4yOTMuNTUxLjE0OCAxLjEyNy4yMiAxLjY5MS4xNTQuNjEtLjA3MiAxLjIwMi0uMyAxLjgxNS0uMjg1LjI1Mi4wMDUuNTAxLjA1Mi43NDEuMTI5LjI0NC4wNzcuNDg2LjE4OC42NjYuMzcxLjEzNi4xMzkuMjMyLjMxMy4zMDMuNDk1LjEwNy4yNy4xNjUuNTU5LjE5Ljg0OC4wMi4yNTcuMDE3LjUxNy4wNjUuNzcuMDgxLjQxNS4zLjc5NS41NyAxLjEyLjI3Mi4zMjYuNTk3LjYwMi45MjEuODczLjMyNC4yNzIuNjQ5LjU0Mi45OTcuNzguMTY0LjExMy4zMzIuMjE4LjQ4OC4zNC4xNTYuMTI0LjI5OC4yNjYuMzk2LjQzOWExLjAyMyAxLjAyMyAwIDAgMSAuMDg2Ljc4OWMtLjA4NC4yNjgtLjI0LjUyOS0uNDMxLjc1OFoiLz48bWFzayBpZD0iSCIgd2lkdGg9IjE1IiBoZWlnaHQ9IjE1IiB4PSIzMCIgeT0iMzMiIG1hc2tVbml0cz0idXNlclNwYWNlT25Vc2UiIHN0eWxlPSJtYXNrLXR5cGU6bHVtaW5hbmNlIj48cGF0aCBmaWxsPSIjZmZmIiBkPSJNNDMuNzc2IDQxLjc5N2MtLjQyNC41MDMtMS4wMTMuODM1LTEuNiAxLjEzNS0xIC41MDgtMi4wMzYuOTU2LTIuOTc1IDEuNTctLjYzLjQxLTEuMjEyLjg5Mi0xLjc1NSAxLjQxMS0uNDY1LjQ0NS0uOTA2LjkxOS0xLjQyNyAxLjI5Ni0uNTI3LjM4LTEuMTM1LjY1Ni0xLjc3OC43NTItLjE3OC4wMjYtLjM1Ni4wMzktLjUzNi4wMzlhNC40NyA0LjQ3IDAgMCAxLTEuNzc0LS4zOWMtLjUwNi0uMjItLjk5NC0uNTM2LTEuMjg2LTEuMDA1LS4yOTMtLjQ3Mi0uMzYtMS4wNDgtLjM2LTEuNjA1LS4wMDItLjk4LjE4LTEuOTUyLjM1LTIuOTIuMTQzLS44MDQuMjc4LTEuNjA4LjM2Ni0yLjQyLjE2LTEuNDc0LjE1OC0yLjk2NC4wNTMtNC40NDYtLjAxOS0uMjQ3LS4wNC0uNDk2LS4wMDItLjc0Mi4wMzctLjI0Ni4xMzktLjQ5MS4zMjYtLjY1M2ExLjA1IDEuMDUgMCAwIDEgLjYzOC0uMjI4Yy4yMjgtLjAxNC40NTcuMDIyLjY4NC4wNTYuNTM0LjA3OSAxLjA3NC4xMzkgMS41OTcuMjc3LjMzLjA4Ny42NTMuMjAzLjk4MS4yOTMuNTUxLjE0OCAxLjEyNy4yMiAxLjY5MS4xNTQuNjEtLjA3MiAxLjIwMi0uMyAxLjgxNS0uMjg1LjI1Mi4wMDUuNTAxLjA1Mi43NDEuMTI5LjI0NC4wNzcuNDg2LjE4OC42NjYuMzcxLjEzNi4xMzkuMjMyLjMxMy4zMDMuNDk1LjEwNy4yNy4xNjUuNTU5LjE5Ljg0OC4wMi4yNTcuMDE3LjUxNy4wNjUuNzcuMDgxLjQxNS4zLjc5NS41NyAxLjEyLjI3Mi4zMjYuNTk3LjYwMi45MjEuODczLjMyNC4yNzIuNjQ5LjU0Mi45OTcuNzguMTY0LjExMy4zMzIuMjE4LjQ4OC4zNC4xNTYuMTI0LjI5OC4yNjYuMzk2LjQzOWExLjAyMyAxLjAyMyAwIDAgMSAuMDg2Ljc4OWMtLjA4NC4yNjgtLjI0LjUyOS0uNDMxLjc1OFoiLz48L21hc2s+PGcgZmlsdGVyPSJ1cmwoI0kpIiBtYXNrPSJ1cmwoI0gpIj48cGF0aCBmaWxsPSIjQ0Q4OTA3IiBkPSJNNDMuNzI3IDQwLjUyM2MtLjEuMjQ5LS4yNC40ODMtLjQxNi42ODgtLjM4OS40NTMtLjkyNS43NTItMS40NiAxLjAyLS45MTQuNDU3LTEuODYuODU4LTIuNzE4IDEuNDEtLjU3NC4zNjktMS4xMDYuODAyLTEuNjAzIDEuMjctLjQyNC40LS44MjcuODI4LTEuMzAzIDEuMTY1YTMuNzY3IDMuNzY3IDAgMCAxLTEuNjIyLjY3NWMtLjcxMi4xMDUtMS40NDctLjAzLTIuMTEtLjMxMy0uNDYtLjE5OS0uOTA3LS40OC0xLjE3NS0uOTA2LS4yNjYtLjQyMy0uMzI4LS45NC0uMzI4LTEuNDQxLS4wMDQtLjg4My4xNjMtMS43NTcuMzItMi42MjUuMTMyLS43MjIuMjU1LTEuNDQ2LjMzNC0yLjE3NS4xNDMtMS4zMjguMTM3LTIuNjY3LjA0Ny0zLjk5OC0uMDE1LS4yMjMtLjAzMi0uNDQ4LjAwMi0uNjcuMDM0LS4yMi4xMjYtLjQ0LjI5NC0uNTg2YS45NTYuOTU2IDAgMCAxIC41ODMtLjIwNmMuMjA5LS4wMTIuNDE3LjAyMi42MjUuMDUyLjQ5LjA3MS45OC4xMjYgMS40NTkuMjUuMzAyLjA3OC41OTYuMTgzLjg5Ni4yNjIuNTAyLjEzNSAxLjAzLjE5OSAxLjU0NS4xMzkuNTU3LS4wNjQgMS4wOTctLjI3IDEuNjU1LS4yNTcuMjMxLjAwNS40NTguMDQ5LjY3Ny4xMTYuMjI0LjA3LjQ0NS4xNjkuNjEuMzM0LjEyMy4xMjYuMjA4LjI4My4yNzcuNDQ2LjEuMjQyLjE2Ny41LjE3Ljc2My4wMDcuMjc0LS4wNTIuNTQ4LS4wMTYuODIuMDMuMjE5LjEyNC40MjcuMjQ0LjYxNS4xMTguMTg3LjI2Mi4zNTguNDA3LjUyNi4yNzcuMzI5LjU1NS42NjIuOTAzLjkxNC4zOTYuMjg2Ljg2Ny40NTUgMS4yNzUuNzIxLjEyMi4wODEuMjQuMTcxLjMyNy4yOWEuNzY3Ljc2NyAwIDAgMSAuMS43WiIvPjwvZz48bWFzayBpZD0iSiIgd2lkdGg9IjE1IiBoZWlnaHQ9IjE1IiB4PSIzMCIgeT0iMzMiIG1hc2tVbml0cz0idXNlclNwYWNlT25Vc2UiIHN0eWxlPSJtYXNrLXR5cGU6bHVtaW5hbmNlIj48cGF0aCBmaWxsPSIjZmZmIiBkPSJNNDMuNzc2IDQxLjc5N2MtLjQyNC41MDMtMS4wMTMuODM1LTEuNiAxLjEzNS0xIC41MDgtMi4wMzYuOTU2LTIuOTc1IDEuNTctLjYzLjQxLTEuMjEyLjg5Mi0xLjc1NSAxLjQxMS0uNDY1LjQ0NS0uOTA2LjkxOS0xLjQyNyAxLjI5Ni0uNTI3LjM4LTEuMTM1LjY1Ni0xLjc3OC43NTItLjE3OC4wMjYtLjM1Ni4wMzktLjUzNi4wMzlhNC40NyA0LjQ3IDAgMCAxLTEuNzc0LS4zOWMtLjUwNi0uMjItLjk5NC0uNTM2LTEuMjg2LTEuMDA1LS4yOTMtLjQ3Mi0uMzYtMS4wNDgtLjM2LTEuNjA1LS4wMDItLjk4LjE4LTEuOTUyLjM1LTIuOTIuMTQzLS44MDQuMjc4LTEuNjA4LjM2Ni0yLjQyLjE2LTEuNDc0LjE1OC0yLjk2NC4wNTMtNC40NDYtLjAxOS0uMjQ3LS4wNC0uNDk2LS4wMDItLjc0Mi4wMzctLjI0Ni4xMzktLjQ5MS4zMjYtLjY1M2ExLjA1IDEuMDUgMCAwIDEgLjYzOC0uMjI4Yy4yMjgtLjAxNC40NTcuMDIyLjY4NC4wNTYuNTM0LjA3OSAxLjA3NC4xMzkgMS41OTcuMjc3LjMzLjA4Ny42NTMuMjAzLjk4MS4yOTMuNTUxLjE0OCAxLjEyNy4yMiAxLjY5MS4xNTQuNjEtLjA3MiAxLjIwMi0uMyAxLjgxNS0uMjg1LjI1Mi4wMDUuNTAxLjA1Mi43NDEuMTI5LjI0NC4wNzcuNDg2LjE4OC42NjYuMzcxLjEzNi4xMzkuMjMyLjMxMy4zMDMuNDk1LjEwNy4yNy4xNjUuNTU5LjE5Ljg0OC4wMi4yNTcuMDE3LjUxNy4wNjUuNzcuMDgxLjQxNS4zLjc5NS41NyAxLjEyLjI3Mi4zMjYuNTk3LjYwMi45MjEuODczLjMyNC4yNzIuNjQ5LjU0Mi45OTcuNzguMTY0LjExMy4zMzIuMjE4LjQ4OC4zNC4xNTYuMTI0LjI5OC4yNjYuMzk2LjQzOWExLjAyMyAxLjAyMyAwIDAgMSAuMDg2Ljc4OWMtLjA4NC4yNjgtLjI0LjUyOS0uNDMxLjc1OFoiLz48L21hc2s+PGcgZmlsdGVyPSJ1cmwoI0spIiBtYXNrPSJ1cmwoI0opIj48cGF0aCBmaWxsPSIjRjVDMDIxIiBkPSJNNDMuNjcgNDAuMjRhMy4wNTEgMy4wNTEgMCAwIDEtLjQyNy42OTVjLS4zOTcuNDg0LS45MzYuODE2LTEuNSAxLjAzLS45MzIuMzUyLTEuOTQ4LjM5OS0yLjg2MS44LS41NTcuMjQ0LTEuMDYuNjExLTEuNTY4Ljk2LS40MDguMjgtLjgyOC41NTEtMS4yNzguNzQ2LS41MS4yMjMtMS4wNS4zNDctMS41OTQuNDM1YTUuMDAyIDUuMDAyIDAgMCAxLTEuMDQ0LjA3NyAyLjI0NyAyLjI0NyAwIDAgMS0xLjAwNy0uMjggMS40MTQgMS40MTQgMCAwIDEtLjU2OC0uNThjLS4xMzctLjI4LS4xNjItLjYwOC0uMTYtLjkyNy4wMS0uODQzLjE5MS0xLjY4LjE4Ni0yLjUyNS0uMDA2LS43MzctLjE1Mi0xLjQ2My0uMTkzLTIuMTk4LS4wODEtMS40MTQuMjIzLTIuODUtLjA0NS00LjIzNi0uMDQyLS4yMjMtLjEtLjQ0NC0uMDk4LS42N2EuOTk3Ljk5NyAwIDAgMSAuMDU4LS4zMzMuNjQ4LjY0OCAwIDAgMSAuMTktLjI2Ni41OTcuNTk3IDAgMCAxIC4yNDUtLjEwNS44MzQuODM0IDAgMCAxIC4yNjUuMDAyYy4xNzQuMDI4LjM0LjA5Ni41MTEuMTQ2LjQ4OC4xNDYgMS4wMDQuMTQzIDEuNS4yNTMuMzEyLjA2OC42MTIuMTgyLjkyMS4yNjVhNC4xNjYgNC4xNjYgMCAwIDAgMS41ODYuMTRjLjU3LS4wNjcgMS4xMjctLjI3MyAxLjcwMS0uMjU4LjIzNi4wMDUuNDY5LjA0OC42OTYuMTE2LjIyNy4wNjcuNDUzLjE2My42MjYuMzM3LjEyMi4xMjYuMjEyLjI4NS4yODMuNDUuMTA3LjI0Mi4xOC41MDUuMTc4Ljc3MS0uMDAyLjEzOS0uMDIyLjI3Ni0uMDM2LjQxNGExLjMyIDEuMzIgMCAwIDAgLjAxNy40MTNjLjAzNC4xMzUuMTA0LjI1Ny4xODIuMzY3LjA3OS4xMTEuMTY5LjIxLjI1Mi4zMi4yMjguMzAxLjM5My42NTQuNTcxLjk5My4xNzguMzQuMzguNjc1LjY2Mi45Mi4zODUuMzMyLjg4Mi40NjUgMS4zMS43My4xMjcuMDc3LjI0Ni4xNjcuMzM1LjI5YS43NzMuNzczIDAgMCAxIC4xMzYuMzQuODQuODQgMCAwIDEtLjAzMS4zNjdaIi8+PC9nPjxtYXNrIGlkPSJMIiB3aWR0aD0iMTUiIGhlaWdodD0iMTUiIHg9IjMwIiB5PSIzMyIgbWFza1VuaXRzPSJ1c2VyU3BhY2VPblVzZSIgc3R5bGU9Im1hc2stdHlwZTpsdW1pbmFuY2UiPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik00My43NzYgNDEuNzk3Yy0uNDI0LjUwMy0xLjAxMy44MzUtMS42IDEuMTM1LTEgLjUwOC0yLjAzNi45NTYtMi45NzUgMS41Ny0uNjMuNDEtMS4yMTIuODkyLTEuNzU1IDEuNDExLS40NjUuNDQ1LS45MDYuOTE5LTEuNDI3IDEuMjk2LS41MjcuMzgtMS4xMzUuNjU2LTEuNzc4Ljc1Mi0uMTc4LjAyNi0uMzU2LjAzOS0uNTM2LjAzOWE0LjQ3IDQuNDcgMCAwIDEtMS43NzQtLjM5Yy0uNTA2LS4yMi0uOTk0LS41MzYtMS4yODYtMS4wMDUtLjI5My0uNDcyLS4zNi0xLjA0OC0uMzYtMS42MDUtLjAwMi0uOTguMTgtMS45NTIuMzUtMi45Mi4xNDMtLjgwNC4yNzgtMS42MDguMzY2LTIuNDIuMTYtMS40NzQuMTU4LTIuOTY0LjA1My00LjQ0Ni0uMDE5LS4yNDctLjA0LS40OTYtLjAwMi0uNzQyLjAzNy0uMjQ2LjEzOS0uNDkxLjMyNi0uNjUzYTEuMDUgMS4wNSAwIDAgMSAuNjM4LS4yMjhjLjIyOC0uMDE0LjQ1Ny4wMjIuNjg0LjA1Ni41MzQuMDc5IDEuMDc0LjEzOSAxLjU5Ny4yNzcuMzMuMDg3LjY1My4yMDMuOTgxLjI5My41NTEuMTQ4IDEuMTI3LjIyIDEuNjkxLjE1NC42MS0uMDcyIDEuMjAyLS4zIDEuODE1LS4yODUuMjUyLjAwNS41MDEuMDUyLjc0MS4xMjkuMjQ0LjA3Ny40ODYuMTg4LjY2Ni4zNzEuMTM2LjEzOS4yMzIuMzEzLjMwMy40OTUuMTA3LjI3LjE2NS41NTkuMTkuODQ4LjAyLjI1Ny4wMTcuNTE3LjA2NS43Ny4wODEuNDE1LjMuNzk1LjU3IDEuMTIuMjcyLjMyNi41OTcuNjAyLjkyMS44NzMuMzI0LjI3Mi42NDkuNTQyLjk5Ny43OC4xNjQuMTEzLjMzMi4yMTguNDg4LjM0LjE1Ni4xMjQuMjk4LjI2Ni4zOTYuNDM5YTEuMDIzIDEuMDIzIDAgMCAxIC4wODYuNzg5Yy0uMDg0LjI2OC0uMjQuNTI5LS40MzEuNzU4WiIvPjwvbWFzaz48ZyBmaWx0ZXI9InVybCgjTSkiIG1hc2s9InVybCgjTCkiPjxwYXRoIGZpbGw9InVybCgjTikiIGQ9Ik0zMS41MTUgMzQuMDQ2Yy41MjktLjE0Mi45NzkuMjU5IDEuMzYzLjU2LjI0OC4yMTMuNjA4LjE2LjkxMS4xNy41MDUtLjAxNyAxLjAwNS4wODQgMS41MS4wMjIuOTkzLS4wODQgMS45NjctLjMyOCAyLjk2NC0uMzcuNDc2LS4wMyAxLjAxMy0uMDU3IDEuNDIzLjIyLjE2Ny4xMTYuNDEzLjYwNi41NzYuNDIyLS4wNjgtLjUxNC0uNDQ4LTEuMDEtLjk1OC0xLjE0OC0uNDAxLS4wNjMtLjgwNi4wNDctMS4yMTIuMDEyLTEuMTk4LS4wMjgtMi4zOS0uMjUyLTMuNTkyLS4xODgtLjgzNi4wMDgtMS42Ny0uMDMyLTIuNTA3LS4wNjQtLjMyOC0uMDY3LS40NDQuMjI0LS42MjIuMzM2LjA0Ny4wMzYuMDYzLjA0Ny4xNDQuMDI4WiIvPjwvZz48bWFzayBpZD0iTyIgd2lkdGg9IjE1IiBoZWlnaHQ9IjE1IiB4PSIzMCIgeT0iMzMiIG1hc2tVbml0cz0idXNlclNwYWNlT25Vc2UiIHN0eWxlPSJtYXNrLXR5cGU6bHVtaW5hbmNlIj48cGF0aCBmaWxsPSIjZmZmIiBkPSJNNDMuNzc2IDQxLjc5N2MtLjQyNC41MDMtMS4wMTMuODM1LTEuNiAxLjEzNS0xIC41MDgtMi4wMzYuOTU2LTIuOTc1IDEuNTctLjYzLjQxLTEuMjEyLjg5Mi0xLjc1NSAxLjQxMS0uNDY1LjQ0NS0uOTA2LjkxOS0xLjQyNyAxLjI5Ni0uNTI3LjM4LTEuMTM1LjY1Ni0xLjc3OC43NTItLjE3OC4wMjYtLjM1Ni4wMzktLjUzNi4wMzlhNC40NyA0LjQ3IDAgMCAxLTEuNzc0LS4zOWMtLjUwNi0uMjItLjk5NC0uNTM2LTEuMjg2LTEuMDA1LS4yOTMtLjQ3Mi0uMzYtMS4wNDgtLjM2LTEuNjA1LS4wMDItLjk4LjE4LTEuOTUyLjM1LTIuOTIuMTQzLS44MDQuMjc4LTEuNjA4LjM2Ni0yLjQyLjE2LTEuNDc0LjE1OC0yLjk2NC4wNTMtNC40NDYtLjAxOS0uMjQ3LS4wNC0uNDk2LS4wMDItLjc0Mi4wMzctLjI0Ni4xMzktLjQ5MS4zMjYtLjY1M2ExLjA1IDEuMDUgMCAwIDEgLjYzOC0uMjI4Yy4yMjgtLjAxNC40NTcuMDIyLjY4NC4wNTYuNTM0LjA3OSAxLjA3NC4xMzkgMS41OTcuMjc3LjMzLjA4Ny42NTMuMjAzLjk4MS4yOTMuNTUxLjE0OCAxLjEyNy4yMiAxLjY5MS4xNTQuNjEtLjA3MiAxLjIwMi0uMyAxLjgxNS0uMjg1LjI1Mi4wMDUuNTAxLjA1Mi43NDEuMTI5LjI0NC4wNzcuNDg2LjE4OC42NjYuMzcxLjEzNi4xMzkuMjMyLjMxMy4zMDMuNDk1LjEwNy4yNy4xNjUuNTU5LjE5Ljg0OC4wMi4yNTcuMDE3LjUxNy4wNjUuNzcuMDgxLjQxNS4zLjc5NS41NyAxLjEyLjI3Mi4zMjYuNTk3LjYwMi45MjEuODczLjMyNC4yNzIuNjQ5LjU0Mi45OTcuNzguMTY0LjExMy4zMzIuMjE4LjQ4OC4zNC4xNTYuMTI0LjI5OC4yNjYuMzk2LjQzOWExLjAyMyAxLjAyMyAwIDAgMSAuMDg2Ljc4OWMtLjA4NC4yNjgtLjI0LjUyOS0uNDMxLjc1OFoiLz48L21hc2s+PGcgZmlsdGVyPSJ1cmwoI1ApIiBtYXNrPSJ1cmwoI08pIiBvcGFjaXR5PSIuMzUiPjxwYXRoIGZpbGw9InVybCgjUSkiIGQ9Ik0zOC41MyAzNS4xNzdhLjg1Mi44NTIgMCAwIDAtLjQ0MS0uMzg4IDEuNDg1IDEuNDg1IDAgMCAwLS41ODctLjEwMmMtLjQuMDA0LS43OTcuMTA3LTEuMTk2LjA3NC0uMzM2LS4wMy0uNjU1LS4xNTYtLjk4My0uMjM3LS4zNC0uMDgyLS43LS4xMTQtMS4wMzUtLjAyMi0uMzYuMDk3LS42NzcuMzQtLjg3NS42NTQtLjE3Ny4yNzgtLjI2LjYwNi0uMjg1LjkzNC0uMDI3LjMyOC4wMDEuNjU2LjAzNS45ODQuMDIzLjIzNy4wNS40NzMuMTA3LjcwNGExLjkgMS45IDAgMCAwIC4yODUuNjQ4Yy4yLjI3OC40OTkuNDc3LjgyLjU5NWEyLjI4MSAyLjI4MSAwIDAgMCAxLjYzNi0uMDI5IDQuNTE0IDQuNTE0IDAgMCAwIDIuMTYtMS45ODdjLjE3LS4zMTUuMzAyLS42NS4zODYtLjk5Ni4wMzQtLjEzOC4wNi0uMjc5LjA2LS40MjJhLjg2My44NjMgMCAwIDAtLjA4OC0uNDFaIi8+PC9nPjxtYXNrIGlkPSJSIiB3aWR0aD0iMTUiIGhlaWdodD0iMTUiIHg9IjMwIiB5PSIzMyIgbWFza1VuaXRzPSJ1c2VyU3BhY2VPblVzZSIgc3R5bGU9Im1hc2stdHlwZTpsdW1pbmFuY2UiPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik00My43NzYgNDEuNzk3Yy0uNDI0LjUwMy0xLjAxMy44MzUtMS42IDEuMTM1LTEgLjUwOC0yLjAzNi45NTYtMi45NzUgMS41Ny0uNjMuNDEtMS4yMTIuODkyLTEuNzU1IDEuNDExLS40NjUuNDQ1LS45MDYuOTE5LTEuNDI3IDEuMjk2LS41MjcuMzgtMS4xMzUuNjU2LTEuNzc4Ljc1Mi0uMTc4LjAyNi0uMzU2LjAzOS0uNTM2LjAzOWE0LjQ3IDQuNDcgMCAwIDEtMS43NzQtLjM5Yy0uNTA2LS4yMi0uOTk0LS41MzYtMS4yODYtMS4wMDUtLjI5My0uNDcyLS4zNi0xLjA0OC0uMzYtMS42MDUtLjAwMi0uOTguMTgtMS45NTIuMzUtMi45Mi4xNDMtLjgwNC4yNzgtMS42MDguMzY2LTIuNDIuMTYtMS40NzQuMTU4LTIuOTY0LjA1My00LjQ0Ni0uMDE5LS4yNDctLjA0LS40OTYtLjAwMi0uNzQyLjAzNy0uMjQ2LjEzOS0uNDkxLjMyNi0uNjUzYTEuMDUgMS4wNSAwIDAgMSAuNjM4LS4yMjhjLjIyOC0uMDE0LjQ1Ny4wMjIuNjg0LjA1Ni41MzQuMDc5IDEuMDc0LjEzOSAxLjU5Ny4yNzcuMzMuMDg3LjY1My4yMDMuOTgxLjI5My41NTEuMTQ4IDEuMTI3LjIyIDEuNjkxLjE1NC42MS0uMDcyIDEuMjAyLS4zIDEuODE1LS4yODUuMjUyLjAwNS41MDEuMDUyLjc0MS4xMjkuMjQ0LjA3Ny40ODYuMTg4LjY2Ni4zNzEuMTM2LjEzOS4yMzIuMzEzLjMwMy40OTUuMTA3LjI3LjE2NS41NTkuMTkuODQ4LjAyLjI1Ny4wMTcuNTE3LjA2NS43Ny4wODEuNDE1LjMuNzk1LjU3IDEuMTIuMjcyLjMyNi41OTcuNjAyLjkyMS44NzMuMzI0LjI3Mi42NDkuNTQyLjk5Ny43OC4xNjQuMTEzLjMzMi4yMTguNDg4LjM0LjE1Ni4xMjQuMjk4LjI2Ni4zOTYuNDM5YTEuMDIzIDEuMDIzIDAgMCAxIC4wODYuNzg5Yy0uMDg0LjI2OC0uMjQuNTI5LS40MzEuNzU4WiIvPjwvbWFzaz48ZyBmaWx0ZXI9InVybCgjUykiIG1hc2s9InVybCgjUikiIG9wYWNpdHk9Ii4zNSI+PHBhdGggZmlsbD0idXJsKCNUKSIgZD0iTTM4LjUzIDM0LjY2N2MtLjA5LS4xMy0uMjU2LS4yMjUtLjQ0MS0uMjgxYTIuMDI2IDIuMDI2IDAgMCAwLS41ODctLjA3NGMtLjQuMDA0LS43OTcuMDgtMS4xOTYuMDUzLS4zMzYtLjAyLS42NTUtLjExMy0uOTgzLS4xNjktLjM0LS4wNi0uNy0uMDg0LTEuMDM1LS4wMTctLjM2LjA3LS42NzcuMjQ0LS44NzUuNDczLS4xNzcuMi0uMjYuNDM5LS4yODUuNjc1LS4wMjcuMjM2LjAwMS40NzQuMDM1LjcxLjAyMy4xNzEuMDUuMzQ0LjEwNy41MS4wNTguMTY3LjE0Ni4zMy4yODUuNDcuMi4yLjQ5OS4zNDIuODIuNDI5YTMuMDkgMy4wOSAwIDAgMCAxLjYzNi0uMDIxYy45MTUtLjI4NyAxLjY5LS44MDIgMi4xNi0xLjQzNi4xNy0uMjI5LjMwMi0uNDcuMzg2LS43MmEuOTcuOTcgMCAwIDAgLjA2LS4zMDQuNDgzLjQ4MyAwIDAgMC0uMDg4LS4yOThaIi8+PC9nPjxwYXRoIGZpbGw9IiMwMjAyMDQiIGQ9Ik0zOS4yOSAzMy41MWExLjE5IDEuMTkgMCAwIDAtLjMyMi0uNDYzIDEuNzMyIDEuNzMyIDAgMCAwLS40ODItLjNjLS4zNDgtLjE0OC0uNzMtLjIwNS0xLjEwNC0uMjc0LS4zNS0uMDY2LS43MDEtLjE0Ni0xLjA1NC0uMjA2LS4zNjctLjA2Mi0uNzQ2LS4xMDMtMS4xMS0uMDJhMS44OTQgMS44OTQgMCAwIDAtLjg1MS40NTUgMi40MyAyLjQzIDAgMCAwLS41NjMuNzljLS4yMzguNTIyLS4zMTMgMS4xMS0uMjY4IDEuNjgxLjAzNC40MjYuMTQzLjg2NC40MjIgMS4xODUuMjI3LjI2LjU0OC40MjQuODc4LjUyMS41Ny4xNyAxLjE5LjE2IDEuNzU1LS4wMjRhNC42MzIgNC42MzIgMCAwIDAgMi4zMTUtMS43NDJjLjE4NC0uMjY4LjM0Mi0uNTU5LjQxMy0uODc0LjA1NC0uMjQuMDU2LS40OTgtLjAyOC0uNzI5WiIvPjxtYXNrIGlkPSJVIiB3aWR0aD0iNyIgaGVpZ2h0PSI1IiB4PSIzMyIgeT0iMzIiIG1hc2tVbml0cz0idXNlclNwYWNlT25Vc2UiIHN0eWxlPSJtYXNrLXR5cGU6bHVtaW5hbmNlIj48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMzkuMjkgMzMuNTFhMS4xOSAxLjE5IDAgMCAwLS4zMjItLjQ2MyAxLjczMiAxLjczMiAwIDAgMC0uNDgyLS4zYy0uMzQ4LS4xNDgtLjczLS4yMDUtMS4xMDQtLjI3NC0uMzUtLjA2Ni0uNzAxLS4xNDYtMS4wNTQtLjIwNi0uMzY3LS4wNjItLjc0Ni0uMTAzLTEuMTEtLjAyYTEuODk0IDEuODk0IDAgMCAwLS44NTEuNDU1IDIuNDMgMi40MyAwIDAgMC0uNTYzLjc5Yy0uMjM4LjUyMi0uMzEzIDEuMTEtLjI2OCAxLjY4MS4wMzQuNDI2LjE0My44NjQuNDIyIDEuMTg1LjIyNy4yNi41NDguNDI0Ljg3OC41MjEuNTcuMTcgMS4xOS4xNiAxLjc1NS0uMDI0YTQuNjMyIDQuNjMyIDAgMCAwIDIuMzE1LTEuNzQyYy4xODQtLjI2OC4zNDItLjU1OS40MTMtLjg3NC4wNTQtLjI0LjA1Ni0uNDk4LS4wMjgtLjcyOVoiLz48L21hc2s+PGcgZmlsdGVyPSJ1cmwoI1YpIiBtYXNrPSJ1cmwoI1UpIj48cGF0aCBmaWxsPSJ1cmwoI1cpIiBkPSJNMzUuNDE3IDMyLjA3NmEyLjAxNSAyLjAxNSAwIDAgMC0xLjYyNi45NzUgMi4wMTQgMi4wMTQgMCAwIDAtLjI2OCAxLjE1NyAxLjgyIDEuODIgMCAwIDEgLjIyMy0uODAzYy4yMy0uNDE4LjY1LS43MzMgMS4xMjEtLjgyLjI5LS4wNTIuNTg3LS4wMi44NzguMDE2LjI4MS4wMzUuNTYzLjA3My44MzguMTMuNDI4LjA5NS44NS4yMzcgMS4yMDguNDg2LjA4Mi4wNTkuMTYuMTI0LjIyNy4yMDNhLjYwNC42MDQgMCAwIDEgLjEzNi4yNjYuNjQyLjY0MiAwIDAgMS0uMDg2LjQzIDEuNjEgMS42MSAwIDAgMS0uMjc3LjM0OCA1LjYxNCA1LjYxNCAwIDAgMS0uMjY4LjI0OGMuNDE0LS4wOC44MzItLjE5MyAxLjE3Ny0uNDMzLjE0NC0uMTAzLjI3Ny0uMjI1LjM2NC0uMzc5YS43My43MyAwIDAgMCAuMDgtLjUxNi43OC43OCAwIDAgMC0uMTcyLS4zMTMgMS41NCAxLjU0IDAgMCAwLS4yNzItLjIzMiAzLjIzOCAzLjIzOCAwIDAgMC0xLjQ2NC0uNTYgMTYuOTgzIDE2Ljk4MyAwIDAgMC0xLjAxNy0uMTU3IDQuNDIxIDQuNDIxIDAgMCAwLS44MDItLjA0NloiLz48L2c+PG1hc2sgaWQ9IlgiIHdpZHRoPSI3IiBoZWlnaHQ9IjUiIHg9IjMzIiB5PSIzMiIgbWFza1VuaXRzPSJ1c2VyU3BhY2VPblVzZSIgc3R5bGU9Im1hc2stdHlwZTpsdW1pbmFuY2UiPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0zOS4yOSAzMy41MWExLjE5IDEuMTkgMCAwIDAtLjMyMi0uNDYzIDEuNzMyIDEuNzMyIDAgMCAwLS40ODItLjNjLS4zNDgtLjE0OC0uNzMtLjIwNS0xLjEwNC0uMjc0LS4zNS0uMDY2LS43MDEtLjE0Ni0xLjA1NC0uMjA2LS4zNjctLjA2Mi0uNzQ2LS4xMDMtMS4xMS0uMDJhMS44OTQgMS44OTQgMCAwIDAtLjg1MS40NTUgMi40MyAyLjQzIDAgMCAwLS41NjMuNzljLS4yMzguNTIyLS4zMTMgMS4xMS0uMjY4IDEuNjgxLjAzNC40MjYuMTQzLjg2NC40MjIgMS4xODUuMjI3LjI2LjU0OC40MjQuODc4LjUyMS41Ny4xNyAxLjE5LjE2IDEuNzU1LS4wMjRhNC42MzIgNC42MzIgMCAwIDAgMi4zMTUtMS43NDJjLjE4NC0uMjY4LjM0Mi0uNTU5LjQxMy0uODc0LjA1NC0uMjQuMDU2LS40OTgtLjAyOC0uNzI5WiIvPjwvbWFzaz48ZyBmaWx0ZXI9InVybCgjWSkiIG1hc2s9InVybCgjWCkiPjxwYXRoIGZpbGw9InVybCgjWikiIGQ9Ik0zNS40MTcgMzIuMDc2YTIuMDE1IDIuMDE1IDAgMCAwLTEuNjI2Ljk3NSAyLjAxNCAyLjAxNCAwIDAgMC0uMjY4IDEuMTU3IDEuODIgMS44MiAwIDAgMSAuMjIzLS44MDNjLjIzLS40MTguNjUtLjczMyAxLjEyMS0uODIuMjktLjA1Mi41ODctLjAyLjg3OC4wMTYuMjgxLjAzNS41NjMuMDczLjgzOC4xMy40MjguMDk1Ljg1LjIzNyAxLjIwOC40ODYuMDgyLjA1OS4xNi4xMjQuMjI3LjIwM2EuNjA0LjYwNCAwIDAgMSAuMTM2LjI2Ni42NDIuNjQyIDAgMCAxLS4wODYuNDMgMS42MSAxLjYxIDAgMCAxLS4yNzcuMzQ4IDUuNjE0IDUuNjE0IDAgMCAxLS4yNjguMjQ4Yy40MTQtLjA4LjgzMi0uMTkzIDEuMTc3LS40MzMuMTQ0LS4xMDMuMjc3LS4yMjUuMzY0LS4zNzlhLjczLjczIDAgMCAwIC4wOC0uNTE2Ljc4Ljc4IDAgMCAwLS4xNzItLjMxMyAxLjU0IDEuNTQgMCAwIDAtLjI3Mi0uMjMyIDMuMjM4IDMuMjM4IDAgMCAwLTEuNDY0LS41NiAxNi45ODMgMTYuOTgzIDAgMCAwLTEuMDE3LS4xNTcgNC40MjEgNC40MjEgMCAwIDAtLjgwMi0uMDQ2WiIvPjwvZz48cGF0aCBmaWxsPSJ1cmwoI2FhKSIgZD0iTTE5LjU4NCA3LjE3N2ExLjI0NiAxLjI0NiAwIDAgMC0uNzcyLjM0NWMtLjIxMi4xOTctLjM2LjQ1Ni0uNDUyLjcyOC0uMTgyLjU0Ny0uMTQgMS4xNC0uMSAxLjcxNi4wMzguNTE5LjA3NyAxLjA1LjI3MiAxLjUzMy4wOTguMjQ0LjIzNS40NzEuNDE3LjY1OS4xODIuMTg1LjQxMi4zMy42NjUuMzkxLjIzNy4wNi40OTIuMDUuNzI0LS4wMjQuMjM1LS4wNzUuNDQ2LS4yMDguNjIzLS4zNzkuMjU1LS4yNS40MjUtLjU3NS41MjUtLjkxOS4wOTktLjM0My4xMjctLjcwMy4xMjItMS4wNmE0LjQ3OCA0LjQ3OCAwIDAgMC0uMjA1LTEuMzE5IDIuOTkzIDIuOTkzIDAgMCAwLS42NzUtMS4xNDYgMS44ODcgMS44ODcgMCAwIDAtLjUxNi0uMzg2IDEuMjg4IDEuMjg4IDAgMCAwLS42MjgtLjEzOVoiLz48cGF0aCBmaWxsPSIjMDIwMjA0IiBkPSJNMTguODkgOS41NmMtLjA2LjM2NC0uMDYxLjc0NS4wNjMgMS4wOS4wODIuMjI5LjIxOS40MzcuMzg0LjYxNS4xMDcuMTE2LjIzLjIyMS4zNzMuMjkuMTQ0LjA3LjMxLjA5OC40NjUuMDZhLjY4Mi42ODIgMCAwIDAgLjM1OC0uMjQxYy4wOTItLjExNS4xNTQtLjI1Mi4xOTctLjM5Mi4xMy0uNDE0LjEwOS0uODY2LS4wMi0xLjI4LS4wOTMtLjMwMy0uMjQ4LS41OTMtLjQ4OC0uNzk2YS45NjcuOTY3IDAgMCAwLS4zOTgtLjIwOC42OS42OSAwIDAgMC0uNDQyLjAzNmMtLjE1Mi4wNy0uMjcuMi0uMzQ3LjM0OGExLjYyNCAxLjYyNCAwIDAgMC0uMTQ0LjQ3OVoiLz48bWFzayBpZD0iYWIiIHdpZHRoPSIzIiBoZWlnaHQ9IjQiIHg9IjE4IiB5PSI4IiBtYXNrVW5pdHM9InVzZXJTcGFjZU9uVXNlIiBzdHlsZT0ibWFzay10eXBlOmx1bWluYW5jZSI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTE4Ljg5IDkuNTZjLS4wNi4zNjQtLjA2MS43NDUuMDYzIDEuMDkuMDgyLjIyOS4yMTkuNDM3LjM4NC42MTUuMTA3LjExNi4yMy4yMjEuMzczLjI5LjE0NC4wNy4zMS4wOTguNDY1LjA2YS42ODIuNjgyIDAgMCAwIC4zNTgtLjI0MWMuMDkyLS4xMTUuMTU0LS4yNTIuMTk3LS4zOTIuMTMtLjQxNC4xMDktLjg2Ni0uMDItMS4yOC0uMDkzLS4zMDMtLjI0OC0uNTkzLS40ODgtLjc5NmEuOTY3Ljk2NyAwIDAgMC0uMzk4LS4yMDguNjkuNjkgMCAwIDAtLjQ0Mi4wMzZjLS4xNTIuMDctLjI3LjItLjM0Ny4zNDhhMS42MjQgMS42MjQgMCAwIDAtLjE0NC40NzlaIi8+PC9tYXNrPjxnIGZpbHRlcj0idXJsKCNhYykiIG1hc2s9InVybCgjYWIpIj48cGF0aCBmaWxsPSJ1cmwoI2FkKSIgZD0iTTE5LjY1NyA5LjI5OGMuMDQuMTAzLjE3MS4xNC4yNDQuMjIzYS45NC45NCAwIDAgMSAuMTgyLjI2M2MuMDczLjE5LS4wNzMuNDcuMDguNjA1LjA0OC4wNDIuMTQ1LjA0My4xOTIgMCAuMTg2LS4xNjguMTQ0LS41MDguMDcxLS43NDhhLjkxMi45MTIgMCAwIDAtLjQzMy0uNTI1Yy0uMDk0LS4wNDktLjIzNC0uMDg4LS4zMTUtLjAyLS4wNS4wNDUtLjA0NS4xMzgtLjAyLjIwMloiLz48L2c+PG1hc2sgaWQ9ImFlIiB3aWR0aD0iNCIgaGVpZ2h0PSI2IiB4PSIxOCIgeT0iNyIgbWFza1VuaXRzPSJ1c2VyU3BhY2VPblVzZSIgc3R5bGU9Im1hc2stdHlwZTpsdW1pbmFuY2UiPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xOS41ODQgNy4xNzdhMS4yNDYgMS4yNDYgMCAwIDAtLjc3Mi4zNDVjLS4yMTIuMTk3LS4zNi40NTYtLjQ1Mi43MjgtLjE4Mi41NDctLjE0IDEuMTQtLjEgMS43MTYuMDM4LjUxOS4wNzcgMS4wNS4yNzIgMS41MzMuMDk4LjI0NC4yMzUuNDcxLjQxNy42NTkuMTgyLjE4NS40MTIuMzMuNjY1LjM5MS4yMzcuMDYuNDkyLjA1LjcyNC0uMDI0LjIzNS0uMDc1LjQ0Ni0uMjA4LjYyMy0uMzc5LjI1NS0uMjUuNDI1LS41NzUuNTI1LS45MTkuMDk5LS4zNDMuMTI3LS43MDMuMTIyLTEuMDZhNC40NzggNC40NzggMCAwIDAtLjIwNS0xLjMxOSAyLjk5MyAyLjk5MyAwIDAgMC0uNjc1LTEuMTQ2IDEuODg3IDEuODg3IDAgMCAwLS41MTYtLjM4NiAxLjI4OCAxLjI4OCAwIDAgMC0uNjI4LS4xMzlaIi8+PC9tYXNrPjxnIG1hc2s9InVybCgjYWUpIj48cGF0aCBmaWxsPSJ1cmwoI2FmKSIgZD0iTTE4Ljk2NCA4LjMzNmMuNDM1LS4yNTguOTYyLS4zMTkgMS40NjYtLjI3Mi41MDMuMDUuOTg4LjE5NSAxLjQ3Ni4zMjkuMzU4LjA5Ny43Mi4xODcgMS4wNTUuMzQ1LjMzNC4xNTcuNjQ1LjM5LjgzLjcxMi4wMy4wNS4wNTUuMTA1LjA4Ny4xNTYuMDMyLjA1LjA3LjA5Ny4xMTYuMTMzLjA0Ny4wMzUuMTA3LjA2LjE2NS4wNTYuMDMtLjAwMi4wNi0uMDEuMDg1LS4wMjRhLjE1NS4xNTUgMCAwIDAgLjA2Mi0uMDY0LjIwMS4yMDEgMCAwIDAgLjAxOC0uMS40OC40OCAwIDAgMC0uMDE4LS4xYy0uMTIyLS40NDUtLjQxMS0uODIyLS42MjktMS4yMjktLjEzLS4yNDQtLjI0LS40OTktLjM3LS43NDItLjQ1Ni0uODM1LTEuMjA0LTEuNDktMi4wNTQtMS45MTUtLjg1LS40MjUtMS43OTgtLjYzLTIuNzQ3LS42ODQtMS4wOTktLjA2Ni0yLjIuMDY2LTMuMjgzLjI1Ny0uNDcuMDgyLS45NDkuMTgtMS4zNjMuNDE0LS4yMDguMTE2LS40LjI2Ni0uNTQ3LjQ1NC0uMTUuMTg1LS4yNTYuNDA5LS4yOTEuNjQ1LS4wMzIuMjI5LjAwMi40NjMuMDgyLjY3OS4wOC4yMTUuMjAzLjQxMi4zNS41OS4yODguMzU4LjY2MS42MzYgMS4wMDQuOTQzLjM0My4zMDYuNjYuNjQ1IDEuMDQ0Ljg5OS4xOTIuMTI3LjQuMjMyLjYyMS4yOTQuMjIxLjA2Mi40NTguMDc5LjY4My4wMzJhMS41NyAxLjU3IDAgMCAwIC42MzktLjMwOCAzLjQ1IDMuNDUgMCAwIDAgLjUwOC0uNDk4Yy4zMTEtLjM2Mi42MDItLjc1OCAxLjAxLTEuMDAyWiIvPjwvZz48ZyBmaWx0ZXI9InVybCgjYWcpIj48cGF0aCBmaWxsPSJ1cmwoI2FoKSIgZD0iTTIwLjc3IDYuODU3Yy40MDQuMzc5LjcwNC44NDcuOTA5IDEuMzQyLS4wOS0uNTQ1LS4yMy0uOTg2LS41ODctMS4zNDJhMi43NDQgMi43NDQgMCAwIDAtLjc0Ni0uNTFjLS4yNDgtLjExLS41Mi0uMTgtLjY3Ny0uMTgyLS4xNTYtLjAwNC0uMTkzIDAtLjIyNS4wMDItLjAzNC4wMDItLjA1OC4wMDIuMDQzLjAxNS4xMDEuMDExLjMyOC4wNzMuNTcyLjE4Mi4yNDMuMTA5LjQ5MS4yODguNzEuNDkzWiIvPjwvZz48cGF0aCBmaWxsPSJ1cmwoI2FpKSIgZD0iTTI0LjY3NyA3LjE3N2MtLjQ0OC4zMS0uODI1Ljc0LTEuMDA5IDEuMjUzLS4yMzIuNjQ3LS4xNDQgMS4zNy4wOCAyLjAyLjIzLjY2NS42MTQgMS4yOTkgMS4xOTMgMS42OTguMjg5LjIuNjI1LjMzOC45NzMuMzc5LjM1MS4wNDEuNzEzLS4wMTcgMS4wMjYtLjE3OC4zNzktLjE5OS42Ny0uNTQ2Ljg1LS45MzQuMTgtLjM5LjI1Ni0uODIuMjgtMS4yNDlhNC4yMDQgNC4yMDQgMCAwIDAtLjIwMi0xLjYxNGMtLjE5NS0uNTYtLjU0Ny0xLjA3OC0xLjA0Ni0xLjRhMi4wMzkgMi4wMzkgMCAwIDAtLjgyNS0uMzE0IDEuNzYzIDEuNzYzIDAgMCAwLS44NzYuMDk4IDIuMjcgMi4yNyAwIDAgMC0uNDQ0LjI0MVoiLz48cGF0aCBmaWxsPSIjMDIwMjA0IiBkPSJNMjUuNzE0IDguNTM1Yy0uMTY5LjAxMS0uMzM0LjA3LS40NzguMTZhMS4yNCAxLjI0IDAgMCAwLS4zNi4zNTJjLS4xOTQuMjgtLjI3OC42Mi0uMjkxLjk2LS4wMS4yNTMuMDE5LjUxLjEwMy43NS4wODUuMjQuMjI1LjQ2My40MjIuNjI0LjIuMTY3LjQ1NC4yNjcuNzE0LjI4LjI2MS4wMS41MjMtLjA2NC43MzctLjIxMmExLjMxIDEuMzEgMCAwIDAgLjQwNS0uNDY1Yy4wOTgtLjE4Mi4xNTgtLjM4NS4xODQtLjU5YTEuODIzIDEuODIzIDAgMCAwLS4xNzQtMS4wNjggMS40ODYgMS40ODYgMCAwIDAtLjc5NS0uNzIgMS4xMzkgMS4xMzkgMCAwIDAtLjQ2Ny0uMDcxWiIvPjxtYXNrIGlkPSJhaiIgd2lkdGg9IjQiIGhlaWdodD0iNCIgeD0iMjQiIHk9IjgiIG1hc2tVbml0cz0idXNlclNwYWNlT25Vc2UiIHN0eWxlPSJtYXNrLXR5cGU6bHVtaW5hbmNlIj48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMjUuNzE0IDguNTM1Yy0uMTY5LjAxMS0uMzM0LjA3LS40NzguMTZhMS4yNCAxLjI0IDAgMCAwLS4zNi4zNTJjLS4xOTQuMjgtLjI3OC42Mi0uMjkxLjk2LS4wMS4yNTMuMDE5LjUxLjEwMy43NS4wODUuMjQuMjI1LjQ2My40MjIuNjI0LjIuMTY3LjQ1NC4yNjcuNzE0LjI4LjI2MS4wMS41MjMtLjA2NC43MzctLjIxMmExLjMxIDEuMzEgMCAwIDAgLjQwNS0uNDY1Yy4wOTgtLjE4Mi4xNTgtLjM4NS4xODQtLjU5YTEuODIzIDEuODIzIDAgMCAwLS4xNzQtMS4wNjggMS40ODYgMS40ODYgMCAwIDAtLjc5NS0uNzIgMS4xMzkgMS4xMzkgMCAwIDAtLjQ2Ny0uMDcxWiIvPjwvbWFzaz48ZyBmaWx0ZXI9InVybCgjYWspIiBtYXNrPSJ1cmwoI2FqKSI+PHBhdGggZmlsbD0idXJsKCNhbCkiIGQ9Ik0yNi43NTggMTAuMDA1Yy4xODgtLjE4Ny0uMTMzLS42ODQtLjM4NC0uODg5LS4xODItLjE0Ni0uNzA5LS4zMDItLjY4Ni0uMTQuMDIyLjE1OS4yNi4zNjUuNDE4LjUyMy4xOTYuMTkzLjU2Mi41OTYuNjUyLjUwNloiLz48L2c+PG1hc2sgaWQ9ImFtIiB3aWR0aD0iNiIgaGVpZ2h0PSI3IiB4PSIyMyIgeT0iNiIgbWFza1VuaXRzPSJ1c2VyU3BhY2VPblVzZSIgc3R5bGU9Im1hc2stdHlwZTpsdW1pbmFuY2UiPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0yNC42NzcgNy4xNzdjLS40NDguMzEtLjgyNS43NC0xLjAwOSAxLjI1My0uMjMyLjY0Ny0uMTQ0IDEuMzcuMDggMi4wMi4yMy42NjUuNjE0IDEuMjk5IDEuMTkzIDEuNjk4LjI4OS4yLjYyNS4zMzguOTczLjM3OS4zNTEuMDQxLjcxMy0uMDE3IDEuMDI2LS4xNzguMzc5LS4xOTkuNjctLjU0Ni44NS0uOTM0LjE4LS4zOS4yNTYtLjgyLjI4LTEuMjQ5YTQuMjA0IDQuMjA0IDAgMCAwLS4yMDItMS42MTRjLS4xOTUtLjU2LS41NDctMS4wNzgtMS4wNDYtMS40YTIuMDM5IDIuMDM5IDAgMCAwLS44MjUtLjMxNCAxLjc2MyAxLjc2MyAwIDAgMC0uODc2LjA5OCAyLjI3IDIuMjcgMCAwIDAtLjQ0NC4yNDFaIi8+PC9tYXNrPjxnIG1hc2s9InVybCgjYW0pIj48cGF0aCBmaWxsPSJ1cmwoI2FuKSIgZD0iTTIyLjk4IDguODE0Yy4zODYtLjMyLjgzNC0uNTY0IDEuMzEzLS43MTIuOTg0LS4zMDQgMi4xLS4xODQgMi45Ny4zNy4zLjE4OS41NjguNDI1Ljg0Ny42NDYuMjc3LjIyLjU3NC40MjYuOTEuNTQ0YTEuMyAxLjMgMCAwIDAgLjU2Ni4wOGMuMTcyLS4wMTYuMzM5LS4wODIuNDgyLS4xOC4xNDItLjA5OS4yNjItLjIzLjM1Mi0uMzc4LjE4LS4yOTcuMjM4LS42NTcuMjA2LTEuMDAyLS4wNjItLjY5MS0uNDUyLTEuMy0uNzc4LTEuOTE0LS4xMDMtLjE5MS0uMi0uMzg2LS4zMjQtLjU2NC0uMzc3LS41NS0uOTgtLjkxMi0xLjYxMy0xLjEyMy0uNjMyLS4yMTItMS4zLS4yOS0xLjk2MS0uMzcyLS4yOTYtLjAzNy0uNTk0LS4wNzctLjg4OS0uMDQtLjM0LjA0LS42NTguMTc3LS45OS4yNjItLjE1Ny4wNC0uMzE3LjA2OS0uNDcyLjExNC0uMTU2LjA0NS0uMzEuMTA3LS40MzcuMjA4LS4xODQuMTQ4LS4zLjM3MS0uMzUuNjAyLS4wNTEuMjMyLS4wNC40NzItLjAwMy43MDcuMDczLjQ2OS4yNS45MjQuMjMzIDEuMzk5LS4wMTEuMzI0LS4xMTUuNjQ1LS4xMDEuOTY5LjAwMy4wOTYuMDIyLjI5LjAzOS4zODRaIi8+PC9nPjxnIGZpbHRlcj0idXJsKCNhbykiPjxwYXRoIGZpbGw9InVybCgjYXApIiBkPSJNMjYuMjM3IDUuODQ2YTEuNjMgMS42MyAwIDAgMC0uMi4zMTljLjM0Ni4wNzUuNjc2LjIxOC45NzIuNDE0LjU3NC4zODEgMS4wMS45MzYgMS4zMTUgMS41NTUuMDcxLS4wNzkuMTM1LS4xNjMuMTkxLS4yNTctLjMwOC0uNjQ1LS43NS0xLjIyOC0xLjM0My0xLjYyMmEyLjg5OCAyLjg5OCAwIDAgMC0uOTM1LS40MDlaIi8+PC9nPjxtYXNrIGlkPSJhcSIgd2lkdGg9IjI4IiBoZWlnaHQ9IjQ3IiB4PSIxMCIgeT0iMCIgbWFza1VuaXRzPSJ1c2VyU3BhY2VPblVzZSIgc3R5bGU9Im1hc2stdHlwZTpsdW1pbmFuY2UiPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0yMy44MDMgMGMtMS4xMjUgMC0yLjI1NC4yMjEtMy4yNzQuNzcyYTYuMDI1IDYuMDI1IDAgMCAwLTIuNTE4IDIuNjJjLS41NDcgMS4xMDItLjc2MSAyLjI4LS43OTUgMy41NzctLjA2MiAyLjQ2NC4wNTYgNS4wNDguMjQyIDcuMzkuMDQ5LjcxMi4xMzkgMS4xMjkuMDQ3IDEuODYyLS4zMDQgMS41NTYtMS42NjUgMi42MDItMi4zOTIgMy45NjktLjgwMSAxLjUwOC0xLjEzOSAzLjIxMi0xLjc0MiA0LjgxLS41NTMgMS40Ni0xLjMzIDIuODMtMS44NTMgNC4zMDItLjczMyAyLjA1Ny0uOTUyIDQuMzE5LS40NjkgNi40NDkuMzcgMS42MjMgMS4xNCAzLjE0NiAyLjE4IDQuNDQ5LS4xNS4yNy0uMjk3LjU0Ni0uNDUuODE0LS40ODMuODMtMS4wNzIgMS42Mi0xLjM0NSAyLjU0LS4xMzcuNDYtLjE5MS45NTEtLjEwMyAxLjQyMy4wODguNDczLjMyOC45MjUuNzAzIDEuMjI1LjI0NS4xOTUuNTQzLjMyMi44NS4zOTQuMzA1LjA2OS42MjIuMDg2LjkzNy4wOCAxLjE5NC0uMDI2IDIuMzUzLS4zODggMy41MDgtLjY5MmE0MS44NSA0MS44NSAwIDAgMSAyLjA2OC0uNDgzYzIuNDY0LS41MDUgNS4yMTItLjMwMiA3LjQ5OC4wMjguNzc0LjExOCAxLjU0My4yNyAyLjMwNC40NTUgMS4xOTMuMjkgMi4zOC42NTcgMy42MDYuNjkyLjMyMi4wMS42NDktLjAwNS45NjQtLjA3NS4zMTUtLjA3MS42Mi0uMTk4Ljg3Mi0uNC4zNzctLjMuNjE3LS43NTMuNzA1LTEuMjI1LjA4OC0uNDczLjAzMy0uOTY2LS4xMDUtMS40MjctLjI3OC0uOTIzLS44NzItMS43MDgtMS4zNjQtMi41MzUtLjE5NS0uMzI4LS4zNzUtLjY2Mi0uNTY4LS45OSAxLjQ4Mi0xLjY2MyAyLjY3NC0zLjU4NyAzLjM2NC01LjcuNzUyLTIuMzA2Ljg5LTQuNzkuNTc0LTcuMTk2LS4zMTctMi40MDYtMS4wOC00LjczOS0yLjA4My02Ljk0Ny0xLjI2LTIuNzY4LTIuMzItMy43Ny0zLjA4OC02LjIwMS0uODMtMi42MjktLjE0NS01Ljc0LS43NjItOC4xMjNhOC4zMzMgOC4zMzMgMCAwIDAtMS4wMjEtMi4yOTMgNy44NTYgNy44NTYgMCAwIDAtMS45OTctMi4xNUMyNy4wMjQuNDkgMjUuNDI2IDAgMjMuODAzIDBaIi8+PC9tYXNrPjxnIGZpbHRlcj0idXJsKCNhcikiIG1hc2s9InVybCgjYXEpIj48cGF0aCBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9Ii4yNTkiIGQ9Ik0xOC45NiAxNi43NWMuMjc2Ljc5OC44MjkgMS40NzkgMS40ODUgMi4wMS4yMTguMTc3LjQ0OC4zNC43MDUuNDU1LjI1NS4xMTYuNTM4LjE4Mi44MTguMTU3LjI3My0uMDIyLjUzNC0uMTMuNzc0LS4yNjYuMjQtLjEzNS40NjEtLjI5OC42OTQtLjQ0NC4zOTctLjI1My44MjMtLjQ1OCAxLjIzNy0uNjgzLjQ5Ny0uMjcxLjk4LS41OCAxLjM5OS0uOTYzLjE5My0uMTc1LjM3MS0uMzY2LjU4My0uNTE2LjIxMi0uMTUyLjQ2Ny0uMjYuNzI2LS4yNDIuMTk1LjAxMy4zNzcuMDk2LjU2OC4xMzcuMDk1LjAyLjE5My4wMy4yOS4wMTVhLjQ0NS40NDUgMCAwIDAgLjI1Ny0uMTI2LjQ0OS40NDkgMCAwIDAgLjExNS0uMzMuNzg0Ljc4NCAwIDAgMC0uMTAyLS4zMzljLS4xMS0uMjEyLS4yNzktLjM5NC0uMzU0LS42Mi0uMDY4LS4yMDMtLjA1NC0uNDItLjA0OS0uNjMyLjAwNi0uMjE0LjAwMi0uNDM1LS4wOTUtLjYyNWEuODEzLjgxMyAwIDAgMC0uMzQzLS4zMzIgMS4yMTYgMS4yMTYgMCAwIDAtLjQ2NS0uMTMxYy0uMzIzLS4wMy0uNjQ1LjAzNC0uOTcuMDUtLjQyNy4wMjUtLjg1OS0uMDI3LTEuMjg4LS4wMDMtLjUzNC4wMzQtMS4wNi4xODctMS41OTYuMTktLjYxLjAwMS0xLjIyMi0uMi0xLjgyNi0uMTA0LS4yNi4wNDEtLjUwOC4xMzUtLjc1Ni4yMTgtLjI0OS4wODQtLjUwNi4xNTctLjc2OC4xNTMtLjI5OC0uMDA1LS41ODctLjEwOC0uODg1LS4xMjktLjE0OC0uMDExLS4zIDAtLjQ0LjA1M2EuNjE3LjYxNyAwIDAgMC0uMzM1LjI4LjU4Ni41ODYgMCAwIDAtLjA2MS4yNDYuOTAyLjkwMiAwIDAgMCAuMDI4LjI1NWMuMDQuMTY1LjExOC4zMjEuMTguNDc5LjIyNS41NzUuMjczIDEuMjAzLjQ3NCAxLjc4NloiLz48L2c+PG1hc2sgaWQ9ImFzIiB3aWR0aD0iMjgiIGhlaWdodD0iNDciIHg9IjEwIiB5PSIwIiBtYXNrVW5pdHM9InVzZXJTcGFjZU9uVXNlIiBzdHlsZT0ibWFzay10eXBlOmx1bWluYW5jZSI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTIzLjgwMyAwYy0xLjEyNSAwLTIuMjU0LjIyMS0zLjI3NC43NzJhNi4wMjUgNi4wMjUgMCAwIDAtMi41MTggMi42MmMtLjU0NyAxLjEwMi0uNzYxIDIuMjgtLjc5NSAzLjU3Ny0uMDYyIDIuNDY0LjA1NiA1LjA0OC4yNDIgNy4zOS4wNDkuNzEyLjEzOSAxLjEyOS4wNDcgMS44NjItLjMwNCAxLjU1Ni0xLjY2NSAyLjYwMi0yLjM5MiAzLjk2OS0uODAxIDEuNTA4LTEuMTM5IDMuMjEyLTEuNzQyIDQuODEtLjU1MyAxLjQ2LTEuMzMgMi44My0xLjg1MyA0LjMwMi0uNzMzIDIuMDU3LS45NTIgNC4zMTktLjQ2OSA2LjQ0OS4zNyAxLjYyMyAxLjE0IDMuMTQ2IDIuMTggNC40NDktLjE1LjI3LS4yOTcuNTQ2LS40NS44MTQtLjQ4My44My0xLjA3MiAxLjYyLTEuMzQ1IDIuNTQtLjEzNy40Ni0uMTkxLjk1MS0uMTAzIDEuNDIzLjA4OC40NzMuMzI4LjkyNS43MDMgMS4yMjUuMjQ1LjE5NS41NDMuMzIyLjg1LjM5NC4zMDUuMDY5LjYyMi4wODYuOTM3LjA4IDEuMTk0LS4wMjYgMi4zNTMtLjM4OCAzLjUwOC0uNjkyYTQxLjg1IDQxLjg1IDAgMCAxIDIuMDY4LS40ODNjMi40NjQtLjUwNSA1LjIxMi0uMzAyIDcuNDk4LjAyOC43NzQuMTE4IDEuNTQzLjI3IDIuMzA0LjQ1NSAxLjE5My4yOSAyLjM4LjY1NyAzLjYwNi42OTIuMzIyLjAxLjY0OS0uMDA1Ljk2NC0uMDc1LjMxNS0uMDcxLjYyLS4xOTguODcyLS40LjM3Ny0uMy42MTctLjc1My43MDUtMS4yMjUuMDg4LS40NzMuMDMzLS45NjYtLjEwNS0xLjQyNy0uMjc4LS45MjMtLjg3Mi0xLjcwOC0xLjM2NC0yLjUzNS0uMTk1LS4zMjgtLjM3NS0uNjYyLS41NjgtLjk5IDEuNDgyLTEuNjYzIDIuNjc0LTMuNTg3IDMuMzY0LTUuNy43NTItMi4zMDYuODktNC43OS41NzQtNy4xOTYtLjMxNy0yLjQwNi0xLjA4LTQuNzM5LTIuMDgzLTYuOTQ3LTEuMjYtMi43NjgtMi4zMi0zLjc3LTMuMDg4LTYuMjAxLS44My0yLjYyOS0uMTQ1LTUuNzQtLjc2Mi04LjEyM2E4LjMzMyA4LjMzMyAwIDAgMC0xLjAyMS0yLjI5MyA3Ljg1NiA3Ljg1NiAwIDAgMC0xLjk5Ny0yLjE1QzI3LjAyNC40OSAyNS40MjYgMCAyMy44MDMgMFoiLz48L21hc2s+PGcgZmlsdGVyPSJ1cmwoI2F0KSIgbWFzaz0idXJsKCNhcykiIG9wYWNpdHk9Ii4zIj48cGF0aCBmaWxsPSIjMDAwIiBkPSJNMTguMTkzIDE0LjQ3NWMuNTM0LjMzIDEuMDE0LjczNyAxLjQxOCAxLjE5OC4zNzMuNDMuNjkuOTE3IDEuMTc5IDEuMjM0LjM0My4yMjUuNzU4LjM1IDEuMTc4LjM5LjQ5My4wNDUuOTkxLS4wMjggMS40NjgtLjE1OC40NC0uMTE4Ljg2Ni0uMjg3IDEuMjU2LS41MDguNzQ0LS40MjIgMS4zNjUtMS4wNCAyLjE4NC0xLjMxOC4xNzgtLjA2Mi4zNjQtLjEwNS41MzctLjE4LjE3Mi0uMDczLjMzNS0uMTg1LjQxOC0uMzQzLjA3OC0uMTU0LjA3NS0uMzI4LjEtLjQ5NS4wMjktLjE4LjA5LS4zNTIuMTI1LS41My4wMzMtLjE3OS4wMzctLjM2OC0uMDQ1LS41MzFhLjczMi43MzIgMCAwIDAtLjM0LS4zMTIgMS4yNDkgMS4yNDkgMCAwIDAtLjQ3LS4xMDRjLS4zMjMtLjAxNS0uNjQzLjA2MS0uOTY4LjA4OC0uNDI3LjAzNS0uODU5LS4wMTUtMS4yODgtLjAwMi0uNTM0LjAxNS0xLjA2MS4xMjUtMS41OTYuMTUtLjYwOS4wMjYtMS4yMTYtLjA2NC0xLjgyNi0uMDgzYTMuOTUyIDMuOTUyIDAgMCAwLS43OS4wMzhjLS4yNi4wNDEtLjUxNS4xMjItLjczNC4yNTctLjIxNC4xMjktLjM4OC4zMDctLjU4My40NTlhMS43MiAxLjcyIDAgMCAxLS4zMTUuMi45OTguOTk4IDAgMCAxLS4zNjguMDk2Yy0uMDY2LjAwMi0uMTMzLS4wMDItLjE5Ny4wMDhhLjQyMy40MjMgMCAwIDAtLjI3NS4xNTUuMzYzLjM2MyAwIDAgMC0uMDY4LjI5MVoiLz48L2c+PHBhdGggZmlsbD0idXJsKCNhdSkiIGQ9Ik0yMC45MzYgMTAuOTc0Yy4yODctLjMyLjQ4Mi0uNzEyLjc1Ni0xLjA0Mi4xMzctLjE2NS4yOTYtLjMxNy40ODItLjQyNC4xODUtLjEwNy40MDMtLjE2Ny42MTctLjE0OC4yMzguMDIuNDYuMTM5LjYzNS4zMDIuMTc1LjE2My4zMDQuMzcuNDA3LjU4NS4xLjIwOC4xNzguNDI3LjMyLjYwNy4xNTMuMTkyLjM2NC4zMjEuNTU4LjQ3My4wOTUuMDc1LjE4OS4xNTUuMjY0LjI1MWEuNzk3Ljc5NyAwIDAgMSAuMTYxLjMyNi42OTUuNjk1IDAgMCAxLS4wMy4zNjYuODI3LjgyNyAwIDAgMS0uMjA0LjMwOCAxLjE4NiAxLjE4NiAwIDAgMS0uNjY4LjNjLS40OS4wNjktLjk4OC0uMDc3LTEuNDg1LS4wNjQtLjUuMDE1LS45OTEuMTkxLTEuNDk0LjE3NGExLjMzNyAxLjMzNyAwIDAgMS0uNzEtLjIxNC45NDEuOTQxIDAgMCAxLS4yNi0uMjcxLjc2OS43NjkgMCAwIDEtLjEwOC0uMzU3Ljc5OS43OTkgMCAwIDEgLjA3My0uMzQ5Yy4wNDctLjExLjExNC0uMjEuMTktLjMwMy4xNTEtLjE4Ni4zMzctLjM0LjQ5Ni0uNTJaIi8+PHBhdGggZmlsbD0idXJsKCNhdikiIGQ9Ik0xOC4yMTQgMTQuMDcyYS41MDkuNTA5IDAgMCAwIC4wNTIuMTM3Yy4wNDMuMDcxLjEwNy4xMy4xNzUuMTc4LjA2Ny4wNS4xNC4wOTIuMjEyLjEzNS4zNzYuMjM4LjY4NC41Ny45NTguOTIyLjM2NS40NzMuNjkuOTk2IDEuMTc5IDEuMzQuMzQ1LjI0My43NTguMzggMS4xNzguNDIzLjQ5My4wNDkuOTkxLS4wMyAxLjQ2OC0uMTcuNDQtLjEzLjg2Ni0uMzEyIDEuMjU2LS41NTQuNzQ0LS40NTcgMS4zNjUtMS4xMjkgMi4xODQtMS40My4xNzgtLjA2Ni4zNjQtLjExMy41MzctLjE5NC4xNzItLjA4Mi4zMzUtLjIwMi40MTgtLjM3NS4wNzgtLjE2NS4wNzUtLjM1Ni4xLS41MzguMDI5LS4xOTMuMDktLjM4LjEyNS0uNTczLjAzMy0uMTk0LjAzNy0uNC0uMDQ1LS41NzhhLjc0NC43NDQgMCAwIDAtLjM0LS4zMzYgMS4xMzEgMS4xMzEgMCAwIDAtLjQ3LS4xMTZjLS4zMjMtLjAxNS0uNjQzLjA2OC0uOTY4LjA5OC0uNDI3LjAzOS0uODU5LS4wMTctMS4yODgtLjAwNC0uNTM0LjAxNy0xLjA2MS4xMzctMS41OTYuMTYzLS42MDkuMDI4LTEuMjE2LS4wNjYtMS44MjYtLjA5YTMuNzE4IDMuNzE4IDAgMCAwLS43OTEuMDM3Yy0uMjYuMDQ0LS41MTYuMTM0LS43MzMuMjg0LS4yMTIuMTQ2LS4zOC4zNDUtLjU3Ni41MTNhMS40OCAxLjQ4IDAgMCAxLS4zMTkuMjE4Ljc5OC43OTggMCAwIDEtLjM3LjA4OGMtLjA2Ny0uMDAyLS4xMzYtLjAxMS0uMTk4LjAwOGEuMjkzLjI5MyAwIDAgMC0uMTA1LjA2NS42My42MyAwIDAgMC0uMDc3LjA5OCAxLjU2NyAxLjU2NyAwIDAgMC0uMTQuMjVaIi8+PG1hc2sgaWQ9ImF3IiB3aWR0aD0iMTEiIGhlaWdodD0iNiIgeD0iMTgiIHk9IjEyIiBtYXNrVW5pdHM9InVzZXJTcGFjZU9uVXNlIiBzdHlsZT0ibWFzay10eXBlOmx1bWluYW5jZSI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTE4LjIxNCAxNC4wNzJhLjUwOS41MDkgMCAwIDAgLjA1Mi4xMzdjLjA0My4wNzEuMTA3LjEzLjE3NS4xNzguMDY3LjA1LjE0LjA5Mi4yMTIuMTM1LjM3Ni4yMzguNjg0LjU3Ljk1OC45MjIuMzY1LjQ3My42OS45OTYgMS4xNzkgMS4zNC4zNDUuMjQzLjc1OC4zOCAxLjE3OC40MjMuNDkzLjA0OS45OTEtLjAzIDEuNDY4LS4xNy40NC0uMTMuODY2LS4zMTIgMS4yNTYtLjU1NC43NDQtLjQ1NyAxLjM2NS0xLjEyOSAyLjE4NC0xLjQzLjE3OC0uMDY2LjM2NC0uMTEzLjUzNy0uMTk0LjE3Mi0uMDgyLjMzNS0uMjAyLjQxOC0uMzc1LjA3OC0uMTY1LjA3NS0uMzU2LjEtLjUzOC4wMjktLjE5My4wOS0uMzguMTI1LS41NzMuMDMzLS4xOTQuMDM3LS40LS4wNDUtLjU3OGEuNzQ0Ljc0NCAwIDAgMC0uMzQtLjMzNiAxLjEzMSAxLjEzMSAwIDAgMC0uNDctLjExNmMtLjMyMy0uMDE1LS42NDMuMDY4LS45NjguMDk4LS40MjcuMDM5LS44NTktLjAxNy0xLjI4OC0uMDA0LS41MzQuMDE3LTEuMDYxLjEzNy0xLjU5Ni4xNjMtLjYwOS4wMjgtMS4yMTYtLjA2Ni0xLjgyNi0uMDlhMy43MTggMy43MTggMCAwIDAtLjc5MS4wMzdjLS4yNi4wNDQtLjUxNi4xMzQtLjczMy4yODQtLjIxMi4xNDYtLjM4LjM0NS0uNTc2LjUxM2ExLjQ4IDEuNDggMCAwIDEtLjMxOS4yMTguNzk4Ljc5OCAwIDAgMS0uMzcuMDg4Yy0uMDY3LS4wMDItLjEzNi0uMDExLS4xOTguMDA4YS4yOTMuMjkzIDAgMCAwLS4xMDUuMDY1LjYzLjYzIDAgMCAwLS4wNzcuMDk4IDEuNTY3IDEuNTY3IDAgMCAwLS4xNC4yNVoiLz48L21hc2s+PGcgZmlsdGVyPSJ1cmwoI2F4KSIgbWFzaz0idXJsKCNhdykiPjxwYXRoIGZpbGw9IiNEOUIzMEQiIGQ9Ik0yMC42MDYgMTQuNzNhMS4wNzQgMS4wNzQgMCAwIDAgLjcwMyAxLjI2OGMuMzIuMTA2LjY4LjA1NC45NzctLjEwMi4xNzUtLjA5LjMzMi0uMjE3LjQzMS0uMzg2YS43MS43MSAwIDAgMCAuMS0uMjc0LjYzMi42MzIgMCAwIDAtLjAzLS4yODkuNjQ3LjY0NyAwIDAgMC0uMTg2LS4yNTYuODM4LjgzOCAwIDAgMC0uMjgxLS4xNTQgMi44NjEgMi44NjEgMCAwIDAtLjczMy0uMTI4Yy0uMzc5LS4wMDctLjkxOS4wNjQtLjk4LjMyMVoiLz48L2c+PG1hc2sgaWQ9ImF5IiB3aWR0aD0iMTEiIGhlaWdodD0iNiIgeD0iMTgiIHk9IjEyIiBtYXNrVW5pdHM9InVzZXJTcGFjZU9uVXNlIiBzdHlsZT0ibWFzay10eXBlOmx1bWluYW5jZSI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTE4LjIxNCAxNC4wNzJhLjUwNC41MDQgMCAwIDAgLjA1Mi4xMzdjLjA0My4wNzEuMTA3LjEzLjE3NS4xNzguMDY3LjA1LjE0LjA5Mi4yMTIuMTM1LjM3Ni4yMzguNjg0LjU3Ljk1OC45MjIuMzY1LjQ3My42OS45OTYgMS4xNzkgMS4zNC4zNDUuMjQzLjc1OC4zOCAxLjE3OC40MjMuNDkzLjA0OS45OTEtLjAzIDEuNDY4LS4xNy40NC0uMTMuODY2LS4zMTIgMS4yNTYtLjU1NC43NDQtLjQ1NyAxLjM2NS0xLjEyOSAyLjE4NC0xLjQzLjE3OC0uMDY2LjM2NC0uMTEzLjUzNy0uMTk0LjE3Mi0uMDgyLjMzNS0uMjAyLjQxOC0uMzc1LjA3OC0uMTY1LjA3NS0uMzU2LjEtLjUzOC4wMjktLjE5My4wOS0uMzguMTI1LS41NzMuMDMzLS4xOTQuMDM3LS40LS4wNDUtLjU3OGEuNzQ1Ljc0NSAwIDAgMC0uMzQtLjMzNiAxLjEzMiAxLjEzMiAwIDAgMC0uNDctLjExNmMtLjMyMy0uMDE1LS42NDMuMDY4LS45NjguMDk4LS40MjcuMDM5LS44NTktLjAxNy0xLjI4OC0uMDA0LS41MzQuMDE3LTEuMDYxLjEzNy0xLjU5Ni4xNjMtLjYwOS4wMjgtMS4yMTYtLjA2Ni0xLjgyNi0uMDlhMy43MjQgMy43MjQgMCAwIDAtLjc5MS4wMzdjLS4yNi4wNDQtLjUxNi4xMzQtLjczMy4yODQtLjIxMi4xNDYtLjM4LjM0NS0uNTc2LjUxM2ExLjQ3NyAxLjQ3NyAwIDAgMS0uMzE5LjIxOC43OTcuNzk3IDAgMCAxLS4zNy4wODhjLS4wNjctLjAwMi0uMTM2LS4wMTEtLjE5OC4wMDhhLjI5Mi4yOTIgMCAwIDAtLjEwNS4wNjUuNjMuNjMgMCAwIDAtLjA3Ny4wOTggMS41NjMgMS41NjMgMCAwIDAtLjE0LjI1WiIvPjwvbWFzaz48ZyBmaWx0ZXI9InVybCgjYXopIiBtYXNrPSJ1cmwoI2F5KSI+PHBhdGggZmlsbD0iIzYwNDQwNSIgZD0iTTE5LjU1OCAxMi43MjRhOC44NzIgOC44NzIgMCAwIDAtLjYzLjQxMmMtLjEwNy4wNzctLjIxNi4xNTgtLjI3Mi4yNzZhLjY1LjY1IDAgMCAwLS4wNS4yNjhjMCAuMDk0LjAwNS4xODYtLjAwOC4yNzctLjAwNy4wNjItLjAyNC4xMjQtLjAyNi4xODZhLjMxMS4zMTEgMCAwIDAgLjAwNy4wOTRjLjAxLjAzLjAyNS4wNi4wNDUuMDgyLjAyOS4wMy4wNjYuMDUuMTA1LjA2LjA0LjAxMi4wOC4wMTcuMTIuMDI3LjE5LjA0NS4zNTUuMTYuNS4yOTIuMTQzLjEzLjI3NS4yNzguNDI3LjQuNDA4LjMzMy45NS40NzIgMS40NzkuNDguNTI5LjAwOSAxLjA1Mi0uMTAyIDEuNTY4LS4yMTguNDA0LS4wOTIuODEtLjE4NiAxLjE5OC0uMzNhNS4yNzcgNS4yNzcgMCAwIDAgMS42MzUtLjk3M2MuMjE5LS4xOS40MjMtLjM5OC42NjktLjU1MS4yMTYtLjEzNy40NTctLjIyNy42NzktLjM1N2EuNDIuNDIgMCAwIDAgLjA1Ni0uMDM3LjE5NS4xOTUgMCAwIDAgLjA0NS0uMDUzLjE2NS4xNjUgMCAwIDAgLjAwNi0uMTE2LjMzLjMzIDAgMCAwLS4wNTktLjEwMy44NjMuODYzIDAgMCAwLS4wOTEtLjA5NGMtLjIzMS0uMTk3LS41NDItLjI2OC0uODQ2LS4yOTItLjMwMi0uMDIzLS42MDctLjAwNi0uOTA2LS4wNTYtLjI4LS4wNDctLjU0Ny0uMTUyLS44MTktLjIzOWE1Ljc2MyA1Ljc2MyAwIDAgMC0yLjk2OC0uMTYxIDYuMTI2IDYuMTI2IDAgMCAwLTEuODY0LjcyNloiLz48L2c+PHBhdGggZmlsbD0idXJsKCNhQSkiIGQ9Ik0xOS40ODkgMTEuOTljLS4zMTIuMjEtLjU5My40NjctLjgzLjc1OGExLjgwOSAxLjgwOSAwIDAgMC0uMzI3LjU1MWMtLjA1NS4xNjItLjA3My4zMy0uMTA3LjQ5Ny0uMDEzLjA2Mi0uMDI4LjEyNC0uMDI2LjE4OCAwIC4wMy4wMDMuMDYyLjAxMy4wOTQuMDEuMDMuMDI2LjA1OC4wNDcuMDhhLjI3OC4yNzggMCAwIDAgLjEzOS4wN2MuMDUyLjAwOS4xMDUuMDEuMTU3LjAxNi4yMzQuMDI5LjQ1LjE0MS42NDUuMjc2LjE5NS4xMzMuMzc1LjI5LjU3Ni40MTYuNDQuMjguOTY3LjQwMyAxLjQ5LjQyNC41MjIuMDIgMS4wNDMtLjA1OCAxLjU1Ny0uMTYxLjQwNi0uMDguODExLS4xNzggMS4xOTgtLjMzLjU5Mi0uMjM1IDEuMTI3LS41OTMgMS42MzUtLjk3My4yMzItLjE3My40Ni0uMzUxLjY2OS0uNTUyLjA3LS4wNjkuMTM5LS4xMzguMjE0LS4yMDJhLjc3Ni43NzYgMCAwIDEgLjI1My0uMTQ2Ljk2Mi45NjIgMCAwIDEgLjQ0NC0uMDA4Yy4xMS4wMTkuMjIxLjA0My4zMzQuMDRhLjU1LjU1IDAgMCAwIC4xNjUtLjAzNC4zMjQuMzI0IDAgMCAwIC4xMzctLjA5OC4zMjMuMzIzIDAgMCAwIC4wNzEtLjIwNC40Mi40MiAwIDAgMC0uMDYtLjIxMi43Mi43MiAwIDAgMC0uMzQtLjI3NGMtLjE4NS0uMDgyLS4zODYtLjEyMi0uNTgyLS4xN2E4LjI5OSA4LjI5OSAwIDAgMS0xLjc1Mi0uNjRjLS4yNzctLjEzNy0uNTQ3LS4yODktLjgxOS0uNDM1YTUuMDEgNS4wMSAwIDAgMC0uODctLjM4OGMtLjY4My0uMjA2LTEuNDI1LS4xMzktMi4wOTguMDk2YTQuNDc3IDQuNDc3IDAgMCAwLTEuOTMzIDEuMzIyWiIvPjxtYXNrIGlkPSJhQiIgd2lkdGg9IjEwIiBoZWlnaHQ9IjYiIHg9IjE4IiB5PSIxMCIgbWFza1VuaXRzPSJ1c2VyU3BhY2VPblVzZSIgc3R5bGU9Im1hc2stdHlwZTpsdW1pbmFuY2UiPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xOS40ODkgMTEuOTljLS4zMTIuMjEtLjU5My40NjctLjgzLjc1OGExLjgwOSAxLjgwOSAwIDAgMC0uMzI3LjU1MWMtLjA1NS4xNjItLjA3My4zMy0uMTA3LjQ5Ny0uMDEzLjA2Mi0uMDI4LjEyNC0uMDI2LjE4OCAwIC4wMy4wMDMuMDYyLjAxMy4wOTQuMDEuMDMuMDI2LjA1OC4wNDcuMDhhLjI3OC4yNzggMCAwIDAgLjEzOS4wN2MuMDUyLjAwOS4xMDUuMDEuMTU3LjAxNi4yMzQuMDI5LjQ1LjE0MS42NDUuMjc2LjE5NS4xMzMuMzc1LjI5LjU3Ni40MTYuNDQuMjguOTY3LjQwMyAxLjQ5LjQyNC41MjIuMDIgMS4wNDMtLjA1OCAxLjU1Ny0uMTYxLjQwNi0uMDguODExLS4xNzggMS4xOTgtLjMzLjU5Mi0uMjM1IDEuMTI3LS41OTMgMS42MzUtLjk3My4yMzItLjE3My40Ni0uMzUxLjY2OS0uNTUyLjA3LS4wNjkuMTM5LS4xMzguMjE0LS4yMDJhLjc3Ni43NzYgMCAwIDEgLjI1My0uMTQ2Ljk2Mi45NjIgMCAwIDEgLjQ0NC0uMDA4Yy4xMS4wMTkuMjIxLjA0My4zMzQuMDRhLjU1LjU1IDAgMCAwIC4xNjUtLjAzNC4zMjQuMzI0IDAgMCAwIC4xMzctLjA5OC4zMjMuMzIzIDAgMCAwIC4wNzEtLjIwNC40Mi40MiAwIDAgMC0uMDYtLjIxMi43Mi43MiAwIDAgMC0uMzQtLjI3NGMtLjE4NS0uMDgyLS4zODYtLjEyMi0uNTgyLS4xN2E4LjI5OSA4LjI5OSAwIDAgMS0xLjc1Mi0uNjRjLS4yNzctLjEzNy0uNTQ3LS4yODktLjgxOS0uNDM1YTUuMDEgNS4wMSAwIDAgMC0uODctLjM4OGMtLjY4My0uMjA2LTEuNDI1LS4xMzktMi4wOTguMDk2YTQuNDc3IDQuNDc3IDAgMCAwLTEuOTMzIDEuMzIyWiIvPjwvbWFzaz48ZyBmaWx0ZXI9InVybCgjYUMpIiBtYXNrPSJ1cmwoI2FCKSI+PHBhdGggZmlsbD0iI0Y2REE0QSIgZD0iTTI0LjI3MiAxMi4xNGEuMzA3LjMwNyAwIDAgMC0uMTQ2LS4wOTUuMzkuMzkgMCAwIDAtLjE3NS0uMDA4LjgzLjgzIDAgMCAwLS4zMTkuMTVjLS4yNzUuMTktLjUxOS40MjQtLjczMy42ODMtLjI4LjM0My0uNTEzLjczOS0uNTkyIDEuMTc2YS44MTQuODE0IDAgMCAwLS4wMTMuMjIzYy4wMS4wNzUuMDM3LjE0OC4wOTIuMmEuMzAxLjMwMSAwIDAgMCAuMTcyLjA4NS40My40MyAwIDAgMCAuMTk1LS4wMmMuMTI0LS4wNDIuMjI3LS4xMy4zMjYtLjIxNi41MzgtLjQ4NCAxLjAyNi0xLjA2MiAxLjIyMS0xLjc2YS44MjEuODIxIDAgMCAwIC4wMzYtLjIxMy4zMzEuMzMxIDAgMCAwLS4wNjQtLjIwNFoiLz48L2c+PGcgZmlsdGVyPSJ1cmwoI2FEKSIgb3BhY2l0eT0iLjgiPjxwYXRoIGZpbGw9InVybCgjYUUpIiBkPSJNMjEuMTM1IDExLjA3NGMtLjE0NC0uMDQ3LS4zOC4yMDYtLjMwNC4zMzUuMDIuMDM2LjA4Ny4wODEuMTMxLjA1Ny4wNjYtLjAzNi4xMi0uMTY3LjE5Mi0uMjE4LjA0Ny0uMDM0LjAzNy0uMTU3LS4wMTktLjE3NFoiLz48L2c+PGcgZmlsdGVyPSJ1cmwoI2FGKSIgb3BhY2l0eT0iLjgiPjxwYXRoIGZpbGw9InVybCgjYUcpIiBkPSJNMjIuOTggMTEuMTQxYy4wMzcuMTIuMjMuMS4zNDMuMTU4LjA5OC4wNS4xNzYuMTYxLjI4Ny4xNjUuMTA1LjAwMi4yNy0uMDM4LjI4My0uMTQzLjAxNy0uMTM3LS4xODQtLjIyNS0uMzEzLS4yNzUtLjE2Ny0uMDY0LS4zOC0uMDk4LS41MzYtLjAxMi0uMDM2LjAyMS0uMDc1LjA2OC0uMDY0LjEwN1oiLz48L2c+PG1hc2sgaWQ9ImFIIiB3aWR0aD0iMTEiIGhlaWdodD0iOCIgeD0iMTgiIHk9IjEwIiBtYXNrVW5pdHM9InVzZXJTcGFjZU9uVXNlIiBzdHlsZT0ibWFzay10eXBlOmx1bWluYW5jZSI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTE4LjIxNCAxNC4wNzJhLjUwNC41MDQgMCAwIDAgLjA1Mi4xMzdjLjA0My4wNzEuMTA3LjEzLjE3NS4xNzguMDY3LjA1LjE0LjA5Mi4yMTIuMTM1LjM3Ni4yMzguNjg0LjU3Ljk1OC45MjIuMzY1LjQ3My42OS45OTYgMS4xNzkgMS4zNC4zNDUuMjQzLjc1OC4zOCAxLjE3OC40MjMuNDkzLjA0OS45OTEtLjAzIDEuNDY4LS4xNy40NC0uMTMuODY2LS4zMTIgMS4yNTYtLjU1NC43NDQtLjQ1NyAxLjM2NS0xLjEyOSAyLjE4NC0xLjQzLjE3OC0uMDY2LjM2NC0uMTEzLjUzNy0uMTk0LjE3Mi0uMDgyLjMzNS0uMjAyLjQxOC0uMzc1LjA3OC0uMTY1LjA3NS0uMzU2LjEtLjUzOC4wMjktLjE5My4wOS0uMzguMTI1LS41NzMuMDMzLS4xOTQuMDM3LS40LS4wNDUtLjU3OGEuNzQ1Ljc0NSAwIDAgMC0uMzQtLjMzNiAxLjEzMiAxLjEzMiAwIDAgMC0uNDctLjExNmMtLjMyMy0uMDE1LS42NDMuMDY4LS45NjguMDk4LS40MjcuMDM5LS44NTktLjAxNy0xLjI4OC0uMDA0LS41MzQuMDE3LTEuMDYxLjEzNy0xLjU5Ni4xNjMtLjYwOS4wMjgtMS4yMTYtLjA2Ni0xLjgyNi0uMDlhMy43MjQgMy43MjQgMCAwIDAtLjc5MS4wMzdjLS4yNi4wNDQtLjUxNi4xMzQtLjczMy4yODQtLjIxMi4xNDYtLjM4LjM0NS0uNTc2LjUxM2ExLjQ3NyAxLjQ3NyAwIDAgMS0uMzE5LjIxOC43OTcuNzk3IDAgMCAxLS4zNy4wODhjLS4wNjctLjAwMi0uMTM2LS4wMTEtLjE5OC4wMDhhLjI5Mi4yOTIgMCAwIDAtLjEwNS4wNjUuNjMuNjMgMCAwIDAtLjA3Ny4wOTggMS41NjMgMS41NjMgMCAwIDAtLjE0LjI1WiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xOS40ODkgMTEuOTljLS4zMTIuMjEtLjU5My40NjctLjgzLjc1OGExLjgwOSAxLjgwOSAwIDAgMC0uMzI3LjU1MWMtLjA1NS4xNjItLjA3My4zMy0uMTA3LjQ5Ny0uMDEzLjA2Mi0uMDI4LjEyNC0uMDI2LjE4OCAwIC4wMy4wMDMuMDYyLjAxMy4wOTQuMDEuMDMuMDI2LjA1OC4wNDcuMDhhLjI3OC4yNzggMCAwIDAgLjEzOS4wN2MuMDUyLjAwOS4xMDUuMDEuMTU3LjAxNi4yMzQuMDI5LjQ1LjE0MS42NDUuMjc2LjE5NS4xMzMuMzc1LjI5LjU3Ni40MTYuNDQuMjguOTY3LjQwMyAxLjQ5LjQyNC41MjIuMDIgMS4wNDMtLjA1OCAxLjU1Ny0uMTYxLjQwNi0uMDguODExLS4xNzggMS4xOTgtLjMzLjU5Mi0uMjM1IDEuMTI3LS41OTMgMS42MzUtLjk3My4yMzItLjE3My40Ni0uMzUxLjY2OS0uNTUyLjA3LS4wNjkuMTM5LS4xMzguMjE0LS4yMDJhLjc3Ni43NzYgMCAwIDEgLjI1My0uMTQ2Ljk2Mi45NjIgMCAwIDEgLjQ0NC0uMDA4Yy4xMS4wMTkuMjIxLjA0My4zMzQuMDRhLjU1LjU1IDAgMCAwIC4xNjUtLjAzNC4zMjQuMzI0IDAgMCAwIC4xMzctLjA5OC4zMjMuMzIzIDAgMCAwIC4wNzEtLjIwNC40Mi40MiAwIDAgMC0uMDYtLjIxMi43Mi43MiAwIDAgMC0uMzQtLjI3NGMtLjE4NS0uMDgyLS4zODYtLjEyMi0uNTgyLS4xN2E4LjI5OSA4LjI5OSAwIDAgMS0xLjc1Mi0uNjRjLS4yNzctLjEzNy0uNTQ3LS4yODktLjgxOS0uNDM1YTUuMDEgNS4wMSAwIDAgMC0uODctLjM4OGMtLjY4My0uMjA2LTEuNDI1LS4xMzktMi4wOTguMDk2YTQuNDc3IDQuNDc3IDAgMCAwLTEuOTMzIDEuMzIyWiIvPjwvbWFzaz48ZyBmaWx0ZXI9InVybCgjYUkpIiBtYXNrPSJ1cmwoI2FIKSI+PHBhdGggZmlsbD0idXJsKCNhSikiIGQ9Ik0yNy45ODggMTIuOTY2YS43MjMuNzIzIDAgMCAxLS4xODEuNDAzLjQ3Ny40NzcgMCAwIDEtLjM0Ni4xNjcuMzcuMzcgMCAwIDEtLjMwNy0uMTY3LjU5NC41OTQgMCAwIDEtLjA5LS40MDMuNzQzLjc0MyAwIDAgMSAuMTgtLjQwNS41NTIuNTUyIDAgMCAxIC4xNjUtLjEyNC40MTYuNDE2IDAgMCAxIC4xODItLjA0M2MuMDYgMCAuMTE5LjAxNC4xNzEuMDQzLjA1My4wMjkuMS4wNzEuMTM2LjEyNGEuNTIzLjUyMyAwIDAgMSAuMDguMTg2Yy4wMTUuMDcuMDE5LjE0My4wMS4yMTlaIi8+PC9nPjxkZWZzPjxmaWx0ZXIgaWQ9ImIiIHdpZHRoPSI4LjMyOSIgaGVpZ2h0PSI3Ljk1OCIgeD0iMTMuMyIgeT0iMTguNjY0IiBjb2xvci1pbnRlcnBvbGF0aW9uLWZpbHRlcnM9InNSR0IiIGZpbHRlclVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PGZlRmxvb2QgZmxvb2Qtb3BhY2l0eT0iMCIgcmVzdWx0PSJCYWNrZ3JvdW5kSW1hZ2VGaXgiLz48ZmVCbGVuZCBpbj0iU291cmNlR3JhcGhpYyIgaW4yPSJCYWNrZ3JvdW5kSW1hZ2VGaXgiIHJlc3VsdD0ic2hhcGUiLz48ZmVHYXVzc2lhbkJsdXIgcmVzdWx0PSJlZmZlY3QxX2ZvcmVncm91bmRCbHVyXzMxMjBfNDgyNTUiIHN0ZERldmlhdGlvbj0iLjY0Ii8+PC9maWx0ZXI+PGZpbHRlciBpZD0iZSIgd2lkdGg9IjEyLjYxIiBoZWlnaHQ9IjkuOTQ0IiB4PSIyMS4yNzkiIHk9IjE3LjU2MSIgY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzPSJzUkdCIiBmaWx0ZXJVbml0cz0idXNlclNwYWNlT25Vc2UiPjxmZUZsb29kIGZsb29kLW9wYWNpdHk9IjAiIHJlc3VsdD0iQmFja2dyb3VuZEltYWdlRml4Ii8+PGZlQmxlbmQgaW49IlNvdXJjZUdyYXBoaWMiIGluMj0iQmFja2dyb3VuZEltYWdlRml4IiByZXN1bHQ9InNoYXBlIi8+PGZlR2F1c3NpYW5CbHVyIHJlc3VsdD0iZWZmZWN0MV9mb3JlZ3JvdW5kQmx1cl8zMTIwXzQ4MjU1IiBzdGREZXZpYXRpb249Ii45OCIvPjwvZmlsdGVyPjxmaWx0ZXIgaWQ9ImgiIHdpZHRoPSI2LjIyNCIgaGVpZ2h0PSI2LjQ2NiIgeD0iMTguNDMxIiB5PSIxOC44NTQiIGNvbG9yLWludGVycG9sYXRpb24tZmlsdGVycz0ic1JHQiIgZmlsdGVyVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48ZmVGbG9vZCBmbG9vZC1vcGFjaXR5PSIwIiByZXN1bHQ9IkJhY2tncm91bmRJbWFnZUZpeCIvPjxmZUJsZW5kIGluPSJTb3VyY2VHcmFwaGljIiBpbjI9IkJhY2tncm91bmRJbWFnZUZpeCIgcmVzdWx0PSJzaGFwZSIvPjxmZUdhdXNzaWFuQmx1ciByZXN1bHQ9ImVmZmVjdDFfZm9yZWdyb3VuZEJsdXJfMzEyMF80ODI1NSIgc3RkRGV2aWF0aW9uPSIuNjgiLz48L2ZpbHRlcj48ZmlsdGVyIGlkPSJrIiB3aWR0aD0iNS42ODYiIGhlaWdodD0iMTQuNjk5IiB4PSIxNy40NjkiIHk9IjIzLjIxNCIgY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzPSJzUkdCIiBmaWx0ZXJVbml0cz0idXNlclNwYWNlT25Vc2UiPjxmZUZsb29kIGZsb29kLW9wYWNpdHk9IjAiIHJlc3VsdD0iQmFja2dyb3VuZEltYWdlRml4Ii8+PGZlQmxlbmQgaW49IlNvdXJjZUdyYXBoaWMiIGluMj0iQmFja2dyb3VuZEltYWdlRml4IiByZXN1bHQ9InNoYXBlIi8+PGZlR2F1c3NpYW5CbHVyIHJlc3VsdD0iZWZmZWN0MV9mb3JlZ3JvdW5kQmx1cl8zMTIwXzQ4MjU1IiBzdGREZXZpYXRpb249IjEuMjUiLz48L2ZpbHRlcj48ZmlsdGVyIGlkPSJtIiB3aWR0aD0iOC43NDgiIGhlaWdodD0iOC43ODIiIHg9IjI5LjgwNyIgeT0iMjEuMDQ1IiBjb2xvci1pbnRlcnBvbGF0aW9uLWZpbHRlcnM9InNSR0IiIGZpbHRlclVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PGZlRmxvb2QgZmxvb2Qtb3BhY2l0eT0iMCIgcmVzdWx0PSJCYWNrZ3JvdW5kSW1hZ2VGaXgiLz48ZmVCbGVuZCBpbj0iU291cmNlR3JhcGhpYyIgaW4yPSJCYWNrZ3JvdW5kSW1hZ2VGaXgiIHJlc3VsdD0ic2hhcGUiLz48ZmVHYXVzc2lhbkJsdXIgcmVzdWx0PSJlZmZlY3QxX2ZvcmVncm91bmRCbHVyXzMxMjBfNDgyNTUiIHN0ZERldmlhdGlvbj0iMS43OCIvPjwvZmlsdGVyPjxmaWx0ZXIgaWQ9Im8iIHdpZHRoPSI5LjU4MSIgaGVpZ2h0PSI5LjQ0MyIgeD0iMjIuNjIxIiB5PSItMS40MDMiIGNvbG9yLWludGVycG9sYXRpb24tZmlsdGVycz0ic1JHQiIgZmlsdGVyVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48ZmVGbG9vZCBmbG9vZC1vcGFjaXR5PSIwIiByZXN1bHQ9IkJhY2tncm91bmRJbWFnZUZpeCIvPjxmZUJsZW5kIGluPSJTb3VyY2VHcmFwaGljIiBpbjI9IkJhY2tncm91bmRJbWFnZUZpeCIgcmVzdWx0PSJzaGFwZSIvPjxmZUdhdXNzaWFuQmx1ciByZXN1bHQ9ImVmZmVjdDFfZm9yZWdyb3VuZEJsdXJfMzEyMF80ODI1NSIgc3RkRGV2aWF0aW9uPSIxLjczIi8+PC9maWx0ZXI+PGZpbHRlciBpZD0icSIgd2lkdGg9IjUuMDg3IiBoZWlnaHQ9IjUuMzExIiB4PSIyNy45OTgiIHk9IjEyLjc0NiIgY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzPSJzUkdCIiBmaWx0ZXJVbml0cz0idXNlclNwYWNlT25Vc2UiPjxmZUZsb29kIGZsb29kLW9wYWNpdHk9IjAiIHJlc3VsdD0iQmFja2dyb3VuZEltYWdlRml4Ii8+PGZlQmxlbmQgaW49IlNvdXJjZUdyYXBoaWMiIGluMj0iQmFja2dyb3VuZEltYWdlRml4IiByZXN1bHQ9InNoYXBlIi8+PGZlR2F1c3NpYW5CbHVyIHJlc3VsdD0iZWZmZWN0MV9mb3JlZ3JvdW5kQmx1cl8zMTIwXzQ4MjU1IiBzdGREZXZpYXRpb249Ii43OCIvPjwvZmlsdGVyPjxmaWx0ZXIgaWQ9InMiIHdpZHRoPSI4LjI2NyIgaGVpZ2h0PSIxNC4yMDkiIHg9IjkuMjM0IiB5PSIyMS4zNDMiIGNvbG9yLWludGVycG9sYXRpb24tZmlsdGVycz0ic1JHQiIgZmlsdGVyVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48ZmVGbG9vZCBmbG9vZC1vcGFjaXR5PSIwIiByZXN1bHQ9IkJhY2tncm91bmRJbWFnZUZpeCIvPjxmZUJsZW5kIGluPSJTb3VyY2VHcmFwaGljIiBpbjI9IkJhY2tncm91bmRJbWFnZUZpeCIgcmVzdWx0PSJzaGFwZSIvPjxmZUdhdXNzaWFuQmx1ciByZXN1bHQ9ImVmZmVjdDFfZm9yZWdyb3VuZEJsdXJfMzEyMF80ODI1NSIgc3RkRGV2aWF0aW9uPSIuOTgiLz48L2ZpbHRlcj48ZmlsdGVyIGlkPSJ1IiB3aWR0aD0iOS4zMDIiIGhlaWdodD0iMTcuODUzIiB4PSIyOS41NzQiIHk9IjE5LjkzMSIgY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzPSJzUkdCIiBmaWx0ZXJVbml0cz0idXNlclNwYWNlT25Vc2UiPjxmZUZsb29kIGZsb29kLW9wYWNpdHk9IjAiIHJlc3VsdD0iQmFja2dyb3VuZEltYWdlRml4Ii8+PGZlQmxlbmQgaW49IlNvdXJjZUdyYXBoaWMiIGluMj0iQmFja2dyb3VuZEltYWdlRml4IiByZXN1bHQ9InNoYXBlIi8+PGZlR2F1c3NpYW5CbHVyIHJlc3VsdD0iZWZmZWN0MV9mb3JlZ3JvdW5kQmx1cl8zMTIwXzQ4MjU1IiBzdGREZXZpYXRpb249IjEuMTkiLz48L2ZpbHRlcj48ZmlsdGVyIGlkPSJ4IiB3aWR0aD0iMjcuNjc0IiBoZWlnaHQ9IjI3LjU0NSIgeD0iLTIuMzk2IiB5PSIyNi40NzYiIGNvbG9yLWludGVycG9sYXRpb24tZmlsdGVycz0ic1JHQiIgZmlsdGVyVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48ZmVGbG9vZCBmbG9vZC1vcGFjaXR5PSIwIiByZXN1bHQ9IkJhY2tncm91bmRJbWFnZUZpeCIvPjxmZUJsZW5kIGluPSJTb3VyY2VHcmFwaGljIiBpbjI9IkJhY2tncm91bmRJbWFnZUZpeCIgcmVzdWx0PSJzaGFwZSIvPjxmZUdhdXNzaWFuQmx1ciByZXN1bHQ9ImVmZmVjdDFfZm9yZWdyb3VuZEJsdXJfMzEyMF80ODI1NSIgc3RkRGV2aWF0aW9uPSIzLjM4Ii8+PC9maWx0ZXI+PGZpbHRlciBpZD0ieiIgd2lkdGg9IjIwLjkzNyIgaGVpZ2h0PSIyMS43MDgiIHg9Ii42NTMiIHk9IjI4LjQyMiIgY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzPSJzUkdCIiBmaWx0ZXJVbml0cz0idXNlclNwYWNlT25Vc2UiPjxmZUZsb29kIGZsb29kLW9wYWNpdHk9IjAiIHJlc3VsdD0iQmFja2dyb3VuZEltYWdlRml4Ii8+PGZlQmxlbmQgaW49IlNvdXJjZUdyYXBoaWMiIGluMj0iQmFja2dyb3VuZEltYWdlRml4IiByZXN1bHQ9InNoYXBlIi8+PGZlR2F1c3NpYW5CbHVyIHJlc3VsdD0iZWZmZWN0MV9mb3JlZ3JvdW5kQmx1cl8zMTIwXzQ4MjU1IiBzdGREZXZpYXRpb249IjIuMSIvPjwvZmlsdGVyPjxmaWx0ZXIgaWQ9IkIiIHdpZHRoPSI1LjUzMiIgaGVpZ2h0PSI4Ljk5NCIgeD0iMTIuNzEiIHk9IjM0LjY0OSIgY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzPSJzUkdCIiBmaWx0ZXJVbml0cz0idXNlclNwYWNlT25Vc2UiPjxmZUZsb29kIGZsb29kLW9wYWNpdHk9IjAiIHJlc3VsdD0iQmFja2dyb3VuZEltYWdlRml4Ii8+PGZlQmxlbmQgaW49IlNvdXJjZUdyYXBoaWMiIGluMj0iQmFja2dyb3VuZEltYWdlRml4IiByZXN1bHQ9InNoYXBlIi8+PGZlR2F1c3NpYW5CbHVyIHJlc3VsdD0iZWZmZWN0MV9mb3JlZ3JvdW5kQmx1cl8zMTIwXzQ4MjU1IiBzdGREZXZpYXRpb249Ii4zMiIvPjwvZmlsdGVyPjxmaWx0ZXIgaWQ9IkUiIHdpZHRoPSIxOS4zMzkiIGhlaWdodD0iMjAuMzYiIHg9IjI1LjU3OSIgeT0iMzEuNDM1IiBjb2xvci1pbnRlcnBvbGF0aW9uLWZpbHRlcnM9InNSR0IiIGZpbHRlclVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PGZlRmxvb2QgZmxvb2Qtb3BhY2l0eT0iMCIgcmVzdWx0PSJCYWNrZ3JvdW5kSW1hZ2VGaXgiLz48ZmVCbGVuZCBpbj0iU291cmNlR3JhcGhpYyIgaW4yPSJCYWNrZ3JvdW5kSW1hZ2VGaXgiIHJlc3VsdD0ic2hhcGUiLz48ZmVHYXVzc2lhbkJsdXIgcmVzdWx0PSJlZmZlY3QxX2ZvcmVncm91bmRCbHVyXzMxMjBfNDgyNTUiIHN0ZERldmlhdGlvbj0iMS45NSIvPjwvZmlsdGVyPjxmaWx0ZXIgaWQ9IkkiIHdpZHRoPSIyOS4yNTgiIGhlaWdodD0iMjkuNDM4IiB4PSIyMi43NTIiIHk9IjI1LjU4OCIgY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzPSJzUkdCIiBmaWx0ZXJVbml0cz0idXNlclNwYWNlT25Vc2UiPjxmZUZsb29kIGZsb29kLW9wYWNpdHk9IjAiIHJlc3VsdD0iQmFja2dyb3VuZEltYWdlRml4Ii8+PGZlQmxlbmQgaW49IlNvdXJjZUdyYXBoaWMiIGluMj0iQmFja2dyb3VuZEltYWdlRml4IiByZXN1bHQ9InNoYXBlIi8+PGZlR2F1c3NpYW5CbHVyIHJlc3VsdD0iZWZmZWN0MV9mb3JlZ3JvdW5kQmx1cl8zMTIwXzQ4MjU1IiBzdGREZXZpYXRpb249IjQuMTIiLz48L2ZpbHRlcj48ZmlsdGVyIGlkPSJLIiB3aWR0aD0iMjQuNjc3IiBoZWlnaHQ9IjI0LjYxNCIgeD0iMjUuMjczIiB5PSIyNi42MTMiIGNvbG9yLWludGVycG9sYXRpb24tZmlsdGVycz0ic1JHQiIgZmlsdGVyVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48ZmVGbG9vZCBmbG9vZC1vcGFjaXR5PSIwIiByZXN1bHQ9IkJhY2tncm91bmRJbWFnZUZpeCIvPjxmZUJsZW5kIGluPSJTb3VyY2VHcmFwaGljIiBpbjI9IkJhY2tncm91bmRJbWFnZUZpeCIgcmVzdWx0PSJzaGFwZSIvPjxmZUdhdXNzaWFuQmx1ciByZXN1bHQ9ImVmZmVjdDFfZm9yZWdyb3VuZEJsdXJfMzEyMF80ODI1NSIgc3RkRGV2aWF0aW9uPSIzLjEyIi8+PC9maWx0ZXI+PGZpbHRlciBpZD0iTSIgd2lkdGg9IjEwLjUzMSIgaGVpZ2h0PSIzLjA3OCIgeD0iMzAuNTUxIiB5PSIzMi44NTIiIGNvbG9yLWludGVycG9sYXRpb24tZmlsdGVycz0ic1JHQiIgZmlsdGVyVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48ZmVGbG9vZCBmbG9vZC1vcGFjaXR5PSIwIiByZXN1bHQ9IkJhY2tncm91bmRJbWFnZUZpeCIvPjxmZUJsZW5kIGluPSJTb3VyY2VHcmFwaGljIiBpbjI9IkJhY2tncm91bmRJbWFnZUZpeCIgcmVzdWx0PSJzaGFwZSIvPjxmZUdhdXNzaWFuQmx1ciByZXN1bHQ9ImVmZmVjdDFfZm9yZWdyb3VuZEJsdXJfMzEyMF80ODI1NSIgc3RkRGV2aWF0aW9uPSIuNDEiLz48L2ZpbHRlcj48ZmlsdGVyIGlkPSJQIiB3aWR0aD0iMTUuMyIgaGVpZ2h0PSIxNC41MTMiIHg9IjI4LjIxNyIgeT0iMjkuNTQ2IiBjb2xvci1pbnRlcnBvbGF0aW9uLWZpbHRlcnM9InNSR0IiIGZpbHRlclVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PGZlRmxvb2QgZmxvb2Qtb3BhY2l0eT0iMCIgcmVzdWx0PSJCYWNrZ3JvdW5kSW1hZ2VGaXgiLz48ZmVCbGVuZCBpbj0iU291cmNlR3JhcGhpYyIgaW4yPSJCYWNrZ3JvdW5kSW1hZ2VGaXgiIHJlc3VsdD0ic2hhcGUiLz48ZmVHYXVzc2lhbkJsdXIgcmVzdWx0PSJlZmZlY3QxX2ZvcmVncm91bmRCbHVyXzMxMjBfNDgyNTUiIHN0ZERldmlhdGlvbj0iMi40NSIvPjwvZmlsdGVyPjxmaWx0ZXIgaWQ9IlMiIHdpZHRoPSI5Ljk4IiBoZWlnaHQ9IjcuODg3IiB4PSIzMC44NzciIHk9IjMxLjg5OSIgY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzPSJzUkdCIiBmaWx0ZXJVbml0cz0idXNlclNwYWNlT25Vc2UiPjxmZUZsb29kIGZsb29kLW9wYWNpdHk9IjAiIHJlc3VsdD0iQmFja2dyb3VuZEltYWdlRml4Ii8+PGZlQmxlbmQgaW49IlNvdXJjZUdyYXBoaWMiIGluMj0iQmFja2dyb3VuZEltYWdlRml4IiByZXN1bHQ9InNoYXBlIi8+PGZlR2F1c3NpYW5CbHVyIHJlc3VsdD0iZWZmZWN0MV9mb3JlZ3JvdW5kQmx1cl8zMTIwXzQ4MjU1IiBzdGREZXZpYXRpb249IjEuMTIiLz48L2ZpbHRlcj48ZmlsdGVyIGlkPSJWIiB3aWR0aD0iOS4xNjMiIGhlaWdodD0iNi4xNiIgeD0iMzEuNzU4IiB5PSIzMC4zMTEiIGNvbG9yLWludGVycG9sYXRpb24tZmlsdGVycz0ic1JHQiIgZmlsdGVyVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48ZmVGbG9vZCBmbG9vZC1vcGFjaXR5PSIwIiByZXN1bHQ9IkJhY2tncm91bmRJbWFnZUZpeCIvPjxmZUJsZW5kIGluPSJTb3VyY2VHcmFwaGljIiBpbjI9IkJhY2tncm91bmRJbWFnZUZpeCIgcmVzdWx0PSJzaGFwZSIvPjxmZUdhdXNzaWFuQmx1ciByZXN1bHQ9ImVmZmVjdDFfZm9yZWdyb3VuZEJsdXJfMzEyMF80ODI1NSIgc3RkRGV2aWF0aW9uPSIuODgiLz48L2ZpbHRlcj48ZmlsdGVyIGlkPSJZIiB3aWR0aD0iOS4xNjMiIGhlaWdodD0iNi4xNiIgeD0iMzEuNzU4IiB5PSIzMC4zMTEiIGNvbG9yLWludGVycG9sYXRpb24tZmlsdGVycz0ic1JHQiIgZmlsdGVyVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48ZmVGbG9vZCBmbG9vZC1vcGFjaXR5PSIwIiByZXN1bHQ9IkJhY2tncm91bmRJbWFnZUZpeCIvPjxmZUJsZW5kIGluPSJTb3VyY2VHcmFwaGljIiBpbjI9IkJhY2tncm91bmRJbWFnZUZpeCIgcmVzdWx0PSJzaGFwZSIvPjxmZUdhdXNzaWFuQmx1ciByZXN1bHQ9ImVmZmVjdDFfZm9yZWdyb3VuZEJsdXJfMzEyMF80ODI1NSIgc3RkRGV2aWF0aW9uPSIuODgiLz48L2ZpbHRlcj48ZmlsdGVyIGlkPSJhYyIgd2lkdGg9IjIuNjA5IiBoZWlnaHQ9IjMuMTIxIiB4PSIxOC43NTkiIHk9IjguMTgiIGNvbG9yLWludGVycG9sYXRpb24tZmlsdGVycz0ic1JHQiIgZmlsdGVyVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48ZmVGbG9vZCBmbG9vZC1vcGFjaXR5PSIwIiByZXN1bHQ9IkJhY2tncm91bmRJbWFnZUZpeCIvPjxmZUJsZW5kIGluPSJTb3VyY2VHcmFwaGljIiBpbjI9IkJhY2tncm91bmRJbWFnZUZpeCIgcmVzdWx0PSJzaGFwZSIvPjxmZUdhdXNzaWFuQmx1ciByZXN1bHQ9ImVmZmVjdDFfZm9yZWdyb3VuZEJsdXJfMzEyMF80ODI1NSIgc3RkRGV2aWF0aW9uPSIuNDQiLz48L2ZpbHRlcj48ZmlsdGVyIGlkPSJhZyIgd2lkdGg9IjIuNzQ0IiBoZWlnaHQ9IjIuNTE2IiB4PSIxOS4xNzQiIHk9IjUuOTIzIiBjb2xvci1pbnRlcnBvbGF0aW9uLWZpbHRlcnM9InNSR0IiIGZpbHRlclVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PGZlRmxvb2QgZmxvb2Qtb3BhY2l0eT0iMCIgcmVzdWx0PSJCYWNrZ3JvdW5kSW1hZ2VGaXgiLz48ZmVCbGVuZCBpbj0iU291cmNlR3JhcGhpYyIgaW4yPSJCYWNrZ3JvdW5kSW1hZ2VGaXgiIHJlc3VsdD0ic2hhcGUiLz48ZmVHYXVzc2lhbkJsdXIgcmVzdWx0PSJlZmZlY3QxX2ZvcmVncm91bmRCbHVyXzMxMjBfNDgyNTUiIHN0ZERldmlhdGlvbj0iLjEyIi8+PC9maWx0ZXI+PGZpbHRlciBpZD0iYWsiIHdpZHRoPSIyLjkyOCIgaGVpZ2h0PSIyLjkxMSIgeD0iMjQuNzg3IiB5PSI4LjAwNyIgY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzPSJzUkdCIiBmaWx0ZXJVbml0cz0idXNlclNwYWNlT25Vc2UiPjxmZUZsb29kIGZsb29kLW9wYWNpdHk9IjAiIHJlc3VsdD0iQmFja2dyb3VuZEltYWdlRml4Ii8+PGZlQmxlbmQgaW49IlNvdXJjZUdyYXBoaWMiIGluMj0iQmFja2dyb3VuZEltYWdlRml4IiByZXN1bHQ9InNoYXBlIi8+PGZlR2F1c3NpYW5CbHVyIHJlc3VsdD0iZWZmZWN0MV9mb3JlZ3JvdW5kQmx1cl8zMTIwXzQ4MjU1IiBzdGREZXZpYXRpb249Ii40NSIvPjwvZmlsdGVyPjxmaWx0ZXIgaWQ9ImFvIiB3aWR0aD0iMi45OTkiIGhlaWdodD0iMi44MDgiIHg9IjI1Ljc3NiIgeT0iNS41ODYiIGNvbG9yLWludGVycG9sYXRpb24tZmlsdGVycz0ic1JHQiIgZmlsdGVyVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48ZmVGbG9vZCBmbG9vZC1vcGFjaXR5PSIwIiByZXN1bHQ9IkJhY2tncm91bmRJbWFnZUZpeCIvPjxmZUJsZW5kIGluPSJTb3VyY2VHcmFwaGljIiBpbjI9IkJhY2tncm91bmRJbWFnZUZpeCIgcmVzdWx0PSJzaGFwZSIvPjxmZUdhdXNzaWFuQmx1ciByZXN1bHQ9ImVmZmVjdDFfZm9yZWdyb3VuZEJsdXJfMzEyMF80ODI1NSIgc3RkRGV2aWF0aW9uPSIuMTMiLz48L2ZpbHRlcj48ZmlsdGVyIGlkPSJhciIgd2lkdGg9IjE3LjMzNCIgaGVpZ2h0PSIxMy4xMTEiIHg9IjE0Ljc3NyIgeT0iOS43NjciIGNvbG9yLWludGVycG9sYXRpb24tZmlsdGVycz0ic1JHQiIgZmlsdGVyVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48ZmVGbG9vZCBmbG9vZC1vcGFjaXR5PSIwIiByZXN1bHQ9IkJhY2tncm91bmRJbWFnZUZpeCIvPjxmZUJsZW5kIGluPSJTb3VyY2VHcmFwaGljIiBpbjI9IkJhY2tncm91bmRJbWFnZUZpeCIgcmVzdWx0PSJzaGFwZSIvPjxmZUdhdXNzaWFuQmx1ciByZXN1bHQ9ImVmZmVjdDFfZm9yZWdyb3VuZEJsdXJfMzEyMF80ODI1NSIgc3RkRGV2aWF0aW9uPSIxLjc1Ii8+PC9maWx0ZXI+PGZpbHRlciBpZD0iYXQiIHdpZHRoPSIxMy4wOTIiIGhlaWdodD0iNy42OTUiIHg9IjE2LjU4NiIgeT0iMTEuMjE2IiBjb2xvci1pbnRlcnBvbGF0aW9uLWZpbHRlcnM9InNSR0IiIGZpbHRlclVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PGZlRmxvb2QgZmxvb2Qtb3BhY2l0eT0iMCIgcmVzdWx0PSJCYWNrZ3JvdW5kSW1hZ2VGaXgiLz48ZmVCbGVuZCBpbj0iU291cmNlR3JhcGhpYyIgaW4yPSJCYWNrZ3JvdW5kSW1hZ2VGaXgiIHJlc3VsdD0ic2hhcGUiLz48ZmVHYXVzc2lhbkJsdXIgcmVzdWx0PSJlZmZlY3QxX2ZvcmVncm91bmRCbHVyXzMxMjBfNDgyNTUiIHN0ZERldmlhdGlvbj0iLjgiLz48L2ZpbHRlcj48ZmlsdGVyIGlkPSJheCIgd2lkdGg9IjUuMzI1IiBoZWlnaHQ9IjQuNzI1IiB4PSIxOS4wMzciIHk9IjEyLjg2OSIgY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzPSJzUkdCIiBmaWx0ZXJVbml0cz0idXNlclNwYWNlT25Vc2UiPjxmZUZsb29kIGZsb29kLW9wYWNpdHk9IjAiIHJlc3VsdD0iQmFja2dyb3VuZEltYWdlRml4Ii8+PGZlQmxlbmQgaW49IlNvdXJjZUdyYXBoaWMiIGluMj0iQmFja2dyb3VuZEltYWdlRml4IiByZXN1bHQ9InNoYXBlIi8+PGZlR2F1c3NpYW5CbHVyIHJlc3VsdD0iZWZmZWN0MV9mb3JlZ3JvdW5kQmx1cl8zMTIwXzQ4MjU1IiBzdGREZXZpYXRpb249Ii43NyIvPjwvZmlsdGVyPjxmaWx0ZXIgaWQ9ImF6IiB3aWR0aD0iMTEuMTQ3IiBoZWlnaHQ9IjYuMzA0IiB4PSIxNy4yNzEiIHk9IjEwLjU3NSIgY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzPSJzUkdCIiBmaWx0ZXJVbml0cz0idXNlclNwYWNlT25Vc2UiPjxmZUZsb29kIGZsb29kLW9wYWNpdHk9IjAiIHJlc3VsdD0iQmFja2dyb3VuZEltYWdlRml4Ii8+PGZlQmxlbmQgaW49IlNvdXJjZUdyYXBoaWMiIGluMj0iQmFja2dyb3VuZEltYWdlRml4IiByZXN1bHQ9InNoYXBlIi8+PGZlR2F1c3NpYW5CbHVyIHJlc3VsdD0iZWZmZWN0MV9mb3JlZ3JvdW5kQmx1cl8zMTIwXzQ4MjU1IiBzdGREZXZpYXRpb249Ii42NSIvPjwvZmlsdGVyPjxmaWx0ZXIgaWQ9ImFDIiB3aWR0aD0iNC45NjUiIGhlaWdodD0iNS40NDYiIHg9IjIwLjgzMSIgeT0iMTAuNTcxIiBjb2xvci1pbnRlcnBvbGF0aW9uLWZpbHRlcnM9InNSR0IiIGZpbHRlclVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PGZlRmxvb2QgZmxvb2Qtb3BhY2l0eT0iMCIgcmVzdWx0PSJCYWNrZ3JvdW5kSW1hZ2VGaXgiLz48ZmVCbGVuZCBpbj0iU291cmNlR3JhcGhpYyIgaW4yPSJCYWNrZ3JvdW5kSW1hZ2VGaXgiIHJlc3VsdD0ic2hhcGUiLz48ZmVHYXVzc2lhbkJsdXIgcmVzdWx0PSJlZmZlY3QxX2ZvcmVncm91bmRCbHVyXzMxMjBfNDgyNTUiIHN0ZERldmlhdGlvbj0iLjczIi8+PC9maWx0ZXI+PGZpbHRlciBpZD0iYUQiIHdpZHRoPSIuNzY4IiBoZWlnaHQ9Ii44MDUiIHg9IjIwLjYxNiIgeT0iMTAuODY4IiBjb2xvci1pbnRlcnBvbGF0aW9uLWZpbHRlcnM9InNSR0IiIGZpbHRlclVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PGZlRmxvb2QgZmxvb2Qtb3BhY2l0eT0iMCIgcmVzdWx0PSJCYWNrZ3JvdW5kSW1hZ2VGaXgiLz48ZmVCbGVuZCBpbj0iU291cmNlR3JhcGhpYyIgaW4yPSJCYWNrZ3JvdW5kSW1hZ2VGaXgiIHJlc3VsdD0ic2hhcGUiLz48ZmVHYXVzc2lhbkJsdXIgcmVzdWx0PSJlZmZlY3QxX2ZvcmVncm91bmRCbHVyXzMxMjBfNDgyNTUiIHN0ZERldmlhdGlvbj0iLjEiLz48L2ZpbHRlcj48ZmlsdGVyIGlkPSJhRiIgd2lkdGg9IjEuMzE2IiBoZWlnaHQ9Ii44ODEiIHg9IjIyLjc3OCIgeT0iMTAuNzgzIiBjb2xvci1pbnRlcnBvbGF0aW9uLWZpbHRlcnM9InNSR0IiIGZpbHRlclVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PGZlRmxvb2QgZmxvb2Qtb3BhY2l0eT0iMCIgcmVzdWx0PSJCYWNrZ3JvdW5kSW1hZ2VGaXgiLz48ZmVCbGVuZCBpbj0iU291cmNlR3JhcGhpYyIgaW4yPSJCYWNrZ3JvdW5kSW1hZ2VGaXgiIHJlc3VsdD0ic2hhcGUiLz48ZmVHYXVzc2lhbkJsdXIgcmVzdWx0PSJlZmZlY3QxX2ZvcmVncm91bmRCbHVyXzMxMjBfNDgyNTUiIHN0ZERldmlhdGlvbj0iLjEiLz48L2ZpbHRlcj48ZmlsdGVyIGlkPSJhSSIgd2lkdGg9IjEuODUzIiBoZWlnaHQ9IjIuMDYyIiB4PSIyNi41OTkiIHk9IjExLjkzNCIgY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzPSJzUkdCIiBmaWx0ZXJVbml0cz0idXNlclNwYWNlT25Vc2UiPjxmZUZsb29kIGZsb29kLW9wYWNpdHk9IjAiIHJlc3VsdD0iQmFja2dyb3VuZEltYWdlRml4Ii8+PGZlQmxlbmQgaW49IlNvdXJjZUdyYXBoaWMiIGluMj0iQmFja2dyb3VuZEltYWdlRml4IiByZXN1bHQ9InNoYXBlIi8+PGZlR2F1c3NpYW5CbHVyIHJlc3VsdD0iZWZmZWN0MV9mb3JlZ3JvdW5kQmx1cl8zMTIwXzQ4MjU1IiBzdGREZXZpYXRpb249Ii4yMyIvPjwvZmlsdGVyPjxyYWRpYWxHcmFkaWVudCBpZD0iYyIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDMuNTYyNSAwIDAgMy4zNzUgMTUuMjIxIDIyLjcyMykiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcC8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLW9wYWNpdHk9Ii4yNSIvPjwvcmFkaWFsR3JhZGllbnQ+PHJhZGlhbEdyYWRpZW50IGlkPSJmIiBjeD0iMCIgY3k9IjAiIHI9IjEiIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoNC40MjUgMCAwIDMuMzc1IDI3LjMyNiAyNC42NzUpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3AvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1vcGFjaXR5PSIuMjUiLz48L3JhZGlhbEdyYWRpZW50PjxyYWRpYWxHcmFkaWVudCBpZD0iaSIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDEuNzUzMTIgMCAwIDEuODc1IDIxLjQxNCAyMy45KSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3Atb3BhY2l0eT0iLjI1Ii8+PC9yYWRpYWxHcmFkaWVudD48cmFkaWFsR3JhZGllbnQgaWQ9IlEiIGN4PSIwIiBjeT0iMCIgcj0iMSIgZ3JhZGllbnRUcmFuc2Zvcm09InJvdGF0ZSgxNSAtMTIwLjc0IDE1My4zMykgc2NhbGUoMy42ODYyNSAzLjg3KSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiMxMTA4MDAiLz48c3RvcCBvZmZzZXQ9Ii41OSIgc3RvcC1jb2xvcj0iI0E2NUEwMCIgc3RvcC1vcGFjaXR5PSIuOCIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0ZGOTIxRSIgc3RvcC1vcGFjaXR5PSIwIi8+PC9yYWRpYWxHcmFkaWVudD48cmFkaWFsR3JhZGllbnQgaWQ9IlQiIGN4PSIwIiBjeT0iMCIgcj0iMSIgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgzLjY5Nzk1IC0uMTU2MjggLjExNzY1IDIuNzgzNzcgMzUuNTcgMzUuNjA0KSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiMxMTA4MDAiLz48c3RvcCBvZmZzZXQ9Ii41OSIgc3RvcC1jb2xvcj0iI0E2NUEwMCIgc3RvcC1vcGFjaXR5PSIuOCIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0ZGOTIxRSIgc3RvcC1vcGFjaXR5PSIwIi8+PC9yYWRpYWxHcmFkaWVudD48cmFkaWFsR3JhZGllbnQgaWQ9IlciIGN4PSIwIiBjeT0iMCIgcj0iMSIgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgxLjE5NTA1IC41MTk2MiAtLjI0IC41NTE5NiAzOC4zNzIgMzMuMTE2KSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM3QzdDN0MiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM3QzdDN0MiIHN0b3Atb3BhY2l0eT0iLjMzIi8+PC9yYWRpYWxHcmFkaWVudD48cmFkaWFsR3JhZGllbnQgaWQ9ImFhIiBjeD0iMCIgY3k9IjAiIHI9IjEiIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMS45MTk5IC0uMDIwMSAuMDMwNzkgMi45Mzk4NCAxOS45NjcgOS42NCkiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBzdG9wLWNvbG9yPSIjRkVGRUZDIi8+PHN0b3Agb2Zmc2V0PSIuNzUiIHN0b3AtY29sb3I9IiNGRUZFRkMiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNENEQ0RDQiLz48L3JhZGlhbEdyYWRpZW50PjxyYWRpYWxHcmFkaWVudCBpZD0iYWYiIGN4PSIwIiBjeT0iMCIgcj0iMSIgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgxLjE1NjMgLS4xOTAzOSAuMTc1NzcgMS4wNjc1IDE5LjY2NyA4LjIwMSkiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBzdG9wLWNvbG9yPSIjQzhDOEM4Ii8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjNzk3OTc4Ii8+PC9yYWRpYWxHcmFkaWVudD48cmFkaWFsR3JhZGllbnQgaWQ9ImFpIiBjeD0iMCIgY3k9IjAiIHI9IjEiIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMi41NTYyNCAtLjA4MDMzIC4wOTIzNSAyLjkzODU1IDI1Ljg4NiA5LjY0KSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiNGRUZFRkMiLz48c3RvcCBvZmZzZXQ9Ii43NSIgc3RvcC1jb2xvcj0iI0ZFRkVGQyIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0Q0RDRENCIvPjwvcmFkaWFsR3JhZGllbnQ+PHJhZGlhbEdyYWRpZW50IGlkPSJhdSIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFRyYW5zZm9ybT0icm90YXRlKC0zNiAyOC4zNzUgLTI4LjMwNykgc2NhbGUoMi4xNDUgMS45NDYyNSkiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBzdG9wLWNvbG9yPSIjMDIwMjA0Ii8+PHN0b3Agb2Zmc2V0PSIuNzMiIHN0b3AtY29sb3I9IiMwMjAyMDQiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM1QzVDNUMiLz48L3JhZGlhbEdyYWRpZW50PjxyYWRpYWxHcmFkaWVudCBpZD0iYXYiIGN4PSIwIiBjeT0iMCIgcj0iMSIgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCg0LjcwNjUyIC0xLjkzOTg5IDEuMzYyNTYgMy4zMDU4MyAyNC4zMzIgMTMuMjQpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agc3RvcC1jb2xvcj0iI0QyOTQwQSIvPjxzdG9wIG9mZnNldD0iLjc1IiBzdG9wLWNvbG9yPSIjRDg5QzA4Ii8+PHN0b3Agb2Zmc2V0PSIuODciIHN0b3AtY29sb3I9IiNCNjdFMDciLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM5NDYxMDYiLz48L3JhZGlhbEdyYWRpZW50PjxyYWRpYWxHcmFkaWVudCBpZD0iYUUiIGN4PSIwIiBjeT0iMCIgcj0iMSIgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCguMjQ3NSAwIDAgLjI2NjI1IDIxLjAyIDExLjIyNykiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBzdG9wLWNvbG9yPSIjM0EyOTAzIi8+PHN0b3Agb2Zmc2V0PSIuNTUiIHN0b3AtY29sb3I9IiM3MzUyMDgiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNBQzhDMDQiLz48L3JhZGlhbEdyYWRpZW50PjxyYWRpYWxHcmFkaWVudCBpZD0iYUciIGN4PSIwIiBjeT0iMCIgcj0iMSIgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCguNTIxMjUgMCAwIC4zMDM3NSAyMy4zNzIgMTEuMTk0KSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiMzQTI5MDMiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzczNTIwOCIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0FDOEMwNCIvPjwvcmFkaWFsR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJ2IiB4MT0iOC4wOTYiIHgyPSIxNS44MDgiIHkxPSIzNi4xODkiIHkyPSI0OS4xMjkiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBzdG9wLWNvbG9yPSIjQjk4MzA5Ii8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMzgyNjA1Ii8+PC9saW5lYXJHcmFkaWVudD48bGluZWFyR3JhZGllbnQgaWQ9IkMiIHgxPSIxNS44MzgiIHgyPSIxOC4yNjQiIHkxPSIzOS41MzEiIHkyPSI0NC4xMDIiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBzdG9wLWNvbG9yPSIjRUJDNDBDIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjRUJDNDBDIiBzdG9wLW9wYWNpdHk9IjAiLz48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCBpZD0iRiIgeDE9IjMxLjI5OSIgeDI9IjMxLjkxMyIgeTE9IjM5Ljc0MiIgeTI9IjQ0LjE5OSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3Atb3BhY2l0eT0iMCIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJHIiB4MT0iMzIuMTU2IiB4Mj0iMzkuOTI2IiB5MT0iNDcuNDQxIiB5Mj0iMzQuODQ1IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agc3RvcC1jb2xvcj0iIzNFMkEwNiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0FENzgwQSIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJOIiB4MT0iMzQuMjc3IiB4Mj0iMzQuMDQ4IiB5MT0iMzMuODc2IiB5Mj0iMzUuOTMyIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agc3RvcC1jb2xvcj0iI0YzQ0QwQyIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0YzQ0QwQyIgc3RvcC1vcGFjaXR5PSIwIi8+PC9saW5lYXJHcmFkaWVudD48bGluZWFyR3JhZGllbnQgaWQ9IloiIHgxPSIzNC44MTciIHgyPSIzNS4zMDEiIHkxPSIzMi41NDYiIHkyPSIzMi41MjYiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBzdG9wLWNvbG9yPSIjN0M3QzdDIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjN0M3QzdDIiBzdG9wLW9wYWNpdHk9Ii4zMyIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJhZCIgeDE9IjE5LjU1NCIgeDI9IjIwLjQ5NyIgeTE9IjguNzQ1IiB5Mj0iMTAuNDMxIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agc3RvcC1jb2xvcj0iIzc1NzU3NCIgc3RvcC1vcGFjaXR5PSIwIi8+PHN0b3Agb2Zmc2V0PSIuMjUiIHN0b3AtY29sb3I9IiM3NTc1NzQiLz48c3RvcCBvZmZzZXQ9Ii41IiBzdG9wLWNvbG9yPSIjNzU3NTc0Ii8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjNzU3NTc0IiBzdG9wLW9wYWNpdHk9IjAiLz48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCBpZD0iYWgiIHgxPSIxOS40MjMiIHgyPSIyMS40NjUiIHkxPSI2LjA5NiIgeTI9IjguMTgxIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agc3RvcC1jb2xvcj0iIzY0NjQ2NCIgc3RvcC1vcGFjaXR5PSIwIi8+PHN0b3Agb2Zmc2V0PSIuMzEiIHN0b3AtY29sb3I9IiM2NDY0NjQiIHN0b3Atb3BhY2l0eT0iLjU4Ii8+PHN0b3Agb2Zmc2V0PSIuNDciIHN0b3AtY29sb3I9IiM2NDY0NjQiLz48c3RvcCBvZmZzZXQ9Ii43MyIgc3RvcC1jb2xvcj0iIzY0NjQ2NCIgc3RvcC1vcGFjaXR5PSIuMjYiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM2NDY0NjQiIHN0b3Atb3BhY2l0eT0iMCIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJhbCIgeDE9IjI1Ljg1MSIgeDI9IjI2LjkzNiIgeTE9IjguODU5IiB5Mj0iMTAuMTQ2IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agc3RvcC1jb2xvcj0iIzk0OTQ5NCIgc3RvcC1vcGFjaXR5PSIuMzkiLz48c3RvcCBvZmZzZXQ9Ii41IiBzdG9wLWNvbG9yPSIjOTQ5NDk0Ii8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjOTQ5NDk0IiBzdG9wLW9wYWNpdHk9Ii4zOSIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJhbiIgeDE9IjI0LjkxOSIgeDI9IjI4LjM3MiIgeTE9IjYuNzkzIiB5Mj0iOC44MTQiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBzdG9wLWNvbG9yPSIjNzQ3NDc0Ii8+PHN0b3Agb2Zmc2V0PSIuMTMiIHN0b3AtY29sb3I9IiM4QzhDOEMiLz48c3RvcCBvZmZzZXQ9Ii4yNSIgc3RvcC1jb2xvcj0iI0E0QTRBNCIvPjxzdG9wIG9mZnNldD0iLjUiIHN0b3AtY29sb3I9IiNENEQ0RDQiLz48c3RvcCBvZmZzZXQ9Ii42MiIgc3RvcC1jb2xvcj0iI0Q0RDRENCIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzdDN0M3QyIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJhcCIgeDE9IjI2LjA5MyIgeDI9IjI4LjM5MSIgeTE9IjUuOTE4IiB5Mj0iOC4wODkiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBzdG9wLWNvbG9yPSIjNjQ2NDY0IiBzdG9wLW9wYWNpdHk9IjAiLz48c3RvcCBvZmZzZXQ9Ii4zMSIgc3RvcC1jb2xvcj0iIzY0NjQ2NCIgc3RvcC1vcGFjaXR5PSIuNTgiLz48c3RvcCBvZmZzZXQ9Ii40NyIgc3RvcC1jb2xvcj0iIzY0NjQ2NCIvPjxzdG9wIG9mZnNldD0iLjczIiBzdG9wLWNvbG9yPSIjNjQ2NDY0IiBzdG9wLW9wYWNpdHk9Ii4yNiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzY0NjQ2NCIgc3RvcC1vcGFjaXR5PSIwIi8+PC9saW5lYXJHcmFkaWVudD48bGluZWFyR3JhZGllbnQgaWQ9ImFBIiB4MT0iMTguMzkyIiB4Mj0iMjcuNTE5IiB5MT0iMTIuOTg2IiB5Mj0iMTIuOTE1IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agc3RvcC1jb2xvcj0iI0FENzgwQSIvPjxzdG9wIG9mZnNldD0iLjEyIiBzdG9wLWNvbG9yPSIjRDg5RTA4Ii8+PHN0b3Agb2Zmc2V0PSIuMjUiIHN0b3AtY29sb3I9IiNFREI4MEIiLz48c3RvcCBvZmZzZXQ9Ii4zOSIgc3RvcC1jb2xvcj0iI0VCQzgwRCIvPjxzdG9wIG9mZnNldD0iLjUzIiBzdG9wLWNvbG9yPSIjRjVEODM4Ii8+PHN0b3Agb2Zmc2V0PSIuNzciIHN0b3AtY29sb3I9IiNGNkQ4MTEiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNGNUNEMzEiLz48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCBpZD0iYUoiIHgxPSIyNy41MTQiIHgyPSIyNy41MTQiIHkxPSIxMi42NTQiIHkyPSIxMy4zMjkiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBzdG9wLWNvbG9yPSIjRjVDRTJEIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjRDc5QjA4Ii8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PC9zdmc+";const U0=Object.freeze(Object.defineProperty({__proto__:null,default:pt},Symbol.toStringTag,{value:"Module"}));var Ft="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyOCIgaGVpZ2h0PSIyOCI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJhIiB4MT0iMzUyIiB4Mj0iMzUyIiB5MT0iMCIgeTI9IjcwNCIgZ3JhZGllbnRUcmFuc2Zvcm09InNjYWxlKC4wMzk3NykiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBvZmZzZXQ9IjAiIHN0eWxlPSJzdG9wLWNvbG9yOiMwMDRiZmY7c3RvcC1vcGFjaXR5OjEiLz48c3RvcCBvZmZzZXQ9IjEiIHN0eWxlPSJzdG9wLWNvbG9yOiM0Y2VhYWM7c3RvcC1vcGFjaXR5OjEiLz48L2xpbmVhckdyYWRpZW50PjxjbGlwUGF0aCBpZD0iYiI+PHBhdGggZD0iTTcuNjM3IDQuNDUzaDEyLjcyNnYxOS4wOTRINy42MzdabTAgMCIvPjwvY2xpcFBhdGg+PC9kZWZzPjxwYXRoIGQ9Ik0wIDBoMjh2MjhIMHoiIHN0eWxlPSJmaWxsOnVybCgjYSk7c3Ryb2tlOm5vbmUiLz48ZyBjbGlwLXBhdGg9InVybCgjYikiPjxwYXRoIGQ9Ik0yMC4zNjMgMTEuMzZWOC43MUw5Ljc1MyA0LjQ1NCA3LjYzOCA1LjUzMWwuMDExIDguMjQ2IDcuOTM0IDMuMTk2LTQuMjM4IDEuODA0di0xLjM5NGwtMS45NDYtLjc5My0xLjc1LjgyOHY1LjA1bDIuMTEgMS4wNzkgMTAuNjA1LTQuNzg1di0zLjM5NWwtOS41NDctMy44MnYtMi4zMmw3LjU3NSAzLjAyN1ptMCAwIiBzdHlsZT0ic3Ryb2tlOm5vbmU7ZmlsbC1ydWxlOm5vbnplcm87ZmlsbDojZmZmO2ZpbGwtb3BhY2l0eToxIi8+PC9nPjwvc3ZnPgo=";const gt=Object.freeze(Object.defineProperty({__proto__:null,default:Ft},Symbol.toStringTag,{value:"Module"}));var Bt="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjgiIGhlaWdodD0iMjgiIHZpZXdCb3g9IjAgMCAyOCAyOCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI4IiBoZWlnaHQ9IjI4IiBmaWxsPSIjM0I5OUZDIi8+CjxwYXRoIGQ9Ik04LjM4OTY5IDEwLjM3MzlDMTEuNDg4MiA3LjI3NTM4IDE2LjUxMTggNy4yNzUzOCAxOS42MTAzIDEwLjM3MzlMMTkuOTgzMiAxMC43NDY4QzIwLjEzODIgMTAuOTAxNyAyMC4xMzgyIDExLjE1MjkgMTkuOTgzMiAxMS4zMDc4TDE4LjcwNzYgMTIuNTgzNUMxOC42MzAxIDEyLjY2MDkgMTguNTA0NSAxMi42NjA5IDE4LjQyNzEgMTIuNTgzNUwxNy45MTM5IDEyLjA3MDNDMTUuNzUyMyA5LjkwODcgMTIuMjQ3NyA5LjkwODcgMTAuMDg2MSAxMi4wNzAzTDkuNTM2NTUgMTIuNjE5OEM5LjQ1OTA5IDEyLjY5NzMgOS4zMzM1IDEyLjY5NzMgOS4yNTYwNCAxMi42MTk4TDcuOTgwMzkgMTEuMzQ0MkM3LjgyNTQ3IDExLjE4OTMgNy44MjU0NyAxMC45MzgxIDcuOTgwMzkgMTAuNzgzMkw4LjM4OTY5IDEwLjM3MzlaTTIyLjI0ODUgMTMuMDEyTDIzLjM4MzggMTQuMTQ3NEMyMy41Mzg3IDE0LjMwMjMgMjMuNTM4NyAxNC41NTM1IDIzLjM4MzggMTQuNzA4NEwxOC4yNjQ1IDE5LjgyNzdDMTguMTA5NiAxOS45ODI3IDE3Ljg1ODQgMTkuOTgyNyAxNy43MDM1IDE5LjgyNzdDMTcuNzAzNSAxOS44Mjc3IDE3LjcwMzUgMTkuODI3NyAxNy43MDM1IDE5LjgyNzdMMTQuMDcwMiAxNi4xOTQ0QzE0LjAzMTQgMTYuMTU1NyAxMy45Njg2IDE2LjE1NTcgMTMuOTI5OSAxNi4xOTQ0QzEzLjkyOTkgMTYuMTk0NCAxMy45Mjk5IDE2LjE5NDQgMTMuOTI5OSAxNi4xOTQ0TDEwLjI5NjYgMTkuODI3N0MxMC4xNDE3IDE5Ljk4MjcgOS44OTA1MyAxOS45ODI3IDkuNzM1NjEgMTkuODI3OEM5LjczNTYgMTkuODI3OCA5LjczNTYgMTkuODI3NyA5LjczNTYgMTkuODI3N0w0LjYxNjE5IDE0LjcwODNDNC40NjEyNyAxNC41NTM0IDQuNDYxMjcgMTQuMzAyMiA0LjYxNjE5IDE0LjE0NzNMNS43NTE1MiAxMy4wMTJDNS45MDY0NSAxMi44NTcgNi4xNTc2MyAxMi44NTcgNi4zMTI1NSAxMy4wMTJMOS45NDU5NSAxNi42NDU0QzkuOTg0NjggMTYuNjg0MSAxMC4wNDc1IDE2LjY4NDEgMTAuMDg2MiAxNi42NDU0QzEwLjA4NjIgMTYuNjQ1NCAxMC4wODYyIDE2LjY0NTQgMTAuMDg2MiAxNi42NDU0TDEzLjcxOTQgMTMuMDEyQzEzLjg3NDMgMTIuODU3IDE0LjEyNTUgMTIuODU3IDE0LjI4MDUgMTMuMDEyQzE0LjI4MDUgMTMuMDEyIDE0LjI4MDUgMTMuMDEyIDE0LjI4MDUgMTMuMDEyTDE3LjkxMzkgMTYuNjQ1NEMxNy45NTI2IDE2LjY4NDEgMTguMDE1NCAxNi42ODQxIDE4LjA1NDEgMTYuNjQ1NEwyMS42ODc0IDEzLjAxMkMyMS44NDI0IDEyLjg1NzEgMjIuMDkzNiAxMi44NTcxIDIyLjI0ODUgMTMuMDEyWiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cg==";const xt=Object.freeze(Object.defineProperty({__proto__:null,default:Bt},Symbol.toStringTag,{value:"Module"}));var zt="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyOCIgaGVpZ2h0PSIyOCIgZmlsbD0ibm9uZSI+PGcgY2xpcC1wYXRoPSJ1cmwoI2EpIj48cGF0aCBmaWxsPSIjQUI5RkYyIiBkPSJNMjggMEgwdjI4aDI4VjBaIi8+PHBhdGggZmlsbD0iI0ZGRkRGOCIgZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMTIuMDYzIDE4LjEyOGMtMS4xNzMgMS43OTYtMy4xMzcgNC4wNy01Ljc1IDQuMDctMS4yMzYgMC0yLjQyNC0uNTEtMi40MjQtMi43MTkgMC01LjYyNyA3LjY4Mi0xNC4zMzcgMTQuODEtMTQuMzM3IDQuMDU2IDAgNS42NzEgMi44MTMgNS42NzEgNi4wMDggMCA0LjEwMS0yLjY2IDguNzktNS4zMDYgOC43OS0uODQgMC0xLjI1Mi0uNDYtMS4yNTItMS4xOTIgMC0uMTkuMDMyLS4zOTcuMDk1LS42Mi0uOTAyIDEuNTQyLTIuNjQ1IDIuOTczLTQuMjc2IDIuOTczLTEuMTg4IDAtMS43OS0uNzQ3LTEuNzktMS43OTcgMC0uMzgxLjA3OS0uNzc4LjIyMi0xLjE3NlptOS42My03LjA4OWMwIC45MzEtLjU0OSAxLjM5Ny0xLjE2MyAxLjM5Ny0uNjI0IDAtMS4xNjQtLjQ2Ni0xLjE2NC0xLjM5NyAwLS45My41NC0xLjM5NiAxLjE2NC0xLjM5Ni42MTQgMCAxLjE2NC40NjUgMS4xNjQgMS4zOTZabS0zLjQ5IDBjMCAuOTMxLS41NSAxLjM5Ny0xLjE2NCAxLjM5Ny0uNjI0IDAtMS4xNjQtLjQ2Ni0xLjE2NC0xLjM5NyAwLS45My41NC0xLjM5NiAxLjE2NC0xLjM5Ni42MTQgMCAxLjE2NC40NjUgMS4xNjQgMS4zOTZaIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiLz48L2c+PGRlZnM+PGNsaXBQYXRoIGlkPSJhIj48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMCAwaDI4djI4SDB6Ii8+PC9jbGlwUGF0aD48L2RlZnM+PC9zdmc+";const yt=Object.freeze(Object.defineProperty({__proto__:null,default:zt},Symbol.toStringTag,{value:"Module"}));var mt="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSJ1cmwoI3BhaW50MF9saW5lYXJfNjJfMzI5KSIvPgo8cGF0aCBkPSJNMjAgMzhIMjZDNTYuOTI3OSAzOCA4MiA2My4wNzIxIDgyIDk0VjEwMEg5NEM5Ny4zMTM3IDEwMCAxMDAgOTcuMzEzNyAxMDAgOTRDMTAwIDUzLjEzMDkgNjYuODY5MSAyMCAyNiAyMEMyMi42ODYzIDIwIDIwIDIyLjY4NjMgMjAgMjZWMzhaIiBmaWxsPSJ1cmwoI3BhaW50MV9yYWRpYWxfNjJfMzI5KSIvPgo8cGF0aCBkPSJNODQgOTRIMTAwQzEwMCA5Ny4zMTM3IDk3LjMxMzcgMTAwIDk0IDEwMEg4NFY5NFoiIGZpbGw9InVybCgjcGFpbnQyX2xpbmVhcl82Ml8zMjkpIi8+CjxwYXRoIGQ9Ik0yNiAyMEwyNiAzNkgyMEwyMCAyNkMyMCAyMi42ODYzIDIyLjY4NjMgMjAgMjYgMjBaIiBmaWxsPSJ1cmwoI3BhaW50M19saW5lYXJfNjJfMzI5KSIvPgo8cGF0aCBkPSJNMjAgMzZIMjZDNTguMDMyNSAzNiA4NCA2MS45Njc1IDg0IDk0VjEwMEg2NlY5NEM2NiA3MS45MDg2IDQ4LjA5MTQgNTQgMjYgNTRIMjBWMzZaIiBmaWxsPSJ1cmwoI3BhaW50NF9yYWRpYWxfNjJfMzI5KSIvPgo8cGF0aCBkPSJNNjggOTRIODRWMTAwSDY4Vjk0WiIgZmlsbD0idXJsKCNwYWludDVfbGluZWFyXzYyXzMyOSkiLz4KPHBhdGggZD0iTTIwIDUyTDIwIDM2TDI2IDM2TDI2IDUySDIwWiIgZmlsbD0idXJsKCNwYWludDZfbGluZWFyXzYyXzMyOSkiLz4KPHBhdGggZD0iTTIwIDYyQzIwIDY1LjMxMzcgMjIuNjg2MyA2OCAyNiA2OEM0MC4zNTk0IDY4IDUyIDc5LjY0MDYgNTIgOTRDNTIgOTcuMzEzNyA1NC42ODYzIDEwMCA1OCAxMDBINjhWOTRDNjggNzAuODA0IDQ5LjE5NiA1MiAyNiA1MkgyMFY2MloiIGZpbGw9InVybCgjcGFpbnQ3X3JhZGlhbF82Ml8zMjkpIi8+CjxwYXRoIGQ9Ik01MiA5NEg2OFYxMDBINThDNTQuNjg2MyAxMDAgNTIgOTcuMzEzNyA1MiA5NFoiIGZpbGw9InVybCgjcGFpbnQ4X3JhZGlhbF82Ml8zMjkpIi8+CjxwYXRoIGQ9Ik0yNiA2OEMyMi42ODYzIDY4IDIwIDY1LjMxMzcgMjAgNjJMMjAgNTJMMjYgNTJMMjYgNjhaIiBmaWxsPSJ1cmwoI3BhaW50OV9yYWRpYWxfNjJfMzI5KSIvPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJwYWludDBfbGluZWFyXzYyXzMyOSIgeDE9IjYwIiB5MT0iMCIgeDI9IjYwIiB5Mj0iMTIwIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CjxzdG9wIHN0b3AtY29sb3I9IiMxNzQyOTkiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMDAxRTU5Ii8+CjwvbGluZWFyR3JhZGllbnQ+CjxyYWRpYWxHcmFkaWVudCBpZD0icGFpbnQxX3JhZGlhbF82Ml8zMjkiIGN4PSIwIiBjeT0iMCIgcj0iMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjYgOTQpIHJvdGF0ZSgtOTApIHNjYWxlKDc0KSI+CjxzdG9wIG9mZnNldD0iMC43NzAyNzciIHN0b3AtY29sb3I9IiNGRjQwMDAiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjODc1NEM5Ii8+CjwvcmFkaWFsR3JhZGllbnQ+CjxsaW5lYXJHcmFkaWVudCBpZD0icGFpbnQyX2xpbmVhcl82Ml8zMjkiIHgxPSI4MyIgeTE9Ijk3IiB4Mj0iMTAwIiB5Mj0iOTciIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHN0b3Agc3RvcC1jb2xvcj0iI0ZGNDAwMCIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM4NzU0QzkiLz4KPC9saW5lYXJHcmFkaWVudD4KPGxpbmVhckdyYWRpZW50IGlkPSJwYWludDNfbGluZWFyXzYyXzMyOSIgeDE9IjIzIiB5MT0iMjAiIHgyPSIyMyIgeTI9IjM3IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CjxzdG9wIHN0b3AtY29sb3I9IiM4NzU0QzkiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjRkY0MDAwIi8+CjwvbGluZWFyR3JhZGllbnQ+CjxyYWRpYWxHcmFkaWVudCBpZD0icGFpbnQ0X3JhZGlhbF82Ml8zMjkiIGN4PSIwIiBjeT0iMCIgcj0iMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjYgOTQpIHJvdGF0ZSgtOTApIHNjYWxlKDU4KSI+CjxzdG9wIG9mZnNldD0iMC43MjM5MjkiIHN0b3AtY29sb3I9IiNGRkY3MDAiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjRkY5OTAxIi8+CjwvcmFkaWFsR3JhZGllbnQ+CjxsaW5lYXJHcmFkaWVudCBpZD0icGFpbnQ1X2xpbmVhcl82Ml8zMjkiIHgxPSI2OCIgeTE9Ijk3IiB4Mj0iODQiIHkyPSI5NyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBzdG9wLWNvbG9yPSIjRkZGNzAwIi8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0ZGOTkwMSIvPgo8L2xpbmVhckdyYWRpZW50Pgo8bGluZWFyR3JhZGllbnQgaWQ9InBhaW50Nl9saW5lYXJfNjJfMzI5IiB4MT0iMjMiIHkxPSI1MiIgeDI9IjIzIiB5Mj0iMzYiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHN0b3Agc3RvcC1jb2xvcj0iI0ZGRjcwMCIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNGRjk5MDEiLz4KPC9saW5lYXJHcmFkaWVudD4KPHJhZGlhbEdyYWRpZW50IGlkPSJwYWludDdfcmFkaWFsXzYyXzMyOSIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgyNiA5NCkgcm90YXRlKC05MCkgc2NhbGUoNDIpIj4KPHN0b3Agb2Zmc2V0PSIwLjU5NTEzIiBzdG9wLWNvbG9yPSIjMDBBQUZGIi8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzAxREE0MCIvPgo8L3JhZGlhbEdyYWRpZW50Pgo8cmFkaWFsR3JhZGllbnQgaWQ9InBhaW50OF9yYWRpYWxfNjJfMzI5IiBjeD0iMCIgY3k9IjAiIHI9IjEiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKDUxIDk3KSBzY2FsZSgxNyA0NS4zMzMzKSI+CjxzdG9wIHN0b3AtY29sb3I9IiMwMEFBRkYiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMDFEQTQwIi8+CjwvcmFkaWFsR3JhZGllbnQ+CjxyYWRpYWxHcmFkaWVudCBpZD0icGFpbnQ5X3JhZGlhbF82Ml8zMjkiIGN4PSIwIiBjeT0iMCIgcj0iMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjMgNjkpIHJvdGF0ZSgtOTApIHNjYWxlKDE3IDMyMi4zNykiPgo8c3RvcCBzdG9wLWNvbG9yPSIjMDBBQUZGIi8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzAxREE0MCIvPgo8L3JhZGlhbEdyYWRpZW50Pgo8L2RlZnM+Cjwvc3ZnPgo=";const Tt=Object.freeze(Object.defineProperty({__proto__:null,default:mt},Symbol.toStringTag,{value:"Module"}));var St="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjgiIGhlaWdodD0iMjgiIHZpZXdCb3g9IjAgMCAyOCAyOCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI4IiBoZWlnaHQ9IjI4IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMjQuMDg5MSAzLjExOTlMMTUuMzQ0NiA5LjYxNDU2TDE2Ljk2MTcgNS43ODI4TDI0LjA4OTEgMy4xMTk5WiIgZmlsbD0iI0UyNzYxQiIgc3Ryb2tlPSIjRTI3NjFCIiBzdHJva2Utd2lkdGg9IjAuMDg3ODg0NSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxwYXRoIGQ9Ik0zLjkwMjA3IDMuMTE5OUwxMi41NzYzIDkuNjc2MDhMMTEuMDM4MyA1Ljc4MjhMMy45MDIwNyAzLjExOTlaIiBmaWxsPSIjRTQ3NjFCIiBzdHJva2U9IiNFNDc2MUIiIHN0cm9rZS13aWR0aD0iMC4wODc4ODQ1IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHBhdGggZD0iTTIwLjk0MjkgMTguMTc0NUwxOC42MTM5IDIxLjc0MjZMMjMuNTk3IDIzLjExMzZMMjUuMDI5NSAxOC4yNTM2TDIwLjk0MjkgMTguMTc0NVoiIGZpbGw9IiNFNDc2MUIiIHN0cm9rZT0iI0U0NzYxQiIgc3Ryb2tlLXdpZHRoPSIwLjA4Nzg4NDUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8cGF0aCBkPSJNMi45NzkyOSAxOC4yNTM2TDQuNDAzMDEgMjMuMTEzNkw5LjM4NjA3IDIxLjc0MjZMNy4wNTcxMyAxOC4xNzQ1TDIuOTc5MjkgMTguMjUzNloiIGZpbGw9IiNFNDc2MUIiIHN0cm9rZT0iI0U0NzYxQiIgc3Ryb2tlLXdpZHRoPSIwLjA4Nzg4NDUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8cGF0aCBkPSJNOS4xMDQ4MyAxMi4xNDU2TDcuNzE2MjYgMTQuMjQ2MUwxMi42NjQyIDE0LjQ2NThMMTIuNDg4NCA5LjE0ODc3TDkuMTA0ODMgMTIuMTQ1NloiIGZpbGw9IiNFNDc2MUIiIHN0cm9rZT0iI0U0NzYxQiIgc3Ryb2tlLXdpZHRoPSIwLjA4Nzg4NDUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8cGF0aCBkPSJNMTguODg2NCAxMi4xNDU2TDE1LjQ1ODkgOS4wODcyNUwxNS4zNDQ2IDE0LjQ2NThMMjAuMjgzNyAxNC4yNDYxTDE4Ljg4NjQgMTIuMTQ1NloiIGZpbGw9IiNFNDc2MUIiIHN0cm9rZT0iI0U0NzYxQiIgc3Ryb2tlLXdpZHRoPSIwLjA4Nzg4NDUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8cGF0aCBkPSJNOS4zODYwNiAyMS43NDI2TDEyLjM1NjYgMjAuMjkyNUw5Ljc5MDMzIDE4LjI4ODhMOS4zODYwNiAyMS43NDI2WiIgZmlsbD0iI0U0NzYxQiIgc3Ryb2tlPSIjRTQ3NjFCIiBzdHJva2Utd2lkdGg9IjAuMDg3ODg0NSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxwYXRoIGQ9Ik0xNS42MzQ3IDIwLjI5MjVMMTguNjEzOSAyMS43NDI2TDE4LjIwMDkgMTguMjg4OEwxNS42MzQ3IDIwLjI5MjVaIiBmaWxsPSIjRTQ3NjFCIiBzdHJva2U9IiNFNDc2MUIiIHN0cm9rZS13aWR0aD0iMC4wODc4ODQ1IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHBhdGggZD0iTTE4LjYxMzkgMjEuNzQyNkwxNS42MzQ3IDIwLjI5MjVMMTUuODcxOSAyMi4yMzQ4TDE1Ljg0NTYgMjMuMDUyMUwxOC42MTM5IDIxLjc0MjZaIiBmaWxsPSIjRDdDMUIzIiBzdHJva2U9IiNEN0MxQjMiIHN0cm9rZS13aWR0aD0iMC4wODc4ODQ1IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHBhdGggZD0iTTkuMzg2MDYgMjEuNzQyNkwxMi4xNTQ0IDIzLjA1MjFMMTIuMTM2OCAyMi4yMzQ4TDEyLjM1NjYgMjAuMjkyNUw5LjM4NjA2IDIxLjc0MjZaIiBmaWxsPSIjRDdDMUIzIiBzdHJva2U9IiNEN0MxQjMiIHN0cm9rZS13aWR0aD0iMC4wODc4ODQ1IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHBhdGggZD0iTTEyLjE5ODQgMTcuMDA1Nkw5LjcyMDAyIDE2LjI3NjJMMTEuNDY4OSAxNS40NzY1TDEyLjE5ODQgMTcuMDA1NloiIGZpbGw9IiMyMzM0NDciIHN0cm9rZT0iIzIzMzQ0NyIgc3Ryb2tlLXdpZHRoPSIwLjA4Nzg4NDUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8cGF0aCBkPSJNMTUuNzkyOCAxNy4wMDU2TDE2LjUyMjMgMTUuNDc2NUwxOC4yOCAxNi4yNzYyTDE1Ljc5MjggMTcuMDA1NloiIGZpbGw9IiMyMzM0NDciIHN0cm9rZT0iIzIzMzQ0NyIgc3Ryb2tlLXdpZHRoPSIwLjA4Nzg4NDUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8cGF0aCBkPSJNOS4zODYwNiAyMS43NDI2TDkuODA3OTEgMTguMTc0NUw3LjA1NzEyIDE4LjI1MzZMOS4zODYwNiAyMS43NDI2WiIgZmlsbD0iI0NENjExNiIgc3Ryb2tlPSIjQ0Q2MTE2IiBzdHJva2Utd2lkdGg9IjAuMDg3ODg0NSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxwYXRoIGQ9Ik0xOC4xOTIxIDE4LjE3NDVMMTguNjEzOSAyMS43NDI2TDIwLjk0MjkgMTguMjUzNkwxOC4xOTIxIDE4LjE3NDVaIiBmaWxsPSIjQ0Q2MTE2IiBzdHJva2U9IiNDRDYxMTYiIHN0cm9rZS13aWR0aD0iMC4wODc4ODQ1IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHBhdGggZD0iTTIwLjI4MzcgMTQuMjQ2MUwxNS4zNDQ2IDE0LjQ2NThMMTUuODAxNiAxNy4wMDU3TDE2LjUzMTEgMTUuNDc2NUwxOC4yODg4IDE2LjI3NjJMMjAuMjgzNyAxNC4yNDYxWiIgZmlsbD0iI0NENjExNiIgc3Ryb2tlPSIjQ0Q2MTE2IiBzdHJva2Utd2lkdGg9IjAuMDg3ODg0NSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxwYXRoIGQ9Ik05LjcyMDAyIDE2LjI3NjJMMTEuNDc3NyAxNS40NzY1TDEyLjE5ODQgMTcuMDA1N0wxMi42NjQyIDE0LjQ2NThMNy43MTYyNiAxNC4yNDYxTDkuNzIwMDIgMTYuMjc2MloiIGZpbGw9IiNDRDYxMTYiIHN0cm9rZT0iI0NENjExNiIgc3Ryb2tlLXdpZHRoPSIwLjA4Nzg4NDUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8cGF0aCBkPSJNNy43MTYyNiAxNC4yNDYxTDkuNzkwMzMgMTguMjg4OEw5LjcyMDAyIDE2LjI3NjJMNy43MTYyNiAxNC4yNDYxWiIgZmlsbD0iI0U0NzUxRiIgc3Ryb2tlPSIjRTQ3NTFGIiBzdHJva2Utd2lkdGg9IjAuMDg3ODg0NSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxwYXRoIGQ9Ik0xOC4yODg4IDE2LjI3NjJMMTguMjAwOSAxOC4yODg4TDIwLjI4MzcgMTQuMjQ2MUwxOC4yODg4IDE2LjI3NjJaIiBmaWxsPSIjRTQ3NTFGIiBzdHJva2U9IiNFNDc1MUYiIHN0cm9rZS13aWR0aD0iMC4wODc4ODQ1IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHBhdGggZD0iTTEyLjY2NDIgMTQuNDY1OEwxMi4xOTg0IDE3LjAwNTdMMTIuNzc4NCAyMC4wMDI1TDEyLjkxMDIgMTYuMDU2NUwxMi42NjQyIDE0LjQ2NThaIiBmaWxsPSIjRTQ3NTFGIiBzdHJva2U9IiNFNDc1MUYiIHN0cm9rZS13aWR0aD0iMC4wODc4ODQ1IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHBhdGggZD0iTTE1LjM0NDYgMTQuNDY1OEwxNS4xMDczIDE2LjA0NzdMMTUuMjEyOCAyMC4wMDI1TDE1LjgwMTYgMTcuMDA1N0wxNS4zNDQ2IDE0LjQ2NThaIiBmaWxsPSIjRTQ3NTFGIiBzdHJva2U9IiNFNDc1MUYiIHN0cm9rZS13aWR0aD0iMC4wODc4ODQ1IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHBhdGggZD0iTTE1LjgwMTYgMTcuMDA1NkwxNS4yMTI4IDIwLjAwMjVMMTUuNjM0NyAyMC4yOTI1TDE4LjIwMDkgMTguMjg4OEwxOC4yODg4IDE2LjI3NjJMMTUuODAxNiAxNy4wMDU2WiIgZmlsbD0iI0Y2ODUxQiIgc3Ryb2tlPSIjRjY4NTFCIiBzdHJva2Utd2lkdGg9IjAuMDg3ODg0NSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxwYXRoIGQ9Ik05LjcyMDAyIDE2LjI3NjJMOS43OTAzMyAxOC4yODg4TDEyLjM1NjYgMjAuMjkyNUwxMi43Nzg0IDIwLjAwMjVMMTIuMTk4NCAxNy4wMDU2TDkuNzIwMDIgMTYuMjc2MloiIGZpbGw9IiNGNjg1MUIiIHN0cm9rZT0iI0Y2ODUxQiIgc3Ryb2tlLXdpZHRoPSIwLjA4Nzg4NDUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8cGF0aCBkPSJNMTUuODQ1NiAyMy4wNTIxTDE1Ljg3MTkgMjIuMjM0OEwxNS42NTIyIDIyLjA0MTRIMTIuMzM5TDEyLjEzNjggMjIuMjM0OEwxMi4xNTQ0IDIzLjA1MjFMOS4zODYwNiAyMS43NDI2TDEwLjM1MjggMjIuNTMzNkwxMi4zMTI2IDIzLjg5NThIMTUuNjc4NkwxNy42NDcyIDIyLjUzMzZMMTguNjEzOSAyMS43NDI2TDE1Ljg0NTYgMjMuMDUyMVoiIGZpbGw9IiNDMEFEOUUiIHN0cm9rZT0iI0MwQUQ5RSIgc3Ryb2tlLXdpZHRoPSIwLjA4Nzg4NDUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8cGF0aCBkPSJNMTUuNjM0NyAyMC4yOTI1TDE1LjIxMjggMjAuMDAyNUgxMi43Nzg0TDEyLjM1NjYgMjAuMjkyNUwxMi4xMzY4IDIyLjIzNDhMMTIuMzM5IDIyLjA0MTRIMTUuNjUyMkwxNS44NzE5IDIyLjIzNDhMMTUuNjM0NyAyMC4yOTI1WiIgZmlsbD0iIzE2MTYxNiIgc3Ryb2tlPSIjMTYxNjE2IiBzdHJva2Utd2lkdGg9IjAuMDg3ODg0NSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxwYXRoIGQ9Ik0yNC40NTgzIDEwLjAzNjRMMjUuMjA1MyA2LjQ1MDcyTDI0LjA4OTEgMy4xMTk5TDE1LjYzNDcgOS4zOTQ4NUwxOC44ODY0IDEyLjE0NTZMMjMuNDgyNyAxMy40OTAzTDI0LjUwMjIgMTIuMzAzOEwyNC4wNjI4IDExLjk4NzRMMjQuNzY1OCAxMS4zNDU5TDI0LjIyMSAxMC45MjRMMjQuOTI0IDEwLjM4NzlMMjQuNDU4MyAxMC4wMzY0WiIgZmlsbD0iIzc2M0QxNiIgc3Ryb2tlPSIjNzYzRDE2IiBzdHJva2Utd2lkdGg9IjAuMDg3ODg0NSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxwYXRoIGQ9Ik0yLjc5NDcyIDYuNDUwNzJMMy41NDE3NCAxMC4wMzY0TDMuMDY3MTcgMTAuMzg3OUwzLjc3MDI0IDEwLjkyNEwzLjIzNDE1IDExLjM0NTlMMy45MzcyMiAxMS45ODc0TDMuNDk3OCAxMi4zMDM4TDQuNTA4NDcgMTMuNDkwM0w5LjEwNDgzIDEyLjE0NTZMMTIuMzU2NiA5LjM5NDg1TDMuOTAyMDcgMy4xMTk5TDIuNzk0NzIgNi40NTA3MloiIGZpbGw9IiM3NjNEMTYiIHN0cm9rZT0iIzc2M0QxNiIgc3Ryb2tlLXdpZHRoPSIwLjA4Nzg4NDUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8cGF0aCBkPSJNMjMuNDgyNyAxMy40OTAzTDE4Ljg4NjQgMTIuMTQ1NkwyMC4yODM3IDE0LjI0NjFMMTguMjAwOSAxOC4yODg4TDIwLjk0MjkgMTguMjUzNkgyNS4wMjk1TDIzLjQ4MjcgMTMuNDkwM1oiIGZpbGw9IiNGNjg1MUIiIHN0cm9rZT0iI0Y2ODUxQiIgc3Ryb2tlLXdpZHRoPSIwLjA4Nzg4NDUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8cGF0aCBkPSJNOS4xMDQ4NCAxMi4xNDU2TDQuNTA4NDggMTMuNDkwM0wyLjk3OTI5IDE4LjI1MzZINy4wNTcxM0w5Ljc5MDMzIDE4LjI4ODhMNy43MTYyNiAxNC4yNDYxTDkuMTA0ODQgMTIuMTQ1NloiIGZpbGw9IiNGNjg1MUIiIHN0cm9rZT0iI0Y2ODUxQiIgc3Ryb2tlLXdpZHRoPSIwLjA4Nzg4NDUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8cGF0aCBkPSJNMTUuMzQ0NiAxNC40NjU4TDE1LjYzNDcgOS4zOTQ4NUwxNi45NzA1IDUuNzgyOEgxMS4wMzgzTDEyLjM1NjYgOS4zOTQ4NUwxMi42NjQyIDE0LjQ2NThMMTIuNzY5NiAxNi4wNjUzTDEyLjc3ODQgMjAuMDAyNUgxNS4yMTI4TDE1LjIzMDQgMTYuMDY1M0wxNS4zNDQ2IDE0LjQ2NThaIiBmaWxsPSIjRjY4NTFCIiBzdHJva2U9IiNGNjg1MUIiIHN0cm9rZS13aWR0aD0iMC4wODc4ODQ1IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+Cg==";const kt=Object.freeze(Object.defineProperty({__proto__:null,default:St},Symbol.toStringTag,{value:"Module"}));var wt="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyOCAyOCI+PHBhdGggZmlsbD0iIzAwMCIgZD0iTTAgMGgyOHYyOEgweiIvPjxwYXRoIGZpbGw9IiNmZmYiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTEwLjgxOSA1LjU1Nkg1LjkzYS4zNzYuMzc2IDAgMCAwLS4zNzUuMzc1djQuODg4YzAgLjIwNy4xNjguMzc1LjM3NS4zNzVoNC44ODhhLjM3Ni4zNzYgMCAwIDAgLjM3NS0uMzc2VjUuOTMyYS4zNzYuMzc2IDAgMCAwLS4zNzYtLjM3NVptNS42NCA1LjYzOGgtNC44ODZhLjM3Ni4zNzYgMCAwIDAtLjM3Ni4zNzZ2NC44ODdjMCAuMjA4LjE2OC4zNzYuMzc2LjM3Nmg0Ljg4N2EuMzc2LjM3NiAwIDAgMCAuMzc2LS4zNzVWMTEuNTdhLjM3Ni4zNzYgMCAwIDAtLjM3Ni0uMzc3Wm0uNzUtNS42MzhoNC44ODdjLjIwOCAwIC4zNzYuMTY4LjM3Ni4zNzV2NC44ODhhLjM3Ni4zNzYgMCAwIDEtLjM3Ni4zNzVIMTcuMjFhLjM3Ni4zNzYgMCAwIDEtLjM3Ni0uMzc2VjUuOTMzYzAtLjIwOC4xNjktLjM3Ni4zNzYtLjM3NlptLTYuMzkgMTEuMjc3SDUuOTNhLjM3Ni4zNzYgMCAwIDAtLjM3NS4zNzZ2NC44ODdjMCAuMjA4LjE2OC4zNzYuMzc1LjM3Nmg0Ljg4OGEuMzc2LjM3NiAwIDAgMCAuMzc1LS4zNzZWMTcuMjFhLjM3Ni4zNzYgMCAwIDAtLjM3Ni0uMzc2Wm02LjM5IDBoNC44ODdjLjIwOCAwIC4zNzYuMTY5LjM3Ni4zNzZ2NC44ODdhLjM3Ni4zNzYgMCAwIDEtLjM3Ni4zNzZIMTcuMjFhLjM3Ni4zNzYgMCAwIDEtLjM3Ni0uMzc2VjE3LjIxYzAtLjIwNy4xNjktLjM3Ni4zNzYtLjM3NloiIGNsaXAtcnVsZT0iZXZlbm9kZCIvPjwvc3ZnPg==";const bt=Object.freeze(Object.defineProperty({__proto__:null,default:wt},Symbol.toStringTag,{value:"Module"}));var Ut="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjgiIGhlaWdodD0iMjgiIHZpZXdCb3g9IjAgMCAyOCAyOCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI4IiBoZWlnaHQ9IjI4IiBmaWxsPSIjMkM1RkY2Ii8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTQgMjMuOEMxOS40MTI0IDIzLjggMjMuOCAxOS40MTI0IDIzLjggMTRDMjMuOCA4LjU4NzYxIDE5LjQxMjQgNC4yIDE0IDQuMkM4LjU4NzYxIDQuMiA0LjIgOC41ODc2MSA0LjIgMTRDNC4yIDE5LjQxMjQgOC41ODc2MSAyMy44IDE0IDIzLjhaTTExLjU1IDEwLjhDMTEuMTM1OCAxMC44IDEwLjggMTEuMTM1OCAxMC44IDExLjU1VjE2LjQ1QzEwLjggMTYuODY0MiAxMS4xMzU4IDE3LjIgMTEuNTUgMTcuMkgxNi40NUMxNi44NjQyIDE3LjIgMTcuMiAxNi44NjQyIDE3LjIgMTYuNDVWMTEuNTVDMTcuMiAxMS4xMzU4IDE2Ljg2NDIgMTAuOCAxNi40NSAxMC44SDExLjU1WiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cg==";const Zt=Object.freeze(Object.defineProperty({__proto__:null,default:Ut},Symbol.toStringTag,{value:"Module"}));export{Z4 as C,Gt as R,x as _,Kt as a,ft as c,l3 as d,W0 as l,_t as m,qt as o,Ht as p,Xt as r,Pt as s,YE as u,Jt as w};
//# sourceMappingURL=rainbow-utils-BNXFv0tM.js.map

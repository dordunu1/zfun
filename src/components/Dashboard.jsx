import React from 'react';

export default function Dashboard() {
  return (
    <main className="mt-16 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Dashboard
        </h1>
        
        {/* We can add deployment cards and other dashboard content here later */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Content will go here */}
        </div>
      </div>
    </main>
  );
} 
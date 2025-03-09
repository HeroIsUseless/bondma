'use client'
import React from "react";

export const LoadingView: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mb-4"></div>
            <p className="text-lg font-medium text-gray-600">正在加载，请稍候...</p>
        </div>
    );
}

import React from 'react'
import { Loader2 } from 'lucide-react'

const Loading: React.FC = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
    </div>
  )
}

export default Loading

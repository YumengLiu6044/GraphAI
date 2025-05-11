import { useState } from "react"
import Sidebar from "../components/Sidebar"

export default function Workspace() {
  const [showSidebar, setShowSidebar] = useState(false)

  return (
    <div className="min-h-screen flex">
      <Sidebar showSidebar={showSidebar}></Sidebar>
    </div>
  )
}

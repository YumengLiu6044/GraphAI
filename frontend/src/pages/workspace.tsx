import Sidebar from "../components/Sidebar"
import Canvas from "../components/Canvas"

export default function Workspace() {
  return (
    <div className="min-h-screen flex">
      <Sidebar></Sidebar>
      <Canvas></Canvas>
    </div>
  )
}

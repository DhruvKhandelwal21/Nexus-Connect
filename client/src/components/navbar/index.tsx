import { logo } from "@/assets"
const Navbar = () => {
  return (
    <nav className='w-full flex items-center py-2 px-2 fixed top-0 bg-primary'>
     <img className='object-contain w-[35px] h-[35px]' src={logo} />
     <p className="text-white ml-2 font-semibold text-xl">Nexus Connect</p>
    </nav>
  )
}

export default Navbar
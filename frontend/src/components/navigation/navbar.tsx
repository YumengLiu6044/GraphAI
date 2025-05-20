import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/website-logo.svg";


const paths = [
	{
		pathname: "/",
		desc: "Home",
	},
	{
		pathname: "/workspace",
		desc: "Workspace",
	},
  {
    pathname: "/pricing",
    desc: "Pricing"
  },
  {
    pathname: "/documentation",
    desc: "Documentation"
  }
];

function Navbar() {
	const location = useLocation();

	return (
		<div className="flex flex-col md:flex-row lg:flex-row gap-5 min-h-16 w-full px-5 md:px-10 lg:px-20 items-center">
			<div className="flex items-center">
				<img className="w-10 h-10 aspect-square mr-3" src={logo}></img>
				<span className="text-xl font-bold text-black">GraphAI</span>
			</div>
			<div className="w-full flex flex-col lg:flex-row md:flex-row justify-baseline sm:ml-6 sm:flex sm:space-x-8">
				{paths.map((item, index) => (
					<Link
						key={index}
						to={item.pathname}
						className={
							"inline-flex items-center px-1 pt-1 font-medium text-sm"
						}
						style={{
							textDecoration: "none",
							color:
								location.pathname == item.pathname
									? "black"
									: "gray",
							textDecorationLine:
								location.pathname == item.pathname
									? "underline"
									: "none",
							textDecorationColor: "#8b5cf6",
							textDecorationThickness: 2,
							textUnderlineOffset: 5,
						}}
					>
						{item.desc}
					</Link>
				))}
			</div>
		</div>
	);
}

export default Navbar;
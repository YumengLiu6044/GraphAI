import logo from "../assets/website-logo.svg";

const sections = [
	{
		sectionTitle: "Company",
		subTitles: ["About", "Careers", "Blog"],
	},
	{
		sectionTitle: "Documentation",
		subTitles: ["Github", "API"],
	},
	{
		sectionTitle: "Support",
		subTitles: ["Help Center", "Privacy", "Terms", "Contact"],
	},
	{
		sectionTitle: "Connect",
		subTitles: ["Facebook", "Instagram", "Linkedin"],
	},
];

const socialIcons = [
	{
		iconName: "bi bi-github",
		link: "",
	},
	{
		iconName: "bi bi-linkedin",
		link: "",
	},
	{
		iconName: "bi bi-twitter-x",
		link: "",
	},
	{
		iconName: "bi bi-youtube",
		link: "",
	},
];

function Footer() {
	return (
		<div className="bg-indigo-100">
			<div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
				<div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 justify-between gap-15">
					<div className="flex flex-col gap-3">
						<div className="flex items-center gap-3">
							<img className="w-8" src={logo}></img>
							<span className="text-xl font-medium">GraphAI</span>
						</div>

						<span className="text-gray-500 text-sm">
							Build your model in minutes
						</span>

						<div className="flex gap-5">
							{socialIcons.map((item, index) => (
								<i
									className={`${item.iconName} text-gray-500 hover:text-purple-500 transition-all`}
									key={index}
								></i>
							))}
						</div>
					</div>
					{sections.map((item, index) => (
						<div className="flex flex-col gap-3" key={index}>
							<span className="text-lg font-medium">
								{item.sectionTitle}
							</span>
							{item.subTitles.map((subItem, subIndex) => (
								<span
									className="text-gray-500 hover:text-black"
									key={subIndex}
								>
									{subItem}
								</span>
							))}
						</div>
					))}
				</div>
				<div className="w-full mt-6 pt-8">
					<p className="text-base text-gray-500 text-center">
						© 2025 GraphAI. All rights reserved.
					</p>
				</div>
			</div>
		</div>
	);
}

export default Footer;

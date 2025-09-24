import React, { useEffect, useRef, useState } from "react";
import { initTransition, onClick } from "../utils/Transition";
import Button from "./inputs/Button";
import ShimmerText from "./ShimmerText";

type SocialProps = {
	name: string;
	site: string;
	// key is name of social media
	// value is link for social media
	// Example: {github: "...", linkedin: "..."}
	socials: { GitHub?: string; Twitter?: string };
};

function Socials(props: SocialProps) {
	const { name, site, socials } = props;
	const keys = Object.keys(socials);
	return (
		<div className="socials upper">
			<div className="faded">{name}</div>
			<a href={site}>{site}</a>
			<div className="media">
				{keys.map((key, i) => (
					<a key={key} href={socials[key]}>
						{`${key}${i < keys.length - 1 ? "," : ""}`}
					</a>
				))}
			</div>
		</div>
	);
}

function About() {
	const [isShown, setShown] = useState(false);
	const [transition, setTransition] = useState(null);
	const panelRef = useRef(null);

	useEffect(() => {
		setTransition(initTransition(panelRef.current, Math.PI, 1.25, true));
	}, [panelRef]);

	return (
		<>
			<div ref={panelRef} className="about-panel">
				<Button
					onClick={() => {
						setShown(!isShown);
						if (transition != null) {
							onClick(transition);
						}
					}}
					className="about b md upper"
				/>
				<section className="text-content">
					<ShimmerText className="upper lg b">About</ShimmerText>
					<div>
						Galaxy simulation using direct and Barnes-Hut algorithms.
						<br />
						Rust backend at <a href="https://github.com/Katsutoshii/barnes-hut-rs">Katsutoshii/barnes-hut-rs</a>
						.
						<br />
						Frontend at <a href="https://github.com/Katsutoshii/barnes-hut-frontend">Katsutoshii/barnes-hut-frontend</a>.
					</div>
					<div className="socials-container">
						<Socials
							name="Josiah Putman"
							site="https://katsutoshii.github.io"
							socials={{
								GitHub: "https://github.com/Katsutoshii",
							}}
						/>
						<div className="vert-divider" />
						<Socials
							name="Angela He"
							site="https://zephyo.github.io"
							socials={{
								GitHub: "https://github.com/zephyo",
								Twitter: "https://twitter.com/zephybite",
							}}
						/>
					</div>
				</section>
			</div>
		</>
	);
}

export default About;

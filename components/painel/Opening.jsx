"use client";
import { useEffect, useState } from "react";
import { PreviewSkeleton } from "./Skeleton";

// Sites do grupo. `ready`: gerenciado por este painel. `url`: site no ar, ainda sem edição pelo painel.
export const SITES = [
	{
		id: "grupoforte",
		nome: "Grupo Forte",
		logo: "/img/logo-branco.png",
		ready: true,
	},
	{
		id: "reboforte",
		nome: "Reboforte",
		img: "/img/marca-reboforte.jpg",
		ready: false,
		url: "https://violet-crane-553086.hostingersite.com/",
	},
	{
		id: "dacor",
		nome: "Dacor Tintas",
		img: "/img/marca-dacor.webp",
		ready: false,
	},
];

function Tile({ site }) {
	return (
		<span className={`op-tile-art ${site.logo ? "op-tile-art--logo" : ""}`}>
			<img src={site.logo || site.img} alt="" />
		</span>
	);
}

// Abertura do painel: vinheta curta da marca e, em seguida, a escolha do site.
export default function Opening({ user, onChoose }) {
	const [phase, setPhase] = useState("intro"); // intro | pick
	useEffect(() => {
		// A vinheta aparece uma vez por sessão do navegador e nunca com movimento reduzido.
		let seen = false;
		try {
			seen = sessionStorage.getItem("gf-intro") === "1";
			sessionStorage.setItem("gf-intro", "1");
		} catch {}
		if (seen || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			setPhase("pick");
			return;
		}
		const t = setTimeout(() => setPhase("pick"), 1900);
		return () => clearTimeout(t);
	}, []);

	if (phase === "intro") {
		return (
			<button
				type="button"
				className="op op-intro"
				onClick={() => setPhase("pick")}
				aria-label="Pular a abertura"
			>
				<span className="op-intro-mark">
					<img
						src="/img/logo-branco.png"
						alt="Grupo Forte"
						width="300"
						height="86"
					/>
					<i aria-hidden="true" />
				</span>
			</button>
		);
	}
	return (
		<main className="op op-pick">
			<img
				className="op-brand"
				src="/img/logo-branco.png"
				alt="Grupo Forte"
				width="150"
				height="43"
			/>
			<h1>Qual site você vai gerenciar?</h1>
			<p className="op-hello">
				Olá, {user.name.split(" ")[0]}. Escolha um para continuar.
			</p>
			<ul className="op-tiles">
				{SITES.map((s) => (
					<li key={s.id}>
						<button
							type="button"
							className="op-tile"
							onClick={() => onChoose(s.id)}
						>
							<Tile site={s} />
							<b>{s.nome}</b>
							{s.ready ? null : <small>{s.url ? "Site no ar" : "Em preparação"}</small>}
						</button>
					</li>
				))}
			</ul>
		</main>
	);
}

// Site escolhido que ainda não está ligado ao painel.
export function SiteSoon({ site, onBack }) {
	return (
		<main className="op op-pick op-soon">
			<Tile site={site} />
			<h1>{site.nome}</h1>
			<p className="op-hello">
				O site da {site.nome} ainda não está ligado a este painel. Assim que
				estiver, o gerenciamento dele aparece aqui.
			</p>
			<button type="button" className="p-btn p-btn--primary" onClick={onBack}>
				Escolher outro site
			</button>
		</main>
	);
}

// Site do grupo que já está no ar, mas ainda não é editado por este painel: mostra a prévia e o link.
export function SiteView({ site, onBack }) {
	const [device, setDevice] = useState("desktop");
	const [loaded, setLoaded] = useState(false);
	return (
		<div className="sv">
			<header className="sv-bar">
				<button type="button" className="ed-home" onClick={onBack}>
					← Trocar de site
				</button>
				<b>{site.nome}</b>
				<span className="sv-url">{site.url.replace(/^https?:\/\/|\/$/g, "")}</span>
				<span className="ed-grow" />
				<a className="ed-btn ed-btn--primary" href={site.url} target="_blank" rel="noopener">
					Abrir o site ↗
				</a>
			</header>
			<p className="sv-note">
				Este site já está no ar. A edição do conteúdo dele por este painel ainda não está disponível.
			</p>
			<main className="sv-stage">
				<div className="ed-devices" role="group" aria-label="Tamanho da prévia">
					{[
						["desktop", "Computador"],
						["mobile", "Celular"],
					].map(([id, label]) => (
						<button type="button" key={id} className={device === id ? "is-active" : ""} aria-pressed={device === id} onClick={() => setDevice(id)}>
							{label}
						</button>
					))}
				</div>
				<div className={`sv-frame sv-frame--${device}`}>
					<iframe title={`Site da ${site.nome}`} src={site.url} loading="lazy" onLoad={() => setLoaded(true)} />
					<div className={`ed-skel ${loaded ? "is-out" : ""}`}>
						<PreviewSkeleton />
					</div>
				</div>
			</main>
		</div>
	);
}

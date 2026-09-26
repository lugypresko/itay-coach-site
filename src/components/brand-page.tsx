import Link from 'next/link';
import type {ReactNode} from 'react';
import './brand-page.css';
export function BrandPage({page,faq=false,children}:{page:{heading:string;path:string;sections:{heading:string;body:string}[]};faq?:boolean;children?:ReactNode}){
 const structured=faq?{'@context':'https://schema.org','@type':'FAQPage',mainEntity:page.sections.map(s=>({'@type':'Question',name:s.heading,acceptedAnswer:{'@type':'Answer',text:s.body}}))}:null;
 return <main id="main-content" className="push-brand-page">{structured&&<script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(structured).replace(/</g,'\\u003c')}}/>}<p className="eyebrow">The Push</p><h1>{page.heading}</h1>{page.sections.map((s,i)=><section key={i}>{s.heading&&<h2>{s.heading}</h2>}<p>{s.body}</p></section>)}{children}<div className="content-actions"><Link className="primary-link" href="/player-trap">Bring one current situation</Link><Link className="secondary-link" href={page.path==='/entities/the-push'?'/the-push-methodology':'/entities/the-push'}>{page.path==='/entities/the-push'?'Explore the methodology':'Explore The Push engagement'}</Link></div>{page.path==='/entities/the-push'&&<p><Link href="/contact">Discuss support for a manager</Link></p>}<p><a href="https://www.linkedin.com/in/itayfoyerstein/">Connect with Itay on LinkedIn</a></p></main>;
}

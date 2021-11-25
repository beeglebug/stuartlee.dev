import Head from "next/head";
import { Github, Twitter } from "react-bootstrap-icons";

export default function Layout({ title, children }) {
  return (
    <div className="container mx-auto py-2 text-center">
      <Head>
        <title>stuartlee.dev - {title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header>
        <div className="flex flex-row justify-center space-x-3">
          <a
            href="https://twitter.com/beeglebug"
            className="flex flex-row items-center p-2"
            target="_blank"
          >
            <Twitter className="mr-2 text-black" />
            twitter
          </a>
          <a
            href="https://github.com/beeglebug"
            className="flex flex-row items-center p-2"
            target="_blank"
          >
            <Github className="mr-2 text-black" />
            github
          </a>
        </div>
      </header>
      <main>
        <h1 className="mb-4 mt-2">{title}</h1>
        {children}
      </main>
    </div>
  );
}

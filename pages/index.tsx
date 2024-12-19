import Head from 'next/head';
import { useState } from 'react';

export default function Home() {
  const [projects, setProjects] = useState([
    { title: 'Untitled Screenplay', status: 'In Progress', id: 1 },
    { title: 'Drama Project', status: 'Draft', id: 2 },
  ]);

  const addNewProject = () => {
    const newProject = {
      title: 'New Screenplay',
      status: 'Not Started',
      id: projects.length + 1,
    };
    setProjects([...projects, newProject]);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Head>
        <title>Screenwriting Hub</title>
        <meta name="description" content="A modern screenwriting platform." />
      </Head>
      
      <header className="bg-gray-800 p-4 shadow-md">
        <h1 className="text-2xl font-bold">Screenwriting Hub</h1>
      </header>
      
      <main className="p-6">
        <section className="mb-6">
          <h2 className="text-xl font-semibold">Projects</h2>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((project) => (
              <div key={project.id} className="bg-gray-700 p-4 rounded shadow-md">
                <h3 className="text-lg font-medium">{project.title}</h3>
                <p className="text-sm">Status: {project.status}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold">Quick Links</h2>
          <div className="mt-4 flex gap-4">
            <button
              onClick={addNewProject}
              className="bg-green-500 text-gray-900 px-4 py-2 rounded shadow-md hover:bg-green-400"
            >
              Start New Screenplay
            </button>
            <button className="bg-blue-500 text-gray-900 px-4 py-2 rounded shadow-md hover:bg-blue-400">
              Open Last Project
            </button>
          </div>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold">Editor</h2>
          <div className="mt-4 bg-gray-700 p-4 rounded shadow-md">
            <textarea
              className="w-full h-64 bg-gray-800 text-gray-100 p-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Write your screenplay here..."
            ></textarea>
          </div>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold">Research Library</h2>
          <div className="mt-4 bg-gray-700 p-4 rounded shadow-md">
            <p className="text-sm">Keep all your references, notes, and inspirations here.</p>
            <ul className="list-disc ml-5 mt-2">
              <li className="text-sm">Upload PDFs or articles</li>
              <li className="text-sm">Save web links</li>
              <li className="text-sm">Tag and organize your notes</li>
            </ul>
          </div>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold">Feedback and Analysis</h2>
          <div className="mt-4 bg-gray-700 p-4 rounded shadow-md">
            <p className="text-sm">Get feedback and analyze your screenplay with built-in tools.</p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Export Options</h2>
          <div className="mt-4 bg-gray-700 p-4 rounded shadow-md">
            <button className="bg-purple-500 text-gray-900 px-4 py-2 rounded shadow-md hover:bg-purple-400">
              Export as PDF
            </button>
            <button className="bg-yellow-500 text-gray-900 px-4 py-2 ml-4 rounded shadow-md hover:bg-yellow-400">
              Export as Final Draft
            </button>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 p-4 text-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} Screenwriting Hub</p>
      </footer>
    </div>
  );
}

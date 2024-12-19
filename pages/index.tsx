// pages/index.js
import Head from 'next/head';
import { useState } from 'react';

export default function Home() {
  const [lines, setLines] = useState([]);
  const [currentType, setCurrentType] = useState('Action');

  const addLine = () => {
    setLines([...lines, { type: currentType, text: '' }]);
  };

  const updateLine = (index, text) => {
    const updatedLines = [...lines];
    updatedLines[index].text = text;
    setLines(updatedLines);
  };

  const changeType = (index, type) => {
    const updatedLines = [...lines];
    updatedLines[index].type = type;
    setLines(updatedLines);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Head>
        <title>Screenwriting Tool</title>
        <meta name="description" content="A modern screenwriting platform." />
      </Head>

      <header className="bg-gray-800 p-4 shadow-md flex justify-between items-center">
        <h1 className="text-2xl font-bold">Screenwriting Tool</h1>
        <button className="bg-blue-500 text-gray-900 px-4 py-2 rounded hover:bg-blue-400">
          Export as PDF
        </button>
      </header>

      <main className="flex">
        <aside className="w-1/4 bg-gray-800 p-4">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="flex flex-col gap-2">
            {['Scene', 'Action', 'Character', 'Dialogue', 'Parentheses', 'Transition'].map((type) => (
              <button
                key={type}
                className={`px-4 py-2 rounded text-left ${
                  currentType === type ? 'bg-green-500 text-gray-900' : 'bg-gray-700 hover:bg-gray-600'
                }`}
                onClick={() => setCurrentType(type)}
              >
                {type}
              </button>
            ))}
            <button
              className="bg-green-500 text-gray-900 px-4 py-2 rounded mt-4 hover:bg-green-400"
              onClick={addLine}
            >
              Add Line
            </button>
          </div>
        </aside>

        <section className="w-3/4 bg-gray-700 p-4">
          <div className="bg-gray-800 p-4 rounded shadow-md">
            {lines.map((line, index) => (
              <div key={index} className="mb-2">
                <select
                  className="bg-gray-900 text-gray-100 px-2 py-1 rounded"
                  value={line.type}
                  onChange={(e) => changeType(index, e.target.value)}
                >
                  {['Scene', 'Action', 'Character', 'Dialogue', 'Parentheses', 'Transition'].map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                <input
                  className="ml-2 bg-gray-900 text-gray-100 px-4 py-2 rounded w-3/4"
                  value={line.text}
                  onChange={(e) => updateLine(index, e.target.value)}
                  placeholder={`Enter ${line.type.toLowerCase()}...`}
                />
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 p-4 text-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} Screenwriting Tool</p>
      </footer>
    </div>
  );
}

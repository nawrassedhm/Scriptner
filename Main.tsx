import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import {
  Save,
  FileUp,
  Download,
  FileText,
  Activity,
  Layout,
  Type,
  MessageSquare,
  Settings,
  Upload,
  MinusSquare,
} from 'lucide-react';

const SceneElement = {
  SCENE_HEADING: 'scene_heading',
  ACTION: 'action',
  CHARACTER: 'character',
  DIALOGUE: 'dialogue',
  PARENTHETICAL: 'parenthetical',
  TRANSITION: 'transition',
  NOTE: 'note'
};

const getElementStyle = (type) => {
  const baseStyle = 'w-full p-2 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[40px] transition-colors duration-200';
  
  switch (type) {
    case SceneElement.SCENE_HEADING:
      return `${baseStyle} text-left pl-16`;
    case SceneElement.ACTION:
      return `${baseStyle} text-left pl-16`;
    case SceneElement.CHARACTER:
      return `${baseStyle} text-center w-1/2 mx-auto`;
    case SceneElement.DIALOGUE:
      return `${baseStyle} text-left w-1/2 mx-auto`;
    case SceneElement.PARENTHETICAL:
      return `${baseStyle} text-left w-1/3 mx-auto`;
    case SceneElement.TRANSITION:
      return `${baseStyle} text-right pr-16`;
    case SceneElement.NOTE:
      return `${baseStyle} text-left pl-16 italic text-gray-500`;
    default:
      return baseStyle;
  }
};

const ScreenplayEditor = () => {
  const [scenes, setScenes] = useState([]);
  const [currentType, setCurrentType] = useState(SceneElement.SCENE_HEADING);
  const [characters, setCharacters] = useState(new Set());
  const [suggestions, setSuggestions] = useState([]);
  const [statistics, setStatistics] = useState({
    pageCount: 1,
    sceneCount: 1,
    wordCount: 0,
    characterCount: 0,
    dialogueCount: 0
  });
  const [showStats, setShowStats] = useState(false);
  const [activeTab, setActiveTab] = useState('write');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize with title page
  useEffect(() => {
    if (scenes.length === 0) {
      setScenes([{
        id: 1,
        type: SceneElement.ACTION,
        content: 'Title: \nAuthor: \nContact: ',
        isTitlePage: true
      }]);
    }
  }, []);

  // Update statistics whenever scenes change
  useEffect(() => {
    updateStatistics();
  }, [scenes]);

  const updateStatistics = () => {
    const stats = {
      pageCount: 1,
      sceneCount: 0,
      wordCount: 0,
      characterCount: 0,
      dialogueCount: 0
    };

    scenes.forEach(scene => {
      // Count words
      stats.wordCount += scene.content.trim().split(/\s+/).length;

      // Count scenes
      if (scene.type === SceneElement.SCENE_HEADING) {
        stats.sceneCount++;
      }

      // Count dialogue lines
      if (scene.type === SceneElement.DIALOGUE) {
        stats.dialogueCount++;
      }

      // Track unique characters
      if (scene.type === SceneElement.CHARACTER) {
        characters.add(scene.content.trim().toUpperCase());
      }
    });

    // Update character count
    stats.characterCount = characters.size;

    // Estimate page count (roughly 55 lines per page)
    stats.pageCount = Math.max(1, Math.ceil(scenes.length / 55));

    setStatistics(stats);
  };

  const addElement = () => {
    const newElement = {
      id: Date.now(),
      type: currentType,
      content: '',
      sceneNumber: currentType === SceneElement.SCENE_HEADING ? statistics.sceneCount + 1 : null
    };
    setScenes([...scenes, newElement]);
  };

  const removeElement = (id) => {
    setScenes(scenes.filter(scene => scene.id !== id));
  };

  const updateContent = (id, content) => {
    setScenes(scenes.map(scene => {
      if (scene.id === id) {
        // Update character suggestions if needed
        if (scene.type === SceneElement.CHARACTER) {
          const matchingSuggestions = Array.from(characters)
            .filter(char => 
              char.startsWith(content.toUpperCase()) && 
              char !== content.toUpperCase()
            );
          setSuggestions(matchingSuggestions);
        }
        return { ...scene, content };
      }
      return scene;
    }));
  };

  const importScript = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target.result;
        const newScenes = parseContent(content, file.name);
        setScenes(newScenes);
      } catch (error) {
        console.error('Error importing script:', error);
        alert('Error importing script. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  const parseContent = (content, filename) => {
    // Basic parsing for all formats
    const lines = content.split('\n');
    const newScenes = [];
    let currentId = 1;

    lines.forEach(line => {
      if (!line.trim()) return;

      let type = SceneElement.ACTION;
      let processedLine = line.trim();

      // Detect element type based on content
      if (line.match(/^(INT|EXT|INT\/EXT|I\/E)/i)) {
        type = SceneElement.SCENE_HEADING;
      } else if (line.match(/^[A-Z\s]+$/)) {
        type = SceneElement.CHARACTER;
      } else if (line.match(/^\(.*\)$/)) {
        type = SceneElement.PARENTHETICAL;
      } else if (line.match(/^[A-Z\s]+TO:$/)) {
        type = SceneElement.TRANSITION;
      }

      newScenes.push({
        id: currentId++,
        type,
        content: processedLine
      });
    });

    return newScenes;
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
      {/* Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 bg-blue-600 text-white p-2 flex items-center justify-between z-50">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setActiveTab('write')} 
            className={`p-2 rounded ${activeTab === 'write' ? 'bg-blue-700' : ''}`}
          >
            <Type className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setActiveTab('outline')} 
            className={`p-2 rounded ${activeTab === 'outline' ? 'bg-blue-700' : ''}`}
          >
            <Layout className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setActiveTab('notes')} 
            className={`p-2 rounded ${activeTab === 'notes' ? 'bg-blue-700' : ''}`}
          >
            <MessageSquare className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button onClick={addElement} className="p-2 hover:bg-blue-700 rounded">
            <FileText className="w-5 h-5" />
          </button>
          <button onClick={() => setShowStats(!showStats)} className="p-2 hover:bg-blue-700 rounded">
            <Activity className="w-5 h-5" />
          </button>
          <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 hover:bg-blue-700 rounded">
            <Settings className="w-5 h-5" />
          </button>
          <label className="p-2 hover:bg-blue-700 rounded cursor-pointer">
            <Upload className="w-5 h-5" />
            <input
              type="file"
              onChange={importScript}
              accept=".fountain,.fdx,.txt"
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-16 px-4">
        <Card className={`max-w-4xl mx-auto p-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          {activeTab === 'write' && (
            <div className="space-y-2">
              <div className="mb-4">
                <select 
                  value={currentType}
                  onChange={(e) => setCurrentType(e.target.value)}
                  className={`p-2 rounded border ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white'}`}
                >
                  <option value={SceneElement.SCENE_HEADING}>Scene Heading</option>
                  <option value={SceneElement.ACTION}>Action</option>
                  <option value={SceneElement.CHARACTER}>Character</option>
                  <option value={SceneElement.DIALOGUE}>Dialogue</option>
                  <option value={SceneElement.PARENTHETICAL}>Parenthetical</option>
                  <option value={SceneElement.TRANSITION}>Transition</option>
                  <option value={SceneElement.NOTE}>Note</option>
                </select>
              </div>

              {scenes.map((scene) => (
                <div key={scene.id} className="relative group">
                  <textarea
                    value={scene.content}
                    onChange={(e) => updateContent(scene.id, e.target.value)}
                    className={`${getElementStyle(scene.type)} ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white'}`}
                    style={{
                      textTransform: scene.type === SceneElement.CHARACTER || 
                                   scene.type === SceneElement.SCENE_HEADING ? 
                                   'uppercase' : 'none'
                    }}
                    placeholder={scene.type.replace('_', ' ')}
                  />
                  <button 
                    onClick={() => removeElement(scene.id)}
                    className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MinusSquare className="w-4 h-4 text-gray-500 hover:text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'outline' && (
            <div className="space-y-4">
              {scenes
                .filter(scene => scene.type === SceneElement.SCENE_HEADING)
                .map((scene, index) => (
                  <div key={scene.id} className={`p-4 rounded border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                    <h3 className="font-bold">Scene {index + 1}</h3>
                    <p>{scene.content}</p>
                  </div>
                ))}
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-4">
              {scenes.map((scene, index) => (
                <div key={scene.id} className={`p-4 rounded border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                  <textarea
                    className={`w-full p-2 rounded border ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white'}`}
                    placeholder="Add notes for this scene..."
                  />
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Statistics Panel */}
      {showStats && (
        <div className={`fixed bottom-0 left-0 right-0 p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} border-t z-40`}>
          <div className="max-w-4xl mx-auto grid grid-cols-5 gap-4">
            <div>
              <div className="text-sm text-gray-500">Pages</div>
              <div className="text-xl font-bold">{statistics.pageCount}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Scenes</div>
              <div className="text-xl font-bold">{statistics.sceneCount}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Words</div>
              <div className="text-xl font-bold">{statistics.wordCount}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Characters</div>
              <div className="text-xl font-bold">{statistics.characterCount}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Dialogue Lines</div>
              <div className="text-xl font-bold">{statistics.dialogueCount}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScreenplayEditor;

const fs = require('fs');

const appTsx = fs.readFileSync('src/App.tsx', 'utf8');

let newAppTsx = appTsx;

// Add react-router-dom imports
newAppTsx = newAppTsx.replace(
  "import React, { useState, useEffect } from 'react';",
  "import React, { useState, useEffect } from 'react';\nimport { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';"
);

// Replace useState<ActiveTab>('cover')
const activeTabPattern = /const \[activeTab, setActiveTab\] = useState<ActiveTab>\('cover'\);/;
const activeTabReplacement = `
  const location = useLocation();
  const navigate = useNavigate();

  const getActiveTab = (): ActiveTab => {
    switch (location.pathname) {
      case '/': return 'cover';
      case '/welcome': return 'welcome';
      case '/map': return 'map';
      case '/lessons': return 'lessons';
      case '/simulator': return 'simulator';
      case '/jre': return 'jre_workshop';
      case '/review': return 'review';
      case '/qbank': return 'qbank';
      case '/exams': return 'exams';
      case '/print': return 'print';
      default: return 'cover';
    }
  };

  const activeTab = getActiveTab();

  const setActiveTab = (tab: ActiveTab) => {
    switch (tab) {
      case 'cover': navigate('/'); break;
      case 'welcome': navigate('/welcome'); break;
      case 'map': navigate('/map'); break;
      case 'lessons': navigate('/lessons'); break;
      case 'simulator': navigate('/simulator'); break;
      case 'jre_workshop': navigate('/jre'); break;
      case 'review': navigate('/review'); break;
      case 'qbank': navigate('/qbank'); break;
      case 'exams': navigate('/exams'); break;
      case 'print': navigate('/print'); break;
    }
  };
`;

newAppTsx = newAppTsx.replace(activeTabPattern, activeTabReplacement.trim());

// Replace main content with Routes
const mainPattern = /<main className="flex-1">[\s\S]*?<\/main>/;

const mainReplacement = `
      <main className="flex-1">
        <Routes>
          <Route path="/" element={
            <CoverPage
              onStartReading={() => setActiveTab('welcome')}
              onOpenAnalysis={() => setIsAnalysisModalOpen(true)}
            />
          } />
          
          <Route path="/welcome" element={
            <WelcomeAndGuide
              onGoToLessons={() => setActiveTab('lessons')}
              onGoToMap={() => setActiveTab('map')}
            />
          } />
          
          <Route path="/map" element={
            <UnitMapAndOutcomes
              initialUnitId={selectedUnit}
              onSelectLesson={handleSelectLessonFromMap}
            />
          } />
          
          <Route path="/lessons" element={
            <LessonViewer
              currentLessonIndex={currentLessonIndex}
              setCurrentLessonIndex={setCurrentLessonIndex}
              onCompleteExercise={handleExerciseCompleted}
              onOpenGlossaryTerm={(termId) => {
                setSelectedGlossaryTermId(termId);
                setIsGlossaryModalOpen(true);
              }}
            />
          } />
          
          <Route path="/simulator" element={
            <TAccountSimulator />
          } />
          
          <Route path="/jre" element={
            <JRETalker />
          } />
          
          <Route path="/review" element={
            <UnitReviewViewer initialUnitId={selectedUnit} />
          } />
          
          <Route path="/qbank" element={
            <QuestionBankViewer />
          } />
          
          <Route path="/exams" element={
            <ExamSimulator />
          } />
          
          <Route path="/print" element={
            <PrintView
              onBack={() => setActiveTab('cover')}
            />
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
`.trim();

newAppTsx = newAppTsx.replace(mainPattern, mainReplacement);

fs.writeFileSync('src/App.tsx', newAppTsx);
console.log('App patched.');

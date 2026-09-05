// MedLens Core Application Logic

// --- Mock Data ---
const DB = {
    patients: [
        {
            id: '1',
            name: 'Jane Doe',
            age: 45,
            sex: 'Female',
            lastVisit: '2023-10-27',
            status: 'Review Complete'
        },
        {
            id: '2',
            name: 'John Smith',
            age: 52,
            sex: 'Male',
            lastVisit: '2023-11-02',
            status: 'Action Required'
        },
        {
            id: '3',
            name: 'Emily Chen',
            age: 34,
            sex: 'Female',
            lastVisit: '2023-11-04',
            status: 'Review Complete'
        },
        {
            id: '4',
            name: 'Michael Davis',
            age: 61,
            sex: 'Male',
            lastVisit: '2023-11-05',
            status: 'Action Required'
        }
    ],
    records: {
        '1': {
            summary: "The patient's recent comprehensive metabolic panel and CBC indicate a generally stable condition, though with notable mild anemia (low hemoglobin at 11.2 g/dL) and slightly elevated total cholesterol (215 mg/dL). Fasting glucose is within normal limits. Recommend dietary review and follow-up on iron levels.",
            vitals: [
                { name: 'Blood Pressure', value: '120/80', unit: 'mmHg', range: '90/60 - 120/80', status: 'normal', source: 'user' },
                { name: 'Heart Rate', value: '72', unit: 'bpm', range: '60 - 100', status: 'normal', source: 'user' },
                { name: 'Weight', value: '145', unit: 'lbs', range: 'N/A', status: 'normal', source: 'user' }
            ],
            labs: [
                { name: 'Hemoglobin', value: '11.2', unit: 'g/dL', range: '12.0 - 15.5', status: 'low', source: 'ai' },
                { name: 'Total Cholesterol', value: '215', unit: 'mg/dL', range: '< 200', status: 'high', source: 'ai' },
                { name: 'Fasting Glucose', value: '95', unit: 'mg/dL', range: '70 - 99', status: 'normal', source: 'ai' },
                { name: 'Calcium', value: '9.4', unit: 'mg/dL', range: '8.6 - 10.3', status: 'normal', source: 'ai' },
                { name: 'Potassium', value: '4.1', unit: 'mEq/L', range: '3.6 - 5.2', status: 'normal', source: 'ai' }
            ]
        }
    }
};

// --- Routing & View Management ---
const root = document.getElementById('app-root');

function navigateTo(view, params = {}) {
    root.innerHTML = ''; // Clear current view
    
    switch(view) {
        case 'landing':
            root.appendChild(renderLanding());
            break;
        case 'dashboard':
            root.appendChild(renderDashboard());
            break;
        case 'intake':
            root.appendChild(renderIntake());
            break;
        case 'patient':
            root.appendChild(renderPatientRecord(params.id));
            break;
        default:
            root.appendChild(renderLanding());
    }
    
    window.scrollTo(0, 0);
}

// --- Views ---

function renderLanding() {
    const div = document.createElement('div');
    div.className = 'flex-grow flex flex-col justify-center items-center hero-bg text-center px-4 animate-fade-in';
    div.innerHTML = `
        <div class="glass-panel p-10 rounded-2xl max-w-3xl shadow-xl">
            <div class="bg-medical-100 text-medical-600 p-4 rounded-full inline-block mb-6 shadow-inner">
                <i class="fa-solid fa-microscope text-4xl"></i>
            </div>
            <h1 class="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
                Clinical Intelligence, <span class="text-medical-600">Clarified.</span>
            </h1>
            <p class="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                MedLens transforms scattered patient histories and complex medical reports into structured, easy-to-review intelligence. Instantly extract insights, reference ranges, and AI-powered summaries.
            </p>
            <div class="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <button onclick="navigateTo('intake')" class="bg-medical-600 hover:bg-medical-700 text-white px-8 py-3 rounded-lg text-lg font-medium transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                    Start Patient Intake
                </button>
                <button onclick="navigateTo('dashboard')" class="bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 px-8 py-3 rounded-lg text-lg font-medium transition-all shadow-sm hover:shadow">
                    View Dashboard
                </button>
            </div>
        </div>
    `;
    return div;
}

// Filter Function for Dashboard
window.filterPatients = function() {
    const searchVal = document.getElementById('search-patients').value.toLowerCase();
    const rows = document.querySelectorAll('.patient-row');
    rows.forEach(row => {
        const text = row.innerText.toLowerCase();
        row.style.display = text.includes(searchVal) ? '' : 'none';
    });
}

function renderDashboard() {
    const div = document.createElement('div');
    div.className = 'w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in';
    
    let patientsHtml = DB.patients.map(p => `
        <tr class="hover:bg-gray-50 cursor-pointer transition-colors patient-row" onclick="navigateTo('patient', {id: '${p.id}'})">
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10 bg-medical-100 rounded-full flex items-center justify-center text-medical-700 font-bold">
                        ${p.name.charAt(0)}
                    </div>
                    <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">${p.name}</div>
                        <div class="text-sm text-gray-500">ID: ${p.id}</div>
                    </div>
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">${p.age} Yrs / ${p.sex}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">${p.lastVisit}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${p.status === 'Review Complete' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}">
                    ${p.status}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button class="text-medical-600 hover:text-medical-900">View Record</button>
            </td>
        </tr>
    `).join('');

    div.innerHTML = `
        <div class="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
                <h2 class="text-2xl font-bold text-gray-900">Patient Dashboard</h2>
                <p class="text-sm text-gray-500 mt-1">Overview of recent intakes and clinical reviews.</p>
            </div>
            
            <div class="flex space-x-3 w-full md:w-auto">
                <div class="relative flex-grow md:w-64">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i class="fa-solid fa-search text-gray-400"></i>
                    </div>
                    <input type="text" id="search-patients" onkeyup="filterPatients()" class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-medical-500 focus:border-medical-500 sm:text-sm transition duration-150 ease-in-out" placeholder="Search patients...">
                </div>
                
                <button onclick="navigateTo('intake')" class="bg-medical-600 hover:bg-medical-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-all shadow-sm flex-shrink-0">
                    <i class="fa-solid fa-plus mr-2"></i>New Intake
                </button>
            </div>
        </div>
        
        <div class="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Demographics</th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Visit</th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th scope="col" class="relative px-6 py-3"><span class="sr-only">Actions</span></th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200" id="patient-table-body">
                    ${patientsHtml}
                </tbody>
            </table>
        </div>
    `;
    return div;
}

function renderIntake() {
    const div = document.createElement('div');
    div.className = 'w-full max-w-4xl mx-auto px-4 py-8 animate-fade-in';
    
    div.innerHTML = `
        <div class="mb-8 flex justify-between items-center">
            <div>
                <h2 class="text-2xl font-bold text-gray-900">Patient Intake & Report Upload</h2>
                <p class="text-sm text-gray-500 mt-1">Capture details and upload medical reports for AI structuring.</p>
            </div>
        </div>
        
        <div class="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
            <div class="p-6 md:p-8 space-y-8">
                <!-- Manual Info Section -->
                <div>
                    <h3 class="text-lg font-medium text-gray-900 border-b pb-2 mb-4">Patient Information</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Full Name</label>
                            <input type="text" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-medical-500 focus:border-medical-500 sm:text-sm" placeholder="e.g. Jane Doe">
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Age</label>
                                <input type="number" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-medical-500 focus:border-medical-500 sm:text-sm">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Sex</label>
                                <select class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-medical-500 focus:border-medical-500 sm:text-sm">
                                    <option>Male</option>
                                    <option>Female</option>
                                    <option>Other</option>
                                </select>
                            </div>
                        </div>
                        <div class="md:col-span-2">
                            <label class="block text-sm font-medium text-gray-700">Reported Symptoms / Notes</label>
                            <textarea rows="3" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-medical-500 focus:border-medical-500 sm:text-sm" placeholder="Patient reports feeling..."></textarea>
                        </div>
                    </div>
                </div>

                <!-- AI Upload Section -->
                <div>
                    <h3 class="text-lg font-medium text-gray-900 border-b pb-2 mb-4">Medical Report Upload <span class="ml-2 badge-ai text-xs px-2 py-0.5 rounded-full font-medium"><i class="fa-solid fa-wand-magic-sparkles mr-1"></i>AI Processing</span></h3>
                    
                    <div class="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-medical-400 bg-gray-50 transition-colors cursor-pointer" onclick="simulateUpload()">
                        <div class="space-y-1 text-center" id="upload-area">
                            <i class="fa-solid fa-file-arrow-up text-4xl text-gray-400 mb-3"></i>
                            <div class="flex text-sm text-gray-600 justify-center">
                                <label class="relative cursor-pointer bg-white rounded-md font-medium text-medical-600 hover:text-medical-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-medical-500">
                                    <span>Upload a file</span>
                                    <input id="file-upload" name="file-upload" type="file" class="sr-only">
                                </label>
                                <p class="pl-1">or drag and drop</p>
                            </div>
                            <p class="text-xs text-gray-500">PDF, PNG, JPG up to 10MB</p>
                        </div>
                    </div>
                </div>
                
                <div class="pt-4 flex justify-end">
                    <button class="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium mr-3 hover:bg-gray-50" onclick="navigateTo('dashboard')">Cancel</button>
                    <button class="bg-medical-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-medical-700 shadow-sm flex items-center" onclick="simulateUpload()">
                        Process Record <i class="fa-solid fa-arrow-right ml-2"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
    return div;
}

// Simulate AI Processing
window.simulateUpload = function() {
    const uploadArea = document.getElementById('upload-area');
    uploadArea.innerHTML = `
        <div class="flex flex-col items-center py-4">
            <i class="fa-solid fa-circle-notch fa-spin text-4xl text-medical-600 mb-4"></i>
            <p class="text-sm font-medium text-medical-800">AI is extracting clinical data...</p>
            <p class="text-xs text-gray-500 mt-1">Structuring vitals, identifying out-of-range labs, generating summary.</p>
        </div>
    `;
    
    setTimeout(() => {
        navigateTo('patient', {id: '1'});
    }, 2500);
}

function renderPatientRecord(id) {
    const patient = DB.patients.find(p => p.id === id) || DB.patients[0];
    const record = DB.records[id] || DB.records['1'];
    
    const div = document.createElement('div');
    div.className = 'w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-6';
    
    // Header with Export Button
    const headerHtml = `
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 no-print">
            <button onclick="navigateTo('dashboard')" class="text-gray-500 hover:text-medical-600 mb-4 sm:mb-0">
                <i class="fa-solid fa-arrow-left mr-2"></i> Back to Dashboard
            </button>
            <div class="flex space-x-3">
                <button onclick="window.print()" class="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md text-sm font-medium transition-all shadow-sm flex items-center">
                    <i class="fa-solid fa-file-pdf mr-2 text-red-500"></i> Export PDF
                </button>
                <button class="bg-medical-600 hover:bg-medical-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-all shadow-sm flex items-center">
                    <i class="fa-solid fa-pen-to-square mr-2"></i> Edit Record
                </button>
            </div>
        </div>
    `;

    // Helper to render table rows with provenance & badges
    const renderRow = (item) => {
        let statusBadge = '';
        if(item.status === 'low') statusBadge = '<span class="badge-low text-xs px-2 py-0.5 rounded-full font-medium"><i class="fa-solid fa-arrow-down mr-1 text-[10px]"></i>Low</span>';
        else if(item.status === 'high') statusBadge = '<span class="badge-high text-xs px-2 py-0.5 rounded-full font-medium"><i class="fa-solid fa-arrow-up mr-1 text-[10px]"></i>High</span>';
        else statusBadge = '<span class="badge-normal text-xs px-2 py-0.5 rounded-full font-medium">Normal</span>';
        
        let sourceBadge = item.source === 'ai' 
            ? '<span class="text-[10px] uppercase font-bold text-purple-600 bg-purple-100 px-1.5 py-0.5 rounded ml-2" title="Extracted by AI from Medical Report"><i class="fa-solid fa-wand-magic-sparkles mr-1"></i>AI Extracted</span>'
            : '<span class="text-[10px] uppercase font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded ml-2" title="Manually Entered"><i class="fa-solid fa-user mr-1"></i>User</span>';

        return `
            <tr>
                <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">${item.name} ${sourceBadge}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 font-semibold">${item.value} <span class="text-gray-500 font-normal text-xs ml-1">${item.unit}</span></td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">${item.range}</td>
                <td class="px-4 py-3 whitespace-nowrap">${statusBadge}</td>
            </tr>
        `;
    };

    div.innerHTML = `
        ${headerHtml}
        
        <div class="flex flex-col md:flex-row gap-6">
            <!-- Left Column: Patient Profile & Summary -->
            <div class="w-full md:w-1/3 space-y-6">
                <!-- Profile Card -->
                <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden print-border">
                    <div class="bg-medical-700 px-6 py-4 flex items-center text-white">
                        <div class="h-12 w-12 bg-white rounded-full flex items-center justify-center text-medical-700 font-bold text-xl mr-4 border-2 border-medical-500">
                            ${patient.name.charAt(0)}
                        </div>
                        <div>
                            <h2 class="text-xl font-bold">${patient.name}</h2>
                            <p class="text-medical-100 text-sm">ID: ${patient.id} • ${patient.sex} • ${patient.age} Yrs</p>
                        </div>
                    </div>
                    <div class="p-6">
                        <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Record Details</h3>
                        <div class="space-y-2 text-sm text-gray-700">
                            <div class="flex justify-between border-b pb-2">
                                <span class="text-gray-500">Date of Record:</span>
                                <span class="font-medium">${patient.lastVisit}</span>
                            </div>
                            <div class="flex justify-between border-b pb-2">
                                <span class="text-gray-500">Status:</span>
                                <span class="font-medium">${patient.status}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- AI Summary Card -->
                <div class="bg-gradient-to-br from-purple-50 to-white rounded-xl shadow-sm border border-purple-100 overflow-hidden relative print-border">
                    <div class="absolute top-0 right-0 p-3 no-print">
                        <i class="fa-solid fa-wand-magic-sparkles text-purple-300 text-2xl opacity-50"></i>
                    </div>
                    <div class="p-6">
                        <h3 class="text-sm font-bold text-purple-800 flex items-center mb-3">
                            <i class="fa-solid fa-robot mr-2"></i> AI Clinical Summary
                        </h3>
                        <p class="text-sm text-gray-700 leading-relaxed">
                            ${record.summary}
                        </p>
                        <div class="mt-4 text-[10px] text-gray-400 bg-white bg-opacity-60 p-2 rounded border border-purple-50 italic">
                            <i class="fa-solid fa-circle-info mr-1"></i> Note: This summary is AI-generated for organizational purposes and is not a definitive medical diagnosis.
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right Column: Structured Data -->
            <div class="w-full md:w-2/3 space-y-6">
                
                <!-- Vitals -->
                <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden print-border">
                    <div class="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                        <h3 class="font-bold text-gray-800"><i class="fa-solid fa-heart-pulse text-red-500 mr-2"></i> Vitals & Measurements</h3>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-white">
                                <tr>
                                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metric</th>
                                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ref Range</th>
                                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-100 bg-white">
                                ${record.vitals.map(renderRow).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Lab Results -->
                <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden print-border">
                    <div class="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                        <h3 class="font-bold text-gray-800"><i class="fa-solid fa-flask text-blue-500 mr-2"></i> Extracted Lab Results</h3>
                        <span class="text-xs text-gray-500 flex items-center"><i class="fa-solid fa-check-double text-green-500 mr-1"></i> Verified against source</span>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-white">
                                <tr>
                                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test Name</th>
                                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ref Range</th>
                                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-100 bg-white">
                                ${record.labs.map(renderRow).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
                
            </div>
        </div>
    `;
    return div;
}

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    navigateTo('landing');
});

const fs = require('fs');
const path = require('path');

const files = [
    'src/data/mockAnalytics.js',
    'src/data/mockAuditTrail.js',
    'src/data/mockData.ts',
    'src/data/mockParcelsGeoJSON.js',
    'src/data/mockRecords.js',
    'src/pages/Dashboard.tsx',
    'src/pages/Dashboard.jsx'
];

const replacements = {
    'Ramesh Das': 'Binod Pradhan',
    'Haran Das': 'Kamal Pradhan',
    'Subhas Chandra Bose': 'Arun Chettri',
    'Janakinath Bose': 'Bikash Chettri',
    'Debabrata Mukherjee': 'Dawa Sherpa',
    'Prabhat Mukherjee': 'Nima Sherpa',
    'Bimal Roy': 'Karma Lama',
    'Tarun Roy': 'Tenzing Lama',
    'Ananya Sen': 'Sita Tamang',
    'Bikash Sen': 'Gopal Tamang',
    'Santanu Ghosh': 'Sandip Ghosh',
    'Niranjan Ghosh': 'Anil Ghosh',
    'Biren Mondal': 'Bijay Gurung',
    'Suresh Das': 'Rajeev Rai',
    'Animesh Roy': 'Sujan Thapa',
    'Pranab Halder': 'Ashok Mangar',
    'Gopal Krishna Sen': 'Dilip Barman',
    'Shri Animesh Roy': 'Sujan Thapa',
    'Priya Sharma': 'Anjali Basnet',
    'Rajesh Verma': 'Biplab Sarkar',
    'Sunil Mukherjee': 'Amitava Sen',
    'Rajesh Kumar': 'Rajesh Kumar',
    'Debabrata Roy': 'Nawang Bhutia',
    'Sunita Banerjee': 'Meena Limbu',
    'Officer A. Mukherjee': 'Officer A. Pradhan',
    'Officer R. Sen': 'Officer R. Tamang',
    'Officer K. Banerjee': 'Officer K. Mangar',
    'Rahul Kumar Das': 'Kiran Subba',
    'Arjun Singh': 'Sanjay Chhetri',
    'Sourav Roy': 'Prakash Subba',
    'Debashis Ganguly': 'Lokesh Gurung',

    'ABC': 'Jorebunglow',
    'XYZ': 'Darjeeling Pulbazar',
    'Alipore': 'Sonada',
    'Kolkata South': 'Jorebunglow Sukiapokhri',
    'Bidhan Nagar': 'Ghum',
    'Bidhannagar': 'Darjeeling Pulbazar',
    'Sonarpur': 'Pulbazar',
    'Baruipur': 'Darjeeling Pulbazar',
    'Siliguri Town': 'Darjeeling Town',
    'Matigara': 'Rangbull',
    'Siliguri': 'Jorebunglow Sukiapokhri',
    'Madhyamgram': 'Lebong',
    'Barasat': 'Darjeeling Pulbazar',
    'Ward 4, Kolkata': 'Ward 4, Darjeeling',
    'Sector 5, Salt Lake': 'Chauk Bazaar, Darjeeling',
    'Bally': 'Singamari',
    'Howrah Sadar': 'Darjeeling Sadar',
    'Howrah': 'Darjeeling',
    'Kolkata': 'Darjeeling',
    'North 24 Parganas': 'Darjeeling',
    'South 24 Parganas': 'Darjeeling',

    '1,400': '1,417',
    'Official master repository of verified citizen plots, Khatian ledger entries, Mouza boundaries, and cadastral titles': 'Search and manage Khatian records, plot ownership details, and Mouza-wise land classification for Darjeeling Sadar Circle.',
    'Area mismatch detected between title deed (2.45 acres) and cadastral GIS polygon (2.61 acres).': 'Area mismatch — refer WBLR Rule 15(3), send for field verification before RoR update.',

    'Subh... Bose': 'Aru... Chhetri',
    'Ram... Roy': 'Kir... Subba',
    '94.2%': '91.8%',
    '10:41 AM': '11:05 AM',
    '10:42 AM': '12:20 PM'
};

files.forEach(fPath => {
    if (fs.existsSync(fPath)) {
        let content = fs.readFileSync(fPath, 'utf-8');
        for (const [k, v] of Object.entries(replacements)) {
            content = content.split(k).join(v);
        }
        // Round numbers in analytics
        content = content.replace(/94\\.2/g, '93.7');
        content = content.replace(/1400/g, '1417');
        fs.writeFileSync(fPath, content, 'utf-8');
        console.log('Updated ' + fPath);
    }
});

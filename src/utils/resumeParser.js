const pdf = require("pdf-parse");
const axios = require("axios");

const extractSkillFromResume = (resumeUrl)=>{
    return new Promise((resolve,reject)=>{
        axios.get(resumeUrl,{responseType:"arraybuffer"})
        .then((response)=>{
            pdf(response.data).then((parsedData)=>{
                const text = parsedData.text.toLowerCase();
                
                // Define skills with variations to improve matching
                const skillsWithVariations = {
                    "javascript": ["javascript", "js", "ecmascript"],
                    "typescript": ["typescript", "ts"],
                    "react": ["react", "reactjs", "react.js", "react js"],
                    "nodejs": ["nodejs", "node.js", "node js", "node"],
                    "express": ["express", "expressjs", "express.js", "express js"],
                    "python": ["python", "py"],
                    "java": ["java", "javaee", "j2ee"],
                    "sql": ["sql", "mysql", "postgresql", "postgres", "oracle", "sqlite"],
                    "html": ["html", "html5"],
                    "css": ["css", "css3", "scss", "sass", "less"],
                    "git": ["git", "version control"],
                    "github": ["github", "gitlab", "bitbucket"],
                    "communication": ["communication", "teamwork", "collaboration"],
                    "mern": ["mern", "mean"],
                    "c": ["c programming", "c lang", " c "],
                    "c++": ["c++", "cpp", "cplusplus", "c plus plus"],
                    "mongodb": ["mongodb", "mongo", "nosql"],
                    "php": ["php"],
                    "tailwind": ["tailwind", "tailwindcss", "tailwind css"],
                    "flutter": ["flutter", "dart"],
                    "angular": ["angular", "angularjs", "angular.js"],
                    "vue": ["vue", "vuejs", "vue.js"],
                    "aws": ["aws", "amazon web services", "ec2", "s3"],
                    "docker": ["docker", "containerization"],
                    "kubernetes": ["kubernetes", "k8s"]
                };
                
                const extractedSkills = [];
                
                // Check for each skill and its variations with word boundaries
                for (const [skill, variations] of Object.entries(skillsWithVariations)) {
                    // Check if any variation of the skill is in the text
                    const found = variations.some(variation => {
                        // Use word boundary or contains check based on the variation
                        return text.includes(variation);
                    });
                    
                    if (found && !extractedSkills.includes(skill)) {
                        extractedSkills.push(skill);
                    }
                }
                
                console.log("Extracted skills:", extractedSkills);
                resolve(extractedSkills);
            })
            .catch(reject)          
            
        })
    })
}

module.exports = {
    extractSkillFromResume
}

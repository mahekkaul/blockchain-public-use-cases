// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

contract JobPortal {
    /*
    Features that is to be added.

        Add a new applicant         -done

            Admin uses this function to add a new applicant. 

        Get applicant details       -done

            This function helps to fetch the applicant details from the blockchain.     

        Get applicant type                -done

            This function helps to fetch the application type based on the application id from the blockchain. 

        Add a new Job to the portal         -done

            This function helps to add a new job to the portal. 

        Get job details         -done

            This function fetches job data from the blockchain. 

        Applicants apply for a job          -done

            With the help of this function, applications can apply for existing jobs. 

        Provide a rating to an applicant        -done

            This function provides the rating to the applicant. 

        Fetch applicant rating          -done

            This function fetches applicant ratings from the blockchain. 
    */

    //store the address of the contract owner/ admin
    address public admin;

    //modifier to check for only admin access
    modifier onlyAdmin {
        require(admin == msg.sender, "Only admin can access this function.");
        _;
    }

    //struture of an applicant
    struct Applicant {
        uint id;
        string name;
        uint256 age;
        string expectedJobType;
        string[] skills;
        string domain;
    }

    //structure for job description
    struct JobDescription {
        string companyName;
        string jobRole;
        string requiredExperience;
        uint salaryPerAnnum;
        string workLocationType;
        uint openings;
    }

    //mapping from Id to applicants
    mapping (uint => Applicant) applicantId;

    //array to store all the jobs
    JobDescription[] jobs;

    //mapping to connect applicants to the job
    mapping (uint => JobDescription[]) public jobApplications;

    //mapping to connect applicant Id to their rating
    mapping (uint => string) applicantRating;

    //initial data allocation
    constructor() {
        admin = msg.sender;
    }

    //function to add job applicants to the array by the admin
    function addJobApplicant(uint _id, string memory _name, uint _age, string memory _expectedJobType, string[] memory _skills, string memory _domain) public onlyAdmin{
        applicantId[_id].id = _id;
        applicantId[_id].name = _name;
        applicantId[_id].age = _age;
        applicantId[_id].expectedJobType = _expectedJobType;
        applicantId[_id].domain = _domain;
        applicantId[_id].skills = new string[](_skills.length);
        for (uint i = 0; i<_skills.length; i++) applicantId[_id].skills[i] = _skills[i];
    }

    //function to get the application details from the blockchain
    function getApplicantDetails(uint _id) public view returns (uint, string memory, uint, string memory, string[] memory, string memory) {
        return (
            applicantId[_id].id,
            applicantId[_id].name,
            applicantId[_id].age,
            applicantId[_id].expectedJobType,
            applicantId[_id].skills,
            applicantId[_id].domain
        );
    }

    //function to get the type of applicant based on the domain of working
    function getApplicantType(uint _id) public view returns (string memory) {
        return applicantId[_id].domain;
    }

    //function to add new job -- can be added only by the admin
    function addJob(string memory _companyName, string memory _jobRole, string memory _requiredExperience, uint _salaryPerAnnum, string memory _workLocationType, uint openings) public onlyAdmin {
        jobs.push(
            JobDescription(_companyName, _jobRole, _requiredExperience, _salaryPerAnnum, _workLocationType, openings)
        );
    }

    //function to show the available jobs based on role
    function getJobDetails(string memory _jobRole) public view returns (JobDescription[] memory) {
        //find the number of job matchs
        uint jobMatchCount = 0;

        for (uint i = 0; i<jobs.length; i++) {
            if (keccak256(abi.encodePacked(jobs[i].jobRole)) == keccak256(abi.encodePacked(_jobRole))) jobMatchCount++;
        }

        //create a temporary array to store all the available jobs
        JobDescription[] memory availbleJobs = new JobDescription[](jobMatchCount);

        //fill the array with all the available jobs
        uint index = 0;
        for (uint i = 0; i<jobMatchCount; i++) {
            if (keccak256(abi.encodePacked(jobs[i].jobRole)) == keccak256(abi.encodePacked(_jobRole))) {
                availbleJobs[index] = JobDescription(
                    jobs[i].companyName,
                    jobs[i].jobRole,
                    jobs[i].requiredExperience,
                    jobs[i].salaryPerAnnum,
                    jobs[i].workLocationType,
                    jobs[i].openings
                );
                index++;
            }
        }

        //in case job not found
        require(jobMatchCount > 0, "Job not found.");

        return availbleJobs;
    }

    //function to apply job 
    function applyForJobs(uint _id, string memory _jobRole) public {
        //finding the required job
        for (uint i = 0; i<jobs.length; i++) {
            if (keccak256(abi.encodePacked(jobs[i].jobRole)) == keccak256(abi.encodePacked(_jobRole)) && (jobs[i].openings > 0)) {
                //temporary storing of the job
                JobDescription memory newApplication = JobDescription(
                    jobs[i].companyName,
                    jobs[i].jobRole,
                    jobs[i].requiredExperience,
                    jobs[i].salaryPerAnnum,
                    jobs[i].workLocationType,
                    jobs[i].openings
                );

                //inserting the applicant id and job to the mapping
                jobApplications[_id].push(newApplication);

                //decrementing the job openings
                jobs[i].openings--;
            }
        }

        revert("No job found.");
    }

    //function to get the jobs that a candidate has applied for
    function getAppliedJobs(uint _id) public view returns (JobDescription[] memory) {
        return jobApplications[_id];
    }

    //function to provide rating to the applicants
    //create a mapping for rating with applicant id => rating 
    function giveApplicantRating(uint _id, string memory _rating) public {
        applicantRating[_id] = _rating;
    }

    //function to fetch the applicant rating
    function getApplicantRating(uint _id) public view returns (string memory) {
        return applicantRating[_id];
    }
}
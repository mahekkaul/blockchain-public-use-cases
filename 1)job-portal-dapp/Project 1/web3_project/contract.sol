// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract JobPortal {
    address public admin;

    struct Applicant {
        uint256 id;
        string name;
        string skills;
        uint256 rating;
    }

    struct Job {
        uint256 id;
        string title;
        string description;
        uint256 salary;
        uint256 applicantId;
        bool isFilled;
    }

    Applicant[] public allApplicants;
    Job[] public allJobs;

    constructor() {
        admin = msg.sender;
    }

    function addApplicant(string memory _name, string memory _skills) public {
        uint256 applicantId = allApplicants.length + 1;
        allApplicants.push(Applicant(applicantId, _name, _skills, 0));
    }

    function addJob(string memory _title, string memory _description, uint256 _salary) public {
        uint256 jobId = allJobs.length + 1;
        allJobs.push(Job(jobId, _title, _description, _salary, 0, false));
    }

    function hireApplicant(uint256 _jobId, uint256 _applicantId) public {
        require(_jobId <= allJobs.length && _applicantId <= allApplicants.length, "Invalid ID");
        allJobs[_jobId - 1].applicantId = _applicantId;
        allJobs[_jobId - 1].isFilled = true;
        allApplicants[_applicantId - 1].rating++;
    }
}

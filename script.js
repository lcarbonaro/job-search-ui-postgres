// IIFE - immediately invoked function expression
(async () => {

    let btnAddNewJob = document.querySelector('#btnAddJob');
    let ul = document.querySelector('#ulJobList');

    let divAddJob = document.querySelector('#divAddJob');
    let divEditJob = document.querySelector('#divEditJob');

    let btnAddJobs = document.querySelector('#btnAddJobs');
    btnAddJobs.addEventListener('click', () => {
        divAddJob.className = 'show';
        //TODO - clear the fields!!!
        divEditJob.className = 'hide';
    });

    let btnSaveEdits = document.querySelector('#btnSaveEdits');
    btnSaveEdits.addEventListener('click', async () => {
        await saveEdits();
        await getJobList();
        divAddJob.className = 'hide';
        divEditJob.className = 'hide'; 
    });

    let btnCancelEdits = document.querySelector('#btnCancelEdits');
    btnCancelEdits.addEventListener('click', async () => {
        divAddJob.className = 'hide';
        divEditJob.className = 'hide';        
    });

    btnAddNewJob.addEventListener('click', async () => {
        await addJob();
        await getJobList();
        divAddJob.className = 'hide';
        divEditJob.className = 'hide';        
    });

    await getJobList();

    async function getJobList() {
        ul.innerHTML = "";
        let resp = await fetch('http://localhost:3000/jobs');
        let {result:data} = await resp.json();
        console.table(data);
        for (let i=0; i < data.length; i++) {
            let { id, jobtitle, company, region, jobcategory } = data[i];

            let li = document.createElement('li');
            //li.textContent = `${jobtitle} (${company})`;

            let btnEdit = document.createElement('button');
            btnEdit.textContent = "Edit";
            btnEdit.addEventListener('click', async () => {
                await editJob(id);
            });

            let btnDel = document.createElement('button');
            btnDel.textContent = "Del";
            btnDel.addEventListener('click', async () => {
                await deleteJob(id);
                await getJobList();                
            });

            li.innerHTML = `${id} - ${jobtitle} (${company})`;
            li.append(btnEdit);
            li.append(btnDel);

            ul.appendChild(li);

        }
    }  // async function getJobList


    async function editJob(jobId) {
        //console.log(`so you want to edit job id ${jobId}`);
        divEditJob.className = 'show';
        divAddJob.className = 'hide';

        // fetch the record
        let resp = await fetch(`http://localhost:3000/jobs/${jobId}`,{
            method: 'GET' 
        });
        let {result:jobsArray} = await resp.json();

        // populate the form
        document.querySelector('input[name="editJobId"]').value = jobsArray[0].id;
        document.querySelector('input[name="editJobTitle"]').value = jobsArray[0].jobtitle;
        document.querySelector('input[name="editCompany"]').value = jobsArray[0].company;
        document.querySelector('input[name="editJobCategory"]').value = jobsArray[0].jobcategory;
        document.querySelector('input[name="editRegion"]').value = jobsArray[0].region;
    }

    async function deleteJob(jobId) {
        //console.log(`so you want to delete job id ${jobId}`);
        await fetch(`http://localhost:3000/jobs/${jobId}`,{
            method: 'DELETE'                                  
        });

    }
    
    async function saveEdits() {
        let id = document.querySelector('input[name="editJobId"]').value;
        let jobTitle = document.querySelector('input[name="editJobTitle"]').value;
        let company = document.querySelector('input[name="editCompany"]').value;
        let jobCategory = document.querySelector('input[name="editJobCategory"]').value;
        let region = document.querySelector('input[name="editRegion"]').value;

        let saveObj = {
            id : parseInt(id,10),
            jobTitle,
            jobCategory,
            company,
            region  
        }

        //console.log(`so you want to save edits for job id ${id}`);

        await fetch(`http://localhost:3000/jobs/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(saveObj) // body data type must match "Content-Type" header
        });

    }


    async function addJob() {
        let jobTitle = document.querySelector('input[name="jobTitle"]').value;
        let company = document.querySelector('input[name="company"]').value;
        let region = document.querySelector('input[name="region"]').value;
        let jobCategory = document.querySelector('input[name="jobCategory"]').value;

        let requestData = {
            jobTitle,
            company,
            region,
            jobCategory
        };

        await fetch('http://localhost:3000/jobs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData) // body data type must match "Content-Type" header
        });

    }  //  async function addJob()



})();  // end of IIFE
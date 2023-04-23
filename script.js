// IIFE - immediately invoked function expression
(async () => {

    let btnAddNewJob = document.querySelector('#btnAddJob');
    let ul = document.querySelector('#ulJobList');

    let divAddJob = document.querySelector('#divAddJob');
    let divEditJob = document.querySelector('#divEditJob');
    let divSearchJob = document.querySelector('#divSearchJob');

    let selSearchFld = document.querySelector('#selSearchField');
    let errMsg = document.querySelector('#errMsg');

    let btnAddJobs = document.querySelector('#btnAddJobs');
    btnAddJobs.addEventListener('click', () => {
        divAddJob.className = 'show';
        //TODO - clear the fields!!!
        divEditJob.className = 'hide';
        divSearchJob.className = 'hide';
    });

    let btnSearchJobs = document.querySelector('#btnSearchJobs');
    btnSearchJobs.addEventListener('click', () => {
        divAddJob.className = 'hide';
        //TODO - clear the fields!!!
        divEditJob.className = 'hide';
        divSearchJob.className = 'show';

        // clearing the search input
        // and hiding the search results table
        document.querySelector('input[name="jobSearchCriteria"]').value = '';
        document.querySelector('#searchResultTbl').className='hide';       
        document.querySelector('#searchResultTbl>tbody').innerHTML = '';     

    });

    let btnSearchJob = document.querySelector('#btnSearchJob');

    let btnSaveEdits = document.querySelector('#btnSaveEdits');
    btnSaveEdits.addEventListener('click', async () => {
        await saveEdits();

        // do not need to hit the b/e again; just update the f/e
        //await getJobList();

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

    btnSearchJob.addEventListener('click', async () => {        
        await getJobSearchResults();        
    });
    
    await getJobList();

    async function getJobSearchResults() {
        let searchStr = document.querySelector('input[name="jobSearchCriteria"]').value;

        let searchFld = selSearchFld.value;
        let searchUrl;        
        if( searchFld === 'all') {
            searchUrl = `http://localhost:3000/jobSearch/${searchStr}`;
        } else {
            searchUrl = `http://localhost:3000/jobSearchByField?criteria=${searchStr}&field=${searchFld}`;
        }

        let resp = await fetch(searchUrl);
        let {result:data} = await resp.json();

        console.log(data);

        let tbl = document.querySelector('#searchResultTbl');        
        let tblBody = tbl.querySelector('tbody');
        tblBody.innerHTML = '';    

        if(data.length>0) {
            errMsg.textContent = '';   
            tbl.className = 'show';
        } else {
            errMsg.textContent = 'No match found';   
            tbl.className = 'hide';
        }       

        let tr,td;

        for (let i=0; i < data.length; i++) {
            let { id, jobtitle, company, region, jobcategory } = data[i];

            tr = document.createElement('tr');

            td = document.createElement('td');
            td.textContent = id;           
            tr.appendChild(td);

            td = document.createElement('td');
            td.textContent = jobtitle;           
            tr.appendChild(td);

            td = document.createElement('td');
            td.textContent = company;           
            tr.appendChild(td);

            td = document.createElement('td');
            td.textContent = jobcategory;           
            tr.appendChild(td);
            
            td = document.createElement('td');
            td.textContent = region;           
            tr.appendChild(td);
            
            tblBody.appendChild(tr);

        } // for-loop

    }

    async function getJobList() {
        ul.innerHTML = "";
        let resp = await fetch('http://localhost:3000/jobs');
        let {result:data} = await resp.json();
        console.table(data);
        for (let i=0; i < data.length; i++) {
            let { id, jobtitle, company, region, jobcategory } = data[i];

            let li = document.createElement('li');
            //li.textContent = `${jobtitle} (${company})`;

            // add element id using the job record id
            li.id = `job-id-${id}`;

            let btnEdit = document.createElement('button');
            btnEdit.id = `edit-job-id-${id}`;
            btnEdit.textContent = "Edit";
            btnEdit.addEventListener('click', async () => {
                await editJob(id);
            });

            let btnDel = document.createElement('button');
            btnDel.id = `del-job-id-${id}`;
            btnDel.textContent = "Del";
            btnDel.addEventListener('click', async () => {
                await deleteJob(id);

                // no need to fetch list again as we are removing the LI in the f/e            
                //await getJobList();    
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
        divSearchJob.className = 'hide';

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

        // get a reference to the li for the deleted job
        // remove that li from the ul
        let delLI = document.querySelector(`li#job-id-${jobId}`);
        delLI.remove();

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

        // update f/e directly
        let editLI = document.querySelector(`li#job-id-${id}`);
        let btnEdit = editLI.querySelector(`button#edit-job-id-${id}`);
        let btnDel  = editLI.querySelector(`button#del-job-id-${id}`);
        editLI.innerHTML = `${id} - ${jobTitle} (${company})`;
        editLI.append(btnEdit);
        editLI.append(btnDel);
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
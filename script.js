// IIFE - immediately invoked function expression
(async () => {

    let btn = document.querySelector('#btnAddJob');
    let ul = document.querySelector('#ulJobList');

    btn.addEventListener('click', addJob);

    await getJobList();

    async function getJobList() {
        let resp = await fetch('http://localhost:3000/jobs');
        let {result:data} = await resp.json();
        console.table(data);
        for (let i=0; i < data.length; i++) {
            let { id, jobtitle, company, region, jobcategory } = data[i];

            let li = document.createElement('li');
            //li.textContent = `${jobtitle} (${company})`;

            let btnEdit = document.createElement('button');
            btnEdit.textContent = "Edit";
            btnEdit.addEventListener('click', () => {
                editJob(id);
            });

            let btnDel = document.createElement('button');
            btnDel.textContent = "Del";
            btnDel.addEventListener('click', () => {
                deleteJob(id);
            });

            li.innerHTML = `${id} - ${jobtitle} (${company})`;
            li.append(btnEdit);
            li.append(btnDel);

            ul.appendChild(li);

        }
    }  // async function getJobList


    function editJob(jobId) {
        console.log(`so you want to edit job id ${jobId}`);

    }

    function deleteJob(jobId) {
        console.log(`so you want to delete job id ${jobId}`);

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
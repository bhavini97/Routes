const fs = require('fs');
const http = require('http')
const reqHandler = (req,res)=>{
    const url = req.url;
    const method = req.method;

    if (url === '/' && method === 'GET') {
        // Read the file content (if any)
        fs.readFile('formValues.txt',  (err, data) => {
            if (err) {
                // If there's an error reading the file (other than non-existence)
                res.statusCode = 500;
                res.end('Internal Server Error');
                return;
            }

            // Display form and previous form data
            res.setHeader('Content-Type', 'text/html');
            res.end(`
                <h1>Submitted Data: ${data}</h1>
                <form action="/" method="post">
                    <label>Name</label>
                    <input type="text" name="Username" />
                    <button type="submit">Add</button>
                </form>
            `);
        });
    } else if (url === '/' && method === 'POST') {
        let dataChunks = [];
        req.on('data', (chunk) => {
            dataChunks.push(chunk);
        });

        req.on('end', () => {
            let buffer = Buffer.concat(dataChunks);
            let formData = buffer.toString();
            console.log(formData);

            const formValue = formData.split('=')[1];

            // Write the form data to the file
            fs.writeFile('formValues.txt', formValue, (err) => {
                if (err) {
                    console.error('Error writing file:', err);
                    res.statusCode = 500;
                    res.end('Internal Server Error');
                    return;
                }

                // After submitting, read the file to show the updated value
                fs.readFile('formValues.txt', 'utf-8', (err, data) => {
                    if (err) {
                        res.statusCode = 500;
                        res.end('Internal Server Error');
                        return;
                    }

                    // Send the updated data along with the form
                    res.setHeader('Content-Type', 'text/html');
                    res.end(`
                        <h1>Submitted Data: ${data}</h1>
                        <form action="/" method="post">
                            <label>Name</label>
                            <input type="text" name="Username" />
                            <button type="submit">Add</button>
                        </form>
                    `);
                });
            });
        });
    }
}
const anotherFun =()=>{
    console.log('Another function')
}
// module.exports ={
//     // reqHandler,
//     // anotherFun

//     handler:reqHandler,
//     testfun:anotherFun
// };

module.exports.handler = reqHandler;
module.exports.handler = anotherFun;

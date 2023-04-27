const AWS = require('aws-sdk');

// Deben ser datos de una cuenta personal/empresarial de AWS, 
// las cuentas de laboratorio no funcionan, indican error de que no existe el Access Key ID
const s3 = new AWS.S3({
    accessKeyId: "AKIAXVHVE2SGV43DOT2K",
    secretAccessKey: "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",
    aws_session_token: "",
});

// Los nombres de los Buckets son unicos a nivel mundial
const BUCKET_NAME = 's3nodeklm'

const createBucket = (bucketName) => {
    // Create the parameters for calling createBucket
    var bucketParams = {
        Bucket : bucketName
    };
  
    // call S3 to create the bucket
    s3.createBucket(bucketParams, function(err, data) {
        if (err) {
            console.log("Error", err);
        } else {
            console.log("Success", data.Location);
        }
    });
}

const listBuckets = (s3) => {
    s3.listBuckets(function(err, data) {
        if (err) {
          console.log("Error", err);
        } else {
          console.log("Success", data.Buckets);
        }
    });
}

const uploadFile = (filePath,bucketName,keyName) => {
    var fs = require('fs');
    // Read the file
    const file = fs.readFileSync(filePath);

    // Setting up S3 upload parameters
    const uploadParams = {
        Bucket: bucketName, // Bucket into which you want to upload file
        Key: keyName, // Name by which you want to save it
        Body: file // Local file 
    };

    s3.upload(uploadParams, function(err, data) {
        if (err) {
            console.log("Error", err);
        } 
        if (data) {
            console.log("Upload Success", data.Location);
        }
    });
};

const listObjectsInBucket = (bucketName) => {
    // Create the parameters for calling listObjects
    var bucketParams = {
        Bucket : bucketName,
    };
  
    // Call S3 to obtain a list of the objects in the bucket
    s3.listObjects(bucketParams, function(err, data) {
        if (err) {
            console.log("Error", err);
        } else {
            console.log("Success", data);
        }
    });
}

const deleteBucket = (bucketName) => {
    // Create params for S3.deleteBucket
    var bucketParams = {
        Bucket : bucketName
    };
  
    // Call S3 to delete the bucket
    s3.deleteBucket(bucketParams, function(err, data) {
        if (err) {
            console.log("Error", err);
        } else {
            console.log("Success", data);
        }
    });
}

function sleep(ms) {
    console.log('Wait...')
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main(){
    console.log('\nCreating bucket : ')
    createBucket(BUCKET_NAME)
    await sleep(5000)
    
    console.log('\nListing out all the buckets in your AWS S3: ')
    listBuckets(s3)
    await sleep(5000)
    
    console.log('\nUploading image1 to '+ BUCKET_NAME)
    uploadFile('nodejs.jpg',BUCKET_NAME,"nodejs.jpg")
    await sleep(5000)
    
    console.log('\nUploading image2 to '+ BUCKET_NAME)
    uploadFile('npm.jpg',BUCKET_NAME,"npm.jpg")
    await sleep(5000)
    
    console.log('\nListing out all the files/objects in the bucket '+ BUCKET_NAME)
    listObjectsInBucket(BUCKET_NAME)
    await sleep(5000)
}
main()

module.exports={
  promisify : function(stream) {
    return new Promise((resolve, reject)=>{
      stream
      .on('end', resolve)
      .on('error', reject)
    });
  }
};

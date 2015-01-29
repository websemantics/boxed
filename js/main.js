/*!
 * @overview  Boxed.js
 *
 * @copyright (c) 2015 Web Semantics, Inc.
 *
 * Warning: The code is a mess, pre-alpha
 * 
 * @license   Licensed under MIT license
 *
 */

var obj = this;

(function() {

  var Boxed = function(file_name, repo, form) {

    var zipWriter, writer, URL = obj.webkitURL || obj.mozURL || obj.URL;

    // Parse the file_name in case it contains user params (i.e. {{module_name}}-module)
    var repo_id_template = Handlebars.compile(file_name);
    
    // List of acceptable file extensions,
    var accept = repo.accept.split(",");

    var self = this;

    // This is a crude way to access Github API (change me!)
    var github = new Github({
      username: "10v1ox+11tw36hdy6ymg@sharklasers.com",
      password: "YNbb5jNX",
      auth: "basic"
    });

    this.compileAndDownload = function() {
      
      var formValues = repo.renderedForm.getValue();

      formValues.generatedBy = "Generated by, Boxed - http://websemantics.github.io/boxed/"

      var repository = github.getRepo(repo.user,repo.repo_name);
      
      // Read the entire repo, oh yeah!
      repository.getTree(repo.branch + "?recursive=true", function(err, tree) {

        self.compress(tree, formValues);

      },true);
    }

    this.compress = function(files, formValues) {

       // Add the files to the zip
      this.addFiles(files, 
          function() {
              
              // console.log("Initialise");

          }, function(file) {
              
                var ext = file.path.split('.').pop();

                // Parse file path first,
                var path_template   = Handlebars.compile(file.path);
                file.path = path_template(formValues);

                // Parse file content if the extension matches the accepted param
                if(file.data && accept.indexOf(ext) != -1){
                  var data_template = Handlebars.compile(file.data);
                  file.data = data_template(formValues);
                }

          }, function(fileIndex, totalFiles, sizePresent, totalSize) {
              // OnProgress
              var value = Math.floor(fileIndex * 100 / totalFiles);
              $('.progress-bar').css('width', value+'%').attr('aria-valuenow', value).text(fileIndex+' of '+totalFiles+' ('+value+'%)');    

          }, function() {
              // OnEnd
              // The zip is ready prepare download link
              
              zipWriter.close(function(blob) {
                zipWriter = null;
                var url = URL.createObjectURL(blob);
                document.getElementById("download").href = url;
                document.getElementById("download").style.display = "block";
                document.getElementById("download").download = repo_id_template(formValues)+".zip";
              });

          });

    }

    this.addFiles = function addFiles(files, oninit, onadd, onprogress, onend) {
            var addIndex = 0;

            var repository = github.getRepo(repo.user, repo.repo_name);

            function nextFile() {
                var file = files[addIndex];

                      if(file.type == 'blob'){
                        // Data File
                        repository.read(repo.branch, file.path, function(err, data) {
                        
                          file.data = data;

                          onadd(file);

                          // this is a mess, .. 
                          var ext = file.path.split('.').pop().toLowerCase();
                          var cls = (['png','gif','jpg','jpeg'].indexOf(ext) != -1)? zip.BlobReader : zip.TextReader;

                          // Modified here to use the Data64URIReader instead of BlobReader
                          zipWriter.add(file.path, new cls(file.data), function() {
                              addIndex++;
                              if (addIndex < files.length)
                                  nextFile();
                              else
                                  onend();
                          }, function(current, total){
                            onprogress(addIndex+1, files.length, current, total)
                          });

                      });

                    } else {
                          // Tree or Folder

                          onadd(file);

                          // Modified here to use the Data64URIReader instead of BlobReader
                          zipWriter.add(file.path, null, function() {
                              addIndex++;
                              if (addIndex < files.length)
                                  nextFile();
                              else
                                  onend();
                          }, function(current, total){
                            onprogress(addIndex+1, files.length, current, total)
                          },{directory:true});


                    }
            }

            function createZipWriter() {
                zip.createWriter(writer, function(writer) {
                    zipWriter = writer;
                    oninit();
                    nextFile();
                }, onerror);
            }

            if (zipWriter) {
              nextFile();
            } else {
                writer = new zip.BlobWriter();
                createZipWriter();
            } 
        }

    };

    
/*
mode: "040000"
path: "src/Http/Controller"
sha: "1fec15adea0544c0cb597db689267908fa316206"
type: "tree"
url: "https://api.github.com/repos/anomalylabs/example-module/git/trees/1fec15adea0544c0cb597db689267908fa316206"

 
mode: "100644"
path: "src/Installer/ExampleFieldInstaller.php"
sha: "524473fb6e6227de526a2c6d2ae977d49e77990d"
size: 462
type: "blob"
url: "https://api.github.com/repos/anomalylabs/example-module/git/blobs/524473fb6e6227de526a2c6d2ae977d49e77990d"__proto__: Object

*/


      // var github = new Github({
      //   token: "697d76cd00d1a42d4ed1144abbf88e7e2963cc00",
      //   auth: "8fe89254b74160890445"
      // });

      // github.getRateLimit(function(err, limit){
      //  console.log(limit);
      // });

      // 0 users
      // Client ID
      // 8fe89254b74160890445
      // Client Secret
      // 697d76cd00d1a42d4ed1144abbf88e7e2963cc00



        // repo.read('master', 'path/to/file', function(err, data) {});

        // console.log(tree);



  if (typeof exports !== 'undefined') {
    // Github = exports;
    module.exports = Boxed;
  } else {
    window.Boxed = Boxed;
  }
}).call(this);

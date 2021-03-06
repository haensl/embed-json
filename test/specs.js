const { join, resolve } = require('path');
const fs = require('fs');
const expect = require('chai').expect;
const embedJson = require('../');
const fixturesPath = join(__dirname, 'fixtures');
const appRoot = resolve(join(__dirname, '..'));

const fixture = (name) =>
  new Promise((resolve, reject) => {
    fs.readFile(join(fixturesPath, name), 'utf8', (err, data) => {
      if (err) {
        return reject(err);
      }

      resolve(data);
    });
  });

describe('embed-json', () => {
  describe('script with src attribute', () => {
    let output;

    describe('and mime type application/json', () => {
      beforeEach((done) => {
        fixture('json.html')
          .then((html) => {
            output = embedJson(html, {
              root: appRoot
            });
            done();
          });
      });

      it('inserts the JSON data into the script tag', () => {
        expect(/"foo":"bar"/.test(output)).to.be.true;
      });

      it('removes the src attribute', () => {
        expect(/src=/.test(output)).to.be.false;
      });
    });

    describe('and mime type application/ld+json', () => {
      beforeEach((done) => {
        fixture('ld+json.html')
          .then((html) => {
            output = embedJson(html, {
              root: appRoot
            });
            done();
          });
      });

      it('inserts the JSON data into the script tag', () => {
        expect(/"foo":"bar"/.test(output)).to.be.true;
      });

      it('removes the src attribute', () => {
        expect(/src=/.test(output)).to.be.false;
      });
    });
  });

  describe('no script tag', () => {
    let output;
    let input;

    beforeEach((done) => {
      fixture('no-script.html')
        .then((html) => {
          input = html;
          output = embedJson(html, {
            root: appRoot
          });
          done();
        });
    });

    it('bypasses the input', () => {
      expect(output).to.equal(input);
    });
  });

  describe('no input', () => {
    it('throws', () => {
      expect(embedJson).to.throw;
    });
  });

  describe('non-existent src', () => {
    let error;

    beforeEach((done) => {
      fixture('nonexistent-src.html')
        .then((html) => {
          try {
            embedJson(html, {
              root: appRoot
            });
          } catch (err) {
            error = err;
          } finally {
            done();
          }
        });
    });

    it('throws an invalid source error', () => {
      expect(/invalid source/i.test(error.message)).to.be.true;
    });
  });

  describe('options', () => {
    describe('mimeTypes', () => {
      let output;

      describe('Array<string>', () => {
        beforeEach((done) => {
          fixture('opt-mime.html')
            .then((html) => {
              output = embedJson(html, {
                root: appRoot,
                mimeTypes: [
                  'foo/bar'
                ]
              });
              done();
            });
        });

        it('processes scripts with the given mime type', () => {
          expect(/type="foo\/bar">{"foo":"bar"}/.test(output)).to.be.true;
        });

        it('does not process scripts with different mime type', () => {
          expect(/type="application\/json" src="/.test(output)).to.be.true;
        });
      });

      describe('string', () => {
        beforeEach((done) => {
          fixture('opt-mime.html')
            .then((html) => {
              output = embedJson(html, {
                root: appRoot,
                mimeTypes: 'foo/bar'
              });
              done();
            });
        });

        it('processes scripts with the given mime type', () => {
          expect(/type="foo\/bar">{"foo":"bar"}/.test(output)).to.be.true;
        });

        it('does not process scripts with different mime type', () => {
          expect(/type="application\/json" src="/.test(output)).to.be.true;
        });
      });

      describe('non string or Array<string>', () => {
        let error;

        beforeEach((done) => {
          fixture('opt-mime.html')
            .then((html) => {
              try {
                embedJson(html, {
                  root: appRoot,
                  mimeTypes: {
                    foo: 'bar'
                  }
                });
              } catch (err) {
                error = err;
              } finally {
                done();
              }
            });
        });

        it('throws an invalid option error', () => {
          expect(/invalid option: mimeTypes/i.test(error.message)).to.be.true;
        });
      });
    });

    describe('root', () => {
      let output;

      describe('string', () => {
        describe('valid path', () => {
          beforeEach((done) => {
            fixture('opt-root.html')
              .then((html) => {
                output = embedJson(html, {
                  root: './test/fixtures'
                });
                done();
              });
          });

          it('searches for the json file in the given folder', () => {
            expect(/{"foo":"bar"}/.test(output)).to.be.true;
          });
        });

        describe('invalid path', () => {
          let error;

          beforeEach((done) => {
            fixture('opt-root.html')
              .then((html) => {
                try {
                  embedJson(html, {
                    root: './test/does-not-exist'
                  });
                } catch (err) {
                  error = err;
                } finally {
                  done();
                }
              });
          });

          it('emits an invalid option error', () => {
            expect(/invalid option: root/i.test(error.message)).to.be.true;
          });
        });
      });

      describe('non string', () => {
        let error;

        beforeEach((done) => {
          fixture('opt-root.html')
            .then((html) => {
              try {
                embedJson(html, {
                  root: {
                    foo: 'bar'
                  }
                });
              } catch(err) {
                error = err;
              } finally {
                done();
              }
            });
        });

        it('emits an invalid option error', () => {
          expect(/invalid option: root/i.test(error.message)).to.be.true;
        });
      });
    });

    describe('minify', () => {
      describe('boolean', () => {
        let output;
        describe('true', () => {
          beforeEach((done) => {
            fixture('json.html')
              .then((html) => {
                output = embedJson(html, {
                  root: appRoot,
                  minify: true
                });
                done();
              });
          });

          it('minifies the json data', () => {
            expect(/{"foo":"bar"}/.test(output)).to.be.true;
          });
        });

        describe('false', () => {
          beforeEach((done) => {
            fixture('json.html')
              .then((html) => {
                output = embedJson(html, {
                  root: appRoot,
                  minify: false
                });
                done();
              });
          });

          it('does not minify the json data', () => {
            expect(/{ "foo": "bar" }/.test(output)).to.be.true;
          });
        });
      });

      describe('non-boolean', () => {
        let error;

        beforeEach((done) => {
          fixture('json.html')
            .then((html) => {
              try {
                embedJson(html, {
                  root: appRoot,
                  minify: {
                    foo: 'bar'
                  }
                });
              } catch (err) {
                error = err;
              } finally {
                done();
              }
            });
        });

        it('emits an invalid option error', () => {
          expect(/invalid option: minify/i.test(error.message)).to.be.true;
        });
      });
    });

    describe('encoding', () => {
      describe('string', () => {
        let output;

        beforeEach((done) => {
          fixture('opt-encoding.html')
            .then((html) => {
              output = embedJson(html, {
                root: appRoot,
                encoding: 'ascii'
              });
              done();
            });
        });

        it('inserts the JSON data into the script tag', () => {
          expect(/"foo":"bar"/.test(output)).to.be.true;
        });

        it('removes the src attribute', () => {
          expect(/src=/.test(output)).to.be.false;
        });
      });

      describe('non string', () => {
        let error;

        beforeEach((done) => {
          fixture('json.html')
            .then((html) => {
              try {
                embedJson(html, {
                  root: appRoot,
                  encoding: {
                    foo: 'bar'
                  }
                });
              } catch (err) {
                error = err;
              } finally {
                done();
              }
            });
        });

        it('emits an invalid option error', () => {
          expect(/invalid option: encoding/i.test(error.message)).to.be.true;
        });
      });
    });
  });
});

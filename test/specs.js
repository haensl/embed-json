const join = require('path').join;
const fs = require('fs');
const expect = require('chai').expect;
const embedJson = require('../');
const fixturesPath = join(__dirname, 'fixtures');

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
            output = embedJson(html);
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
            output = embedJson(html);
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
          output = embedJson(html);
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
            embedJson(html);
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
  });
});

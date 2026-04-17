import { expect } from 'chai';
import { pack } from '../pack';
import { executeFormulaFromPackDef, newMockExecutionContext } from '@codahq/packs-sdk/dist/development';

describe('coda_tags pack', () => {
  let context: ReturnType<typeof newMockExecutionContext>;

  beforeEach(() => {
    context = newMockExecutionContext();
  });

  describe('ProcessText formula', () => {
    it('should extract tags from simple text with no exclusions', async () => {
      const result = await executeFormulaFromPackDef(
        pack,
        'ProcessText',
        ['The quick brown fox jumps over the lazy dog'],
        context
      );
      expect(result).to.be.a('string');
      expect(result).to.include('quick');
      expect(result).to.include('brown');
      expect(result).to.include('fox');
    });

    it('should exclude words from specified categories', async () => {
      const result = await executeFormulaFromPackDef(
        pack,
        'ProcessText',
        ['I love programming in JavaScript', ['pronouns', 'prepositions']],
        context
      );
      expect(result).to.not.include(' i,');
      expect(result).to.not.match(/\bi\b/);
      expect(result).to.not.include(' in,');
      expect(result).to.include('love');
      expect(result).to.include('programming');
    });

    it('should exclude custom words', async () => {
      const result = await executeFormulaFromPackDef(
        pack,
        'ProcessText',
        ['Hello world this is a test', ['articles'], ['hello', 'world']],
        context
      );
      expect(result).to.not.include('hello');
      expect(result).to.not.include('world');
      expect(result).to.include('test');
    });

    it('should apply custom excludes case-insensitively', async () => {
      const result = await executeFormulaFromPackDef(
        pack,
        'ProcessText',
        ['JavaScript python TypeScript', [], ['JAVASCRIPT', 'Python']],
        context
      );
      expect(result).to.equal('typescript');
    });

    it('should remove duplicate words while preserving order', async () => {
      const result = await executeFormulaFromPackDef(
        pack,
        'ProcessText',
        ['apple banana apple cherry banana'],
        context
      );
      const tags = result.split(', ');
      const uniqueTags = [...new Set(tags)];
      expect(tags).to.deep.equal(uniqueTags);
      expect(tags).to.include('apple');
      expect(tags).to.include('banana');
      expect(tags).to.include('cherry');
    });

    it('should filter out short words (less than 2 characters)', async () => {
      const result = await executeFormulaFromPackDef(pack, 'ProcessText', ['I a am OK go it'], context);
      // Single character words like "I" and "a" should be filtered out
      const tags = result.split(', ');
      for (const tag of tags) {
        expect(tag.length).to.be.at.least(2);
      }
    });

    it('should throw an error for empty text', async () => {
      try {
        await executeFormulaFromPackDef(pack, 'ProcessText', ['   '], context);
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.message).to.include('empty');
      }
    });

    it('should throw an error for text exceeding 50,000 characters', async () => {
      const longText = 'word '.repeat(10001);
      try {
        await executeFormulaFromPackDef(pack, 'ProcessText', [longText], context);
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.message).to.include('too long');
      }
    });

    it('should throw an error for invalid category names', async () => {
      try {
        await executeFormulaFromPackDef(pack, 'ProcessText', ['some text', ['invalidCategory']], context);
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.message).to.include('Invalid categories');
      }
    });

    it('should list all invalid category names in the error message', async () => {
      try {
        await executeFormulaFromPackDef(
          pack,
          'ProcessText',
          ['some text', ['invalidOne', 'invalidTwo']],
          context
        );
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.message).to.include('invalidOne, invalidTwo');
      }
    });

    it('should handle text with punctuation by stripping non-word characters', async () => {
      const result = await executeFormulaFromPackDef(pack, 'ProcessText', ['Hello, world! This is a test.'], context);
      // Individual tags should not contain punctuation from the input
      const tags = result.split(', ');
      for (const tag of tags) {
        expect(tag).to.not.match(/[,!.]/);
      }
      // Verify the words themselves are present (lowercased, punctuation-free)
      expect(tags).to.include('hello');
      expect(tags).to.include('world');
      expect(tags).to.include('test');
    });

    it('should convert text to lowercase', async () => {
      const result = await executeFormulaFromPackDef(pack, 'ProcessText', ['JavaScript TypeScript Python'], context);
      const tags = result.split(', ');
      for (const tag of tags) {
        expect(tag).to.equal(tag.toLowerCase());
      }
    });

    it('should handle multiple category exclusions', async () => {
      const result = await executeFormulaFromPackDef(
        pack,
        'ProcessText',
        [
          'The quick brown fox and the lazy dog are running very fast',
          ['articles', 'conjunctions', 'auxiliaryVerbs', 'adverbs'],
        ],
        context
      );
      expect(result).to.not.include('the');
      expect(result).to.not.include('and');
      expect(result).to.not.include('are');
      expect(result).to.not.include('very');
      expect(result).to.include('quick');
      expect(result).to.include('brown');
      expect(result).to.include('fox');
    });
  });

  describe('ExtractTags formula', () => {
    it('should extract tags with intelligent defaults', async () => {
      const result = await executeFormulaFromPackDef(
        pack,
        'ExtractTags',
        ['The quick brown fox jumps over the lazy dog'],
        context
      );
      expect(result).to.be.a('string');
      // Articles, prepositions, pronouns, etc. should be filtered by default
      expect(result).to.not.include('the');
      expect(result).to.include('quick');
      expect(result).to.include('brown');
      expect(result).to.include('fox');
    });

    it('should support custom excludes on top of defaults', async () => {
      const result = await executeFormulaFromPackDef(
        pack,
        'ExtractTags',
        ['Hello world this is a test', ['hello', 'world']],
        context
      );
      expect(result).to.not.include('hello');
      expect(result).to.not.include('world');
    });

    it('should filter negations and determiners as part of the default exclusions', async () => {
      const result = await executeFormulaFromPackDef(
        pack,
        'ExtractTags',
        ['This is not that other plan but a better idea'],
        context
      );
      expect(result).to.not.include('this');
      expect(result).to.not.include('not');
      expect(result).to.not.include('that');
      expect(result).to.not.include('other');
      expect(result).to.include('plan');
      expect(result).to.include('better');
      expect(result).to.include('idea');
    });

    it('should filter out default stop word categories', async () => {
      const result = await executeFormulaFromPackDef(
        pack,
        'ExtractTags',
        ['I am going to the store for some bread'],
        context
      );
      // pronouns, articles, prepositions, auxiliary verbs should be gone
      expect(result).to.not.include(' i,');
      expect(result).to.not.include('the');
      expect(result).to.not.include(' am,');
      expect(result).to.include('going');
      expect(result).to.include('store');
      expect(result).to.include('bread');
    });

    it('should return comma-separated results', async () => {
      const result = await executeFormulaFromPackDef(pack, 'ExtractTags', ['apple banana cherry mango'], context);
      expect(result).to.equal('apple, banana, cherry, mango');
    });

    it('should throw an error for empty text', async () => {
      try {
        await executeFormulaFromPackDef(pack, 'ExtractTags', [''], context);
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.message).to.include('empty');
      }
    });
  });

  describe('ExtractTagsArray formula', () => {
    it('should return tags as an array', async () => {
      const result = await executeFormulaFromPackDef(
        pack,
        'ExtractTagsArray',
        ['The quick brown fox jumps over the lazy dog'],
        context
      );
      expect(result).to.deep.equal(['quick', 'brown', 'fox', 'jumps', 'lazy', 'dog']);
    });

    it('should support custom excludes', async () => {
      const result = await executeFormulaFromPackDef(
        pack,
        'ExtractTagsArray',
        ['Hello world this is a test', ['hello', 'world']],
        context
      );
      expect(result).to.deep.equal(['test']);
    });
  });

  describe('Pack formula examples validation', () => {
    for (const formula of pack.formulas ?? []) {
      describe(`${formula.name} examples`, () => {
        if (!formula.examples || formula.examples.length === 0) {
          it('should have examples defined', () => {
            expect.fail(`Formula ${formula.name} has no examples`);
          });
          return;
        }

        for (let i = 0; i < formula.examples.length; i++) {
          const example = formula.examples[i];
          it(`example ${i + 1}: ${formula.name}(${JSON.stringify(example.params).slice(0, 80)})`, async () => {
            const result = await executeFormulaFromPackDef(pack, formula.name, example.params as any, context);
            expect(result).to.deep.equal(example.result);
          });
        }
      });
    }
  });
});

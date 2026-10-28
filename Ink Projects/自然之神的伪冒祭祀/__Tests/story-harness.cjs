'use strict';

const path = require('node:path');

const MAX_CONTINUE_STEPS = 10000;

class StoryHarness {
  constructor(compiled) {
    this.compiled = compiled;
    this.story = new compiled.inkjs.Story(compiled.json);
    this.output = '';
    this.steps = 0;
    this.story.onError = (message, type) => {
      throw new Error(`Ink runtime error (${type}): ${message}`);
    };
    this.continueToPrompt();
  }

  continueToPrompt() {
    let produced = '';
    while (this.story.canContinue) {
      produced += this.story.Continue();
      if (++this.steps > MAX_CONTINUE_STEPS) {
        throw new Error(`Story produced more than ${MAX_CONTINUE_STEPS} continuation steps without stopping`);
      }
    }
    this.output += produced;
    return produced;
  }

  choiceTexts() {
    return this.story.currentChoices.map((choice) => choice.text);
  }

  choose(exactText) {
    const indexes = [];
    this.story.currentChoices.forEach((choice, index) => {
      if (choice.text === exactText) indexes.push(index);
    });
    if (indexes.length === 0) {
      throw new Error(
        `No choice with the exact text ${JSON.stringify(exactText)}. Available choices: ${JSON.stringify(this.choiceTexts())}`,
      );
    }
    if (indexes.length > 1) {
      throw new Error(
        `Choice text ${JSON.stringify(exactText)} is ambiguous (${indexes.length} matches at indexes ${indexes.join(', ')}). ` +
          `Available choices: ${JSON.stringify(this.choiceTexts())}`,
      );
    }
    this.story.ChooseChoiceIndex(indexes[0]);
    return this.continueToPrompt();
  }

  goto(pathString) {
    this.story.ChoosePathString(pathString);
    return this.continueToPrompt();
  }

  variable(name) {
    if (!this.story.variablesState.GlobalVariableExistsWithName(name)) {
      throw new Error(`Unknown story variable ${JSON.stringify(name)}`);
    }
    return this.story.variablesState.$(name);
  }

  setVariable(name, value) {
    this.story.variablesState.$(name, value);
    return this;
  }

  visitCount(pathString) {
    const { Path } = require(path.join(this.compiled.inkjsRoot, 'engine', 'Path.js'));
    const resolved = this.story.ContentAtPath(new Path(pathString));
    if (!resolved.container) {
      throw new Error(`No story container at path ${JSON.stringify(pathString)}`);
    }
    if (!resolved.container.visitsShouldBeCounted) {
      throw new Error(
        `Visit counting is not enabled for ${JSON.stringify(pathString)}; the runtime would silently report 0`,
      );
    }
    return this.story.state.VisitCountAtPathString(pathString);
  }

  listContains(name, itemName) {
    const list = this.variable(name);
    if (!list || typeof list.ContainsItemNamed !== 'function') {
      throw new Error(`Story variable ${JSON.stringify(name)} is not a list`);
    }
    return list.ContainsItemNamed(itemName);
  }
}

module.exports = { StoryHarness };

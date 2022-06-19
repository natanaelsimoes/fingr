describe('Empty test', () => {

  it('Should pass', async () => {
    await new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });
  });

});
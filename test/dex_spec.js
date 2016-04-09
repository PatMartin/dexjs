describe("dex", function () {
  it("dex", function () {
    expect(dex).toBeDefined();
    expect(dex.array).toBeDefined();
    expect(dex.matrix).toBeDefined();
  })

  it("range", function () {
    expect(dex.range(1, 5)).toEqual([1, 2, 3, 4, 5]);
  });
});
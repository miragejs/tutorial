/*
  I want a Boolean param that serializes to ?open when true and nothing when false
  use-query-params serializes "null" as ?name and "undefined" as nothing
*/
export const BooleanParam = {
  encode: (bool) => (bool ? null : undefined),
  decode: (bool) => bool === null,
};

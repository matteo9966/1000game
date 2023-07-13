export function reachedVoteThreshold(totalplayers: number, voters: number) {
  if (totalplayers <= 0 || voters <= 0) return false;
  let min = 1;
  if (totalplayers === 1) {
    return false
  } else if (totalplayers === 2) {
    min = 1;
  } else if (totalplayers === 3) {
    min = 2;
  } else {
    min = Math.ceil(totalplayers / 2);
  }

  if (voters >= min) {
    return true;
  }

  return false;
}


export const swap = (arr, i, j) => {
  const temp = arr[i]
  arr[i] = arr[j]
  arr[j] = temp
}

// 获取 pivot 交换完后的index
export const partition = (arr, pivot, left, right, kind) => {
  const pivotVal = arr[pivot][kind]
  let startIndex = left
  for (let i = left; i < right; i++) {
    if (arr[i][kind] < pivotVal) {
      swap(arr, i, startIndex)
      startIndex++
    }
  }
  swap(arr, startIndex, pivot)
  return startIndex
}

export const quickSort = (arr, left, right, kind) => {
  if (left < right) {
    let pivot = right
    let partitionIndex = partition(arr, pivot, left, right, kind)
    quickSort(arr, left, partitionIndex - 1 < left ? left : partitionIndex - 1, kind)
    quickSort(arr, partitionIndex + 1 > right ? right : partitionIndex + 1, right, kind)
  }
}
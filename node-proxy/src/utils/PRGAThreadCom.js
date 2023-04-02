const { isMainThread, parentPort, workerData } = require('worker_threads')

// 如果是线程执行了这个文件，就开始处理
if (!isMainThread) {
  // 异步线程去计算这个位置
  const PRGAExcute = function (data) {
    let { sbox: S, i, j, position } = data
    for (let k = 0; k < position; k++) {
      i = (i + 1) % 256
      j = (j + S[i]) % 256
      // swap
      const temp = S[i]
      S[i] = S[j]
      S[j] = temp
    }
    // return this position info
    return { sbox: S, i, j }
  }
  // workerData 由主线程发送过来的信息
  parentPort.on('message', (data) => {
    const startTime = Date.now()
    const res = PRGAExcute(data)
    parentPort.postMessage(res)
    const time = Date.now() - startTime
    console.log('@@@PRGAExcute-end', data.position, Date.now(), '@time:' + time, workerData)
  })
}
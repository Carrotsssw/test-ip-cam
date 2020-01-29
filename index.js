const onvif = require('node-onvif')
const fs = require('fs')

const listDevice = async () => {
  const deviceList = await onvif.startProbe()
  deviceList.forEach((info) => {
    console.log('- ' + info.urn)
    console.log('  - ' + info.name)
    console.log('  - ' + info.xaddrs[0])
  })
  return deviceList
}

const initDevice = async (uuid) => {
  const deviceList = await listDevice()
  const selectedDevice = deviceList.find(o => ( o.urn === uuid ))
  console.log('deviceList', deviceList)

  if (!selectedDevice) {
    throw Error('uuid not match with device!!')
  }
  const device = new onvif.OnvifDevice({
    xaddr: selectedDevice.xaddrs[0],
    user : 'admin',
    pass : '112233'
  })
  await device.init()
  return device
}

const snapshot = async (device) => {
  console.log('fetching the data of the snapshot...')
  const result = await device.fetchSnapshot()
  return fs.writeFileSync('snapshot.jpg', result.body, { encoding: 'binary' })
}

const startProcess = async (uuid) => {
  try {
    const device = await initDevice(uuid)
    await snapshot(device)
    console.log('Done!')
  } catch (err) {
    console.log(err)
  }
}

// const selectedUuidDevice = 'urn:uuid:5a4d5148-3656-344d-3930-30304c574a01'
// startProcess(selectedUuidDevice)
listDevice()
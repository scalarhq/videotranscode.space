const codecs = require('../../codecs/codecs')

describe('Validate Codec Test', () => {
  it('IS Defined', () => {
    expect(codecs.validateCodec).toBeDefined()
    expect(typeof codecs.validateCodec).toBe('function')
  })

  it('Valid Codec Test', () => {
    const codec = {
      name: 'TestCodec',
      compressionRange: {
        min: 1,
        max: 51
      },
      ffmpegLib: 'libTest'
    }
    const err = codecs.validateCodec('TEST', codec)
    expect(err).toBeFalsy()
  })

  it('Duplicate Codec Test', () => {
    const codec = {
      name: 'TestCodec',
      compressionRange: {
        min: 1,
        max: 51
      },
      ffmpegLib: 'libTest'
    }
    const err = codecs.validateCodec('H264', codec)
    expect(err).toBeTruthy()
    expect(err.message.includes('Codec type for')).toBeTruthy()
  })

  it('No max compression level', () => {
    const codec = {
      name: 'noMax',
      compressionRange: {
        min: 1
      },
      ffmpegLib: 'noMax'
    }
    const err = codecs.validateCodec('H264', codec)
    expect(err).toBeTruthy()
  })

  it('No min compression level', () => {
    const codec = {
      name: 'noMin',
      compressionRange: {
        max: 10
      },
      ffmpegLib: 'noMin'
    }
    const err = codecs.validateCodec('H264', codec)
    expect(err).toBeTruthy()
  })

  it('Max smaller than min compression level', () => {
    const codec = {
      name: 'minLargerThanMax',
      compressionRange: {
        max: 10,
        min: 100
      },
      ffmpegLib: 'minLargerThanMax'
    }
    const err = codecs.validateCodec('H264', codec)
    expect(err).toBeTruthy()
  })

  it('FFmpegLib not Defined', () => {
    const codec = {
      name: 'noLib',
      compressionRange: {
        max: 10,
        min: 100
      }
    }
    const err = codecs.validateCodec('noLib', codec)
    expect(err).toBeTruthy()
  })

  it('Name Not Defined', () => {
    const codec = {
      compressionRange: {
        max: 10,
        min: 100
      },
      ffmpegLib: 'noName'
    }
    const err = codecs.validateCodec('noName', codec)
    expect(err).toBeTruthy()
  })
})

describe('Initialization Function', () => {
  beforeAll(() => {
    codecs.deleteCodecTypes()
  })
  it('IS Defined', () => {
    expect(codecs.init).toBeDefined()
    expect(typeof codecs.init).toBe('function')
  })

  it('Build without errors', () => {
    try {
      codecs.init()
    } catch (err) {
      expect(err).toBeUndefined()
    }
  })
})

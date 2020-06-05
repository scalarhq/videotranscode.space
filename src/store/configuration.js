export const FORMAT_TYPES = {
    MP4: {
        name: 'mp4'
    },
    AVI: {
        name: 'avi'
    },
    WMV: {
        name: 'wmv'
    }
}

export const CODEC_TYPES = {
    H264: {
        name: 'H.264',
        compressionRange: {
            min: 1,
            max: 51
        }
    },
    MPEG4: {
        name: 'MPEG-4',
        compressionRange: {
            min: 1,
            max: 31
        }
    }
}

export const CONFIG_OPTION_TYPES = {
    FORMAT: 'format',
    CODEC: 'codec',
    COMPRESSION: 'compression'
}

export const find = (type, name) => {
    let t = null
    if (type === CONFIG_OPTION_TYPES.FORMAT) t = FORMAT_TYPES
    if (type === CONFIG_OPTION_TYPES.CODEC) t = CODEC_TYPES
    if (!t) return null

    return Object.keys(t).map(key => t[key]).find(e => e.name === name)
}

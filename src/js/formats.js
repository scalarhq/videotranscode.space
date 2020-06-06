export const formats = {
    "mp4" : {
        "extension" : ".mp4",
        "type" : "video/mp4",
        "default-codec" : "",
        "supported-codecs" : ["libx264"],
        "display" : true
    },

    "mov" : {
        "extension" : ".mov",
        "type" : "video/mov",
        "default-codec" : "",
        "supported-codecs" : ["libx264"],
        "display" : true
    },
    
    "avi" : {
        "extension" : ".avi",
        "type" : "video/avi",
        "default-codec" : "libxvid",
        "supported-codecs" : ["libxvid", "mpeg4"],
        "display" : false
    },

    "wmv" : {
        "extension" : ".wmv",
        "type" : "video/wmv",
        "default-codec" : "wmv2",
        "supported-codecs" : ["wmv2", "msmpeg4"],
        "display" : false
    }


}

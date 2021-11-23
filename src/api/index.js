import * as user from './service/user'
import * as images from './service/images'
import * as video from './service/video'
import * as content from './service/content'
import * as choose from './service/choose'
import * as portmap from './service/portmap'
import * as portpointmap from './service/portpointmap'
export default {
    ...user,
    ...images,
    ...video,
    ...content,
    ...choose,
    ...portmap,
    ...portpointmap,
}
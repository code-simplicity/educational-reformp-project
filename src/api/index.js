import * as user from './service/user'
import * as images from './service/images'
import * as video from './service/video'
import * as content from './service/content'
export default {
    ...user,
    ...images,
    ...video,
    ...content,
}
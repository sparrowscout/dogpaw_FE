
import { useEffect, useState } from "react";
import { QueryClient, useMutation, useQueryClient } from "react-query";
import { usePostBookmark } from "../hook/useUserData";
import instance from "../shared/axios";
import { ReactComponent as BookmarkIcon } from "../styles/icon/post/bookmark.svg";
import { ReactComponent as BookmarkFill } from "../styles/icon/post/bookmarkFill.svg";


const UserBookmark = ({
    postId,
    currentTab,
    bookmarkStatus
}) => {

    const [isMyBookmark, setIsMyBookmark] = useState(true);

    useEffect(() => {
    }, [isMyBookmark])

    // const DoBookmark = async (postId) => {
    //     setIsMyBookmark((prev) => !prev)
    //     return await instance.post(`/api/bookMark/${postId}`)
    // }

    const queryClient = useQueryClient();

    // const bookmarkMutation = useMutation(["bookmark", postId], DoBookmark, {
    //     onSuccess: () => {
    //         queryClient.invalidateQueries("applyproject", "joinproject", "mybookmark");
    //     }
    // })

    const bookmark = () => {
        setIsMyBookmark((prev) => !prev)
        doBookmark(postId)
        queryClient.invalidateQueries("applyproject", "joinproject", "mybookmark");
    }
    const {mutate : doBookmark } = usePostBookmark()

    if (currentTab === 1) {
        return (

            <>

                {(isMyBookmark) ?
                    <BookmarkFill style={{ marginLeft: "auto" }} onClick={bookmark} />
                    : <BookmarkIcon style={{ marginLeft: "auto" }} onClick={bookmark} />
                }

            </>
        )
    }
    if (currentTab === 4) {
        return null
    }
    return (
        <>

            {(bookmarkStatus) ?
                <BookmarkFill style={{ marginLeft: "auto" }} onClick={bookmark} />
                : <BookmarkIcon style={{ marginLeft: "auto" }} onClick={bookmark } />
            }

        </>
    )
}

export default UserBookmark;

import type {
  Comment,
  CreateCommentDto,
} from '~/types'

export const useCommentsApi = () => {
  const api = useApi()

  return {
    createComment: (data: CreateCommentDto) =>
      api.post<Comment>('/comments', data),

    getCommentsForOrder: (orderId: string) =>
      api.get<Comment[]>(`/comments/order/${orderId}`),

    getUnreadComments: () =>
      api.get<Comment[]>('/comments/unread'),

    markAsRead: (id: string) =>
      api.patch<Comment>(`/comments/${id}/read`),

    markAllAsRead: () =>
      api.patch('/comments/read-all'),
  }
}

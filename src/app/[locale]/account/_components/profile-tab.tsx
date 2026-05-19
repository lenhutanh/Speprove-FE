import { Col, InputField, ReadOnlyInputField, Row } from '@/components/form'
import { BaseForm } from '@/components/form/base-form'
import Button from '@/components/form/button'
import ProfileAvatarField from '@/components/form/profile-avatar-field'
import { IMAGE_PURPOSE } from '@/constants'
import { useUpdateProfileMutation } from '@/queries'
import { useUploadImageMutation } from '@/queries/file.query'
import { useAppLoadingStore, useAuthStore } from '@/store'
import { UpdateProfileType } from '@/types'
import { getInitials } from '@/utils'
import { updateProfileSchema } from '@/validations'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'
import { toast } from 'sonner'

const defaultValues: UpdateProfileType = {
  fullName: '',
  avatarId: undefined,
}

export default function ProfileTab() {
  const common = useTranslations('common')
  const updateProfileMutation = useUpdateProfileMutation()
  const { withLoading } = useAppLoadingStore()
  const { user, setUser } = useAuthStore()
  const uploadImageMutation = useUploadImageMutation()

  const initialValues = useMemo<UpdateProfileType>(
    () => ({
      fullName: user?.fullName || '',
      avatarId: undefined,
    }),
    [user?.fullName],
  )

  const onSubmit = async (values: UpdateProfileType) => {
    await withLoading(
      updateProfileMutation.mutateAsync(values, {
        onSuccess: (res) => {
          if (res.success) {
            toast.success(res.message)
            if (res.data) {
              setUser(res.data)
            }
          } else {
            toast.error(res.message)
          }
        },
      }),
    )
  }

  return (
    <div>
      <BaseForm
        onSubmit={onSubmit}
        defaultValues={defaultValues}
        initialValues={initialValues}
        initialValuesKey={user?.id ?? null}
        schema={updateProfileSchema}
      >
        {(form) => (
          <>
            <Row>
              <Col className='items-center'>
                <ProfileAvatarField
                  control={form.control}
                  name='avatarId'
                  currentImageUrl={user?.avatarUrl}
                  fallback={getInitials(user?.fullName)}
                  uploadAvatar={async (file) => {
                    const res = await uploadImageMutation.mutateAsync({
                      image: file,
                      purpose: IMAGE_PURPOSE.AVATAR,
                    })

                    return {
                      id: res.data.id,
                      url: res.data.url,
                    }
                  }}
                />
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <InputField
                  control={form.control}
                  label={common('full_name')}
                  name='fullName'
                  type='text'
                  required
                />
              </Col>
              <Col span={12}>
                <ReadOnlyInputField
                  label={common('email')}
                  value={user?.email}
                />
              </Col>
            </Row>
            <Button type='submit' className='w-full sm:w-fit' size={'lg'}>
              {common('save')}
            </Button>
          </>
        )}
      </BaseForm>
    </div>
  )
}

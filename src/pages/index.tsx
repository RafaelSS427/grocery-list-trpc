import { FormEvent, useCallback, useEffect, useRef, useState } from 'react'
import Head from 'next/head'
import { Button, Input } from '@/components'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import { trpc } from '@/utils/trpc'
import { CheckedState } from '@radix-ui/react-checkbox'
import { Loader2 } from 'lucide-react'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [itemsToDelete, setItemsToDelete] = useState<string[]>([])
  const { data, refetch, isFetching } = trpc.grocery.getAll.useQuery()

  const createNewItem = trpc.grocery.create.useMutation()
  const deleteItem = trpc.grocery.delete.useMutation()
  const checkItem = trpc.grocery.check.useMutation()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!inputRef.current || !inputRef.current.value) return
    const value = inputRef.current.value
    // const formData = Object.fromEntries(new FormData(e.currentTarget))

    try {
      await createNewItem.mutateAsync({
        title: value
      })

      inputRef.current.value = ''
      await refetch()
    } catch (e) {
      console.error(e)
    }
  }

  const handleCheckedChange = async(e: CheckedState, id: string) => {
    // console.log(e)
    try {
      await checkItem.mutateAsync({
        id,
        checked: e as boolean
      })
      
      await refetch()

    } catch(e) {
      console.error(e)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      setItemsToDelete([...itemsToDelete, id])
      await deleteItem.mutateAsync({
        id
      })
      
      await refetch()
    } catch (e) {
      console.error(e)
    }
  }

  const checkItemsToDelete = useCallback((id: string) => {
    const result = !!itemsToDelete.find(item => id === item)

    return result
  }, [itemsToDelete])

  useEffect(() => { // clear list
    if(itemsToDelete.length === 0) return
    setItemsToDelete([])
  }, [data])

  return (
    <>
      <Head>
        <title>Grocery app</title>
      </Head>

      <main className={`container mx-auto max-w-screen-sm ${inter.className}`}>
        <header>
          <nav className="py-4">
            <h1 className="text-2xl font-semibold tracking-tighter uppercase">Grocery List</h1>
          </nav>
        </header>

        <div className="flex flex-col gap-5">
          <form onSubmit={handleSubmit} className="flex justify-center items-center gap-2">
            <Input autoFocus ref={inputRef} name="title" type="text" />
            <Button disabled={createNewItem.isLoading} variant="default" type="submit">
              {
                (createNewItem.isLoading) ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding
                  </>
                ) : (
                  <>
                    Add
                  </>
                )
              }
            </Button>
          </form>
          <ScrollArea className="h-[75vh] w-full">
            <ul>
              {
                data?.map(item => (
                  <li key={item.id} className="transition-colors duration-200 rounded p-2 flex justify-between items-center hover:bg-gray-50">
                    <div className="flex items-center gap-2">
                      <p className={`${item.checked ? 'line-through' : 'no-underline'}`}>{item.title}</p> <Checkbox disabled={(checkItem.isLoading || isFetching) && checkItemsToDelete(item.id)} checked={ item.checked as CheckedState } onCheckedChange={(e) => handleCheckedChange(e, item.id)} />
                    </div>

                    <Button disabled={(deleteItem.isLoading || isFetching) && checkItemsToDelete(item.id)} variant="link" onClick={() => handleDelete(item.id)}>
                      {
                        ((deleteItem.isLoading || isFetching) && checkItemsToDelete(item.id)) ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Removing
                          </>
                        ) : (
                          <>
                            Remove
                          </>
                        )
                      }
                    </Button>
                  </li>
                ))
              }
            </ul>
          </ScrollArea>
        </div>
      </main>

      <footer className="flex items-center justify-center h-[calc((100vh-(80vh+124px)))]">
        <p>Created by <a className="transition-colors duration-300 underline hover:text-[rgba(0,0,0,0.6)]" href="https://rafael-sequeira-sandoval.dev" target="_blank" rel="noopener noreferrer">Rafael Sequeira Sandoval</a></p>
      </footer>
    </>
  )
}
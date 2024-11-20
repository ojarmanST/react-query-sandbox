import "./App.css";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"; //handles all data fetching
// 'https://jsonplaceholder.typicode.com/todos'
import { getData } from "./utils";
function App() {
  const queryClient = useQueryClient({
    defaultOptions: { queries: { staleTime: 60000, gcTime: 10 * (60 * 1000) } },
  });

  // const getData = () =>
  //   fetch("https://jsonplaceholder.typicode.com/posts").then((res) =>
  //     res.json()
  //   );

  const { data, error, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: () => getData(),
    // gcTime: 6000, //garbage collection time, previously known as cache time
    // staleTime: 60000, // if no changes in query in 60 seconds it'll refetch the data
    // refetchInterval: 4000, // refetches data every 4 seconds
    // retry: 5, // will retry this amount of times before accepting failure
  });

  const { mutate, isPending, isError } = useMutation({
    mutationFn: (newPost) =>
      fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        body: JSON.stringify(newPost),
        headers: { "Content-type": "application/json; charset=UTF-8" },
      }).then((res) => res.json()),
    onSuccess: (newPost) => {
      queryClient.setQueryData(["posts"], (oldPosts) => [...oldPosts, newPost]);
    },
  });
  console.log(data);

  if (error || isError) return <h1>Error</h1>;
  if (isLoading) return <h1>Loading</h1>;

  return (
    <div className="App">
      {isPending && <p>DATA IS BEING ADDED</p>}
      <button
        onClick={() =>
          mutate({
            userId: 5000,
            id: 4000,
            title: "Hey this is a new post!",
            body: "This is the body of the post",
          })
        }
      >
        Add Post
      </button>
      {data.map((todo) => (
        <div key={todo.id}>
          <h4>{todo.id}</h4>
          <h4>{todo.title}</h4>
          <p>{todo.body}</p>
        </div>
      ))}
    </div>
  );
}

export default App;

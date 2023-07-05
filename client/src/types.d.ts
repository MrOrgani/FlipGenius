interface Collection {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  authorId: number;
  words: Record<string, string>;
}

interface User {
  name: string;
  email: string;
  password: string;
  authorID: number;
}

interface Word {
  definition: string;
  successRate: number;
}

type QueryProps = Record<"collectionId" | "userId", string | undefined>;

type Loader = (
  queryClient: QueryClient
) => ({ params }: Record<string, QueryProps>) => Promise<any>;
type Loader = (
  queryClient: QueryClient
) => ({ params }: QueryProps) => Promise<any>;

interface CollectionParams {
  userId: string;
  collectionId: string;
}

type Action = (
  queryClient: QueryClient
) => ({
  params,
  request,
}: {
  params: CollectionParams;
  request: Request;
}) => Promise<Response | null>;

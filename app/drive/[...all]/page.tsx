const page = async ({ params }: { params: { all: Promise<string[]> } }) => {
  const { all } = await params;

  return <div>page</div>;
};

export default page;

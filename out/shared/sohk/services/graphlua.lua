return {
    calculateEdges = function(nodes: Folder)
        local nodesFolder = nodes;
        local adjList = {} -- adjacency list
        local nextNode = {} -- what node is next when walking anticlockwise around walls ?
        -- a setup loop
        for _, vPart in pairs(nodesFolder:GetChildren()) do
            adjList[vPart] = {}
            nextNode[vPart] = {}
        end 

        for _, vPart in pairs(nodesFolder:GetChildren()) do
            for _, w in pairs(vPart:GetChildren()) do
                -- Build up adjacency list connecting nodes to its neighbours
                local wPart = nodesFolder:FindFirstChild(w.Name)
                table.insert(adjList[vPart], wPart)
                table.insert(adjList[wPart], vPart)
            end
        end

        local visited = {} -- have we visited this edge before ?
        local angle = {} -- what is the angle of a point relative to another point ?
        for node, neighbours in pairs(adjList) do
            visited[node] = {}
            angle[node] = {}
            
            -- calculate angles with some basic trigonometry
            for _, neighbour in pairs(neighbours) do
                local delta = neighbour.Position - node.Position
                angle[node][neighbour] = math.deg(math.atan2(delta.X, delta.Z))
            end
            
            -- sort each adjacency list by angle, we can now walk anticlockwise around a node
            table.sort(neighbours, function(a, b)
                return angle[node][a] < angle[node][b]
            end)
            
            if #neighbours >= 1 then
                -- connect end of list to front
                nextNode[node][neighbours[#neighbours]] = neighbours[1]
                -- and the rest together
                for i = 2, #neighbours do
                    nextNode[node][neighbours[i-1]] = neighbours[i]
                end
            end
        end

        -- just some visualisation code
        --local colorId = 1
        --[[
        local function drawWalls(perimeter)
            local function rand()
                return (math.random() - 0.5) * 0.5
            end
            for i = 2, #perimeter do
                local vPart, wPart = perimeter[i-1], perimeter[i]
                print(vPart, wPart)
                -- Draw Walls
                local line = Instance.new("Part", workspace)
                line.Anchored = true
                line.Size = Vector3.new(0.2, 0.2, (wPart.Position - vPart.Position).magnitude)
                local noise = Vector3.new(rand(), rand(), rand())
                line.CFrame = CFrame.new(wPart.Position:lerp(vPart.Position, 0.5), vPart.Position) + noise
                line.BrickColor = BrickColor.palette(colorId)
                line.Transparency = 0
                line.TopSurface = Enum.SurfaceType.Smooth
            end
            colorId = (colorId + 11) % 256
        end]]
        local loops = {};
        -- the main loop
        for nodeA, neighbours in pairs(adjList) do
            for _, nodeB in pairs(neighbours) do
                -- if we've visited an edge before, it's already part of a room or not a part of any room
                if not visited[nodeA][nodeB] then
                    visited[nodeA][nodeB] = true
                    local loop = {nodeA, nodeB} -- the room has at least one wall, let's find the rest
                    local pivot, from = nodeB, nodeA -- by doing a counter-clockwise walk
                    local totalAngle = 0 -- ensure we're not walking along the exterior by keeping track of the total angle walked
                    while true do
                        local to = nextNode[pivot][from]
                        if visited[pivot][to] then
                            break
                        else
                            totalAngle = totalAngle + (angle[pivot][to] - angle[pivot][from]) % 360
                            visited[pivot][to] = true
                            table.insert(loop, to)
                            pivot, from = to, pivot
                        end
                    end
                    if totalAngle/(#loop-2) < 180 then -- ensure not an exterior
                        table.insert(loops, loop)
                    end
                end
            end
        end
        return loops;
    end
}
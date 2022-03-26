-- Compiled with roblox-ts v1.2.3
local tagService = {}
do
	local _container = tagService
	local tagger
	do
		tagger = setmetatable({}, {
			__tostring = function()
				return "tagger"
			end,
		})
		tagger.__index = tagger
		function tagger.new(...)
			local self = setmetatable({}, tagger)
			return self:constructor(...) or self
		end
		function tagger:constructor()
			self.tags = {}
		end
		function tagger:tag(tag, value, removeAfter)
			if removeAfter == nil then
				removeAfter = -1
			end
			-- ▼ Map.set ▼
			self.tags[tag] = value
			-- ▲ Map.set ▲
			if removeAfter ~= -1 then
				coroutine.wrap(function()
					task.wait(removeAfter)
					-- ▼ Map.delete ▼
					self.tags[tag] = nil
					-- ▲ Map.delete ▲
				end)()
			end
		end
		function tagger:untag(tag)
			-- ▼ Map.delete ▼
			self.tags[tag] = nil
			-- ▲ Map.delete ▲
		end
		function tagger:getTag(tag)
			return self.tags[tag]
		end
		function tagger:getAllTags()
			return self.tags
		end
	end
	_container.tagger = tagger
end
return tagService
